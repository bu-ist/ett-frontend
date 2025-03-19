import { useState, useContext } from 'react';
import { nanoid } from 'nanoid';
import Cookies from 'js-cookie';

import { Box, Text, Heading, Divider, FormControl, FormLabel, Button, Spinner, useDisclosure } from '@chakra-ui/react';

import { ConfigContext } from '../../../lib/configContext';

import { sendExhibitFormAPI } from '../../../lib/consenting/sendExhibitFormAPI';

import ContactEditModal from './contactEditModal';
import ContactDisplayCard from './contactDisplayCard';
import EntityAutocomplete from './entityAutocomplete'; //not sure if we are using this

// Contains the full contact list form and form state.
export default function ContactList({ consentData, formConstraint, entityId }) {
    const { appConfig } = useContext(ConfigContext);

    // State for the form submission result.
    const [submitResult, setSubmitResult] = useState('idle');

    // State for the contact list form data.
    const [entity, setEntity] = useState('');
    const [contacts, setContacts] = useState([]);

    // State for the contact modal.
    const [contactModalId, setContactModalId] = useState('');
    const [isEditOrAdd, setIsEditOrAdd] = useState('add');

    const { isOpen, onOpen, onClose } = useDisclosure();

    // Get then name of the matching entity from the consent data.
    const entityName = consentData.entities.find((entity) => entity.entity_id === entityId)?.entity_name;

    // Handle contact field change
    const handleContactChange = (id, e) => {
        const { name, value } = e.target;
        const updatedContacts = contacts.map((contact) => 
            contact.id === id ? { ...contact, [name]: value } : contact
        );
        setContacts(updatedContacts);
    };

    // Radio button change handler has a custom handler because 'event' returned is just the radio button value.
    function handleOrgTypeRadioChange(id, value) {
        const updatedContacts = contacts.map((contact) =>
            contact.id === id ? { ...contact, organizationType: value } : contact
        );
        setContacts(updatedContacts);
    }

    // Add a new blank contact card to the form state data and open the editing modal.
    function handleAddContact() {
        // Signal that the modal is for adding a new contact.
        setIsEditOrAdd('add');

        // Generate a new ID for the new contact.
        const newId = nanoid();

        // Add the new blank contact to the form state.
        setContacts([
            ...contacts,
            {
                id: newId,
                organizationName: '',
                organizationType: '',
                contactName: '',
                contactTitle: '',
                contactEmail: '',
                contactPhone: ''
            }
        ]);

        // Open the editing modal for the new contact.
        setContactModalId(newId);
        onOpen();
    }

    // Handle editing an existing contact by setting the modal to edit mode and opening it.
    function handleEditContact(id) {
        // Signal that the modal is for editing an existing contact.
        setIsEditOrAdd('edit');
        setContactModalId(id);
        onOpen();
    }

    function removeContact(id) {
        const updatedContacts = contacts.filter((contact) => contact.id !== id);
        setContacts(updatedContacts);
    }

    // Handle form submission
    async function handleSubmit(e) {
        e.preventDefault();

        const accessToken = Cookies.get('EttAccessJwt');
        const idToken = Cookies.get('EttIdJwt');
        const email = JSON.parse(atob(idToken.split('.')[1])).email;

        // Send the contact list to the API.
        const response = await sendExhibitFormAPI(appConfig, accessToken, contacts, entityId, email, formConstraint);

        console.log('send exhibit form response', response);
        
        setSubmitResult(response.payload.ok ? 'success' : 'error');

    };

    // The formConstraint is either 'current', 'other', or 'both'.
    const constraintMessages = {
        'current': 'Current Employer(s) only',
        'other': 'Prior Employer(s) and other Affiliates',
        'both': 'All Employer(s) and Affiliates, including Prior Employers'
    };

    return (
        <Box>
            <Heading as="h2" mb="4" size="lg">New Contact List for {consentData.fullName}</Heading>
            <Text mb="4">
                {`This is a request for ${constraintMessages[formConstraint]}.`}
            </Text>
            <FormControl my="8" as="form" onSubmit={handleSubmit}>
                <Heading my="4" as={"h3"} size={"md"}>Receiving Institution</Heading>
                {/* Commented out, not sure if this is what ultimately to be used.
                <Text mb="4">Irure esse ex ipsum elit tempor id esse in cillum id officia ipsum. Culpa labore consectetur esse excepteur incididunt ex eu aliqua laboris esse esse occaecat elit.</Text>
                <FormLabel>Select the Receiving Institution</FormLabel>
                <EntityAutocomplete entities={consentData.entities} entity={entity} setEntity={setEntity} />
                */}
                <Text mb="4" fontSize="2xl">
                    {entityName}
                </Text>
                <Divider my="4" />
                <Heading my="4" as={"h3"} size={"md"}>Contacts</Heading>      
                {contacts.length > 0 && contacts.map((contact, index) => (
                    <ContactDisplayCard
                        key={contact.id}
                        contact={contact}
                        handleEditContact={handleEditContact}
                        removeContact={removeContact}
                    />
                ))}
                {contacts.length == 0 && <Text>Click the Add Contact button to begin</Text>}
                {contacts.length > 0 && (
                    <ContactEditModal
                        isOpen={isOpen}
                        onClose={onClose}
                        isEditOrAdd={isEditOrAdd}
                        contact={contacts.find((contact) => contact.id === contactModalId) || {}}
                        removeContact={removeContact}
                        handleContactChange={handleContactChange}
                        handleOrgTypeRadioChange={handleOrgTypeRadioChange}
                    />
                )}
                <Button mt="0.5em" onClick={handleAddContact}>Add Contact</Button>
                <Divider my="1em" />
                <Button mt="0.5em" isDisabled={submitResult != 'idle'} type="submit">
                    {submitResult === 'idle' && 'Submit'}
                    {submitResult === 'loading' && <Spinner />}
                    {submitResult === 'success' && 'Submitted'}
                    {submitResult === 'error' && 'Error'}
                </Button>
            </FormControl>
            {submitResult === 'success' && <Text>Form submitted successfully.</Text>}
            {submitResult === 'error' && <Text>There was an error submitting the form.</Text>}
        </Box>
    );
}
