import { useState } from 'react';
import { nanoid } from 'nanoid';
import Cookies from 'js-cookie';

import { Box, Text, Heading, Divider, FormControl, FormLabel, Button, Spinner, useDisclosure } from '@chakra-ui/react';

import { sendExhibitFormAPI } from '../../../lib/consenting/sendExhibitFormAPI';

import ContactEditCard from './contactEditCard';
import ContactEditModal from './contactEditModal';
import ConsenterCard from '../consentFormPage/consenterCard';
import EntityAutocomplete from './entityAutocomplete';

// Contains the full contact list form and form state.
export default function ContactList({ consentData }) {

    // State for the form submission result.
    const [submitResult, setSubmitResult] = useState('idle');

    // State for the contact list form data.
    const [entity, setEntity] = useState('');
    const [contacts, setContacts] = useState([]);

    // State for the contact modal.
    const [contactModalId, setContactModalId] = useState('');
    const [isEditOrAdd, setIsEditOrAdd] = useState('add');

    const { isOpen, onOpen, onClose } = useDisclosure();

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
        const response = await sendExhibitFormAPI(accessToken, contacts, entity, email);

        console.log('send exhibit form response', response);
        
        setSubmitResult(response.payload.ok ? 'success' : 'error');

    };

    return (
        <Box>
            <Heading as="h2" mb="4" size="lg">New Contact List for {consentData.fullName}</Heading>
            <Text mb="4">
                Dolor nulla minim esse laboris ad. Esse non dolore dolor mollit in sunt esse. Ipsum aliqua aute eu minim Lorem duis elit.
                Irure esse ex ipsum elit tempor id esse in cillum id officia ipsum. Culpa labore consectetur esse excepteur incididunt ex eu aliqua laboris esse esse occaecat elit. Nulla aliquip mollit elit aute.
            </Text>
            <FormControl my="8" as="form" onSubmit={handleSubmit}>
                <FormLabel>Receiving Institution</FormLabel>
                <EntityAutocomplete entities={consentData.entities} entity={entity} setEntity={setEntity} />
                <Heading my="4" as={"h3"} size={"md"}>Contacts</Heading>      
                {contacts.length > 0 && contacts.map((contact, index) => (
                    <Text key={contact.id}>
                        {contact.id} {contact.organizationName}
                        <Button size="sm" onClick={() => { handleEditContact(contact.id) }}>Edit</Button>
                        <Button size="sm" onClick={() => removeContact(contact.id)}>Remove</Button>
                    </Text>
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
