import { useState, useContext } from 'react';
import { nanoid } from 'nanoid';
import { Link as ReactRouterLink } from 'react-router-dom';
import Cookies from 'js-cookie';

import { Box, Text, Heading, Divider, Button, Spinner, useDisclosure } from '@chakra-ui/react';

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
    const [contacts, setContacts] = useState([]);

    // State for the contact modal.
    const [currentContact, setCurrentContact] = useState(null);
    const [isEditOrAdd, setIsEditOrAdd] = useState('add');

    const { isOpen, onOpen, onClose } = useDisclosure();

    // Get then name of the matching entity from the consent data.
    const entityName = consentData.entities.find((entity) => entity.entity_id === entityId)?.entity_name;

    // Handle contact update from modal
    const handleContactUpdate = (id, updatedContact) => {
        const updatedContacts = contacts.map((contact) => 
            contact.id === id ? { ...contact, ...updatedContact } : contact
        );
        setContacts(updatedContacts);
    };

    // Add a new blank contact card to the form state data and open the editing modal.
    function handleAddContact(orgType) {
        // Signal that the modal is for adding a new contact.
        setIsEditOrAdd('add');

        // Generate a new ID for the new contact.
        const newId = nanoid();

        // Create a new blank contact
        const newContact = {
            id: newId,
            organizationName: '',
            organizationType: orgType,
            contactName: '',
            contactTitle: '',
            contactEmail: '',
            contactPhone: ''
        };

        // Add the new blank contact to the form state.
        setContacts([...contacts, newContact]);

        // Set the current contact for the modal
        setCurrentContact(newContact);
        onOpen();
    }

    // Handle editing an existing contact by setting the modal to edit mode and opening it.
    function handleEditContact(id) {
        // Signal that the modal is for editing an existing contact.
        setIsEditOrAdd('edit');
        const contactToEdit = contacts.find(contact => contact.id === id);
        setCurrentContact(contactToEdit);
        onOpen();
    }

    function removeContact(id) {
        const updatedContacts = contacts.filter((contact) => contact.id !== id);
        setContacts(updatedContacts);
    }

    // Close modal handler that updates component state to reflect modal is closed
    function handleModalClose() {
        onClose();
        setCurrentContact(null);
    }

    // Handle form submission
    async function handleSubmit() {

        const accessToken = Cookies.get('EttAccessJwt');
        const idToken = Cookies.get('EttIdJwt');
        const email = JSON.parse(atob(idToken.split('.')[1])).email;

        // Send the contact list to the API.
        setSubmitResult('loading');
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

    const employerContacts = contacts.filter(contact => contact.organizationType === 'EMPLOYER');
    const academicContacts = contacts.filter(contact => contact.organizationType === 'ACADEMIC');
    const otherContacts = contacts.filter(contact => contact.organizationType === 'OTHER');

    return (
        <Box>
            <Heading as="h2" mb="4" size="lg">New Contact List for {consentData.fullName}</Heading>
            <Text mb="4">
                {`This is a request for ${constraintMessages[formConstraint]}.`}
            </Text>
            <Box my="8">
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
                <Heading as="h4" size="lg" my="4">
                    {formConstraint === 'current' && 'Current Employer(s)'}
                    {formConstraint === 'other' && 'Prior Employer(s)'}
                    {formConstraint === 'both' && 'Current and Prior Employer(s)'}
                </Heading>
                {employerContacts.map((contact) => (
                    <ContactDisplayCard
                        key={contact.id}
                        contact={contact}
                        handleEditContact={handleEditContact}
                        removeContact={removeContact}
                        isDisabled={submitResult !== 'idle'}
                    />
                ))}
                <Button mt="4" 
                    onClick={() => handleAddContact("EMPLOYER")}
                    isDisabled={submitResult !== 'idle'}
                >
                    Add Employer
                </Button>
                <Divider my="8" />
                <Heading as="h4" size="lg" my="4">Academic / Professional Societies</Heading>
                {academicContacts.map((contact) => (
                    <ContactDisplayCard
                        key={contact.id}
                        contact={contact}
                        handleEditContact={handleEditContact}
                        removeContact={removeContact}
                        isDisabled={submitResult !== 'idle'}
                    />
                ))}
                <Button mt="4" 
                    onClick={() => handleAddContact("ACADEMIC")}
                    isDisabled={submitResult !== 'idle'}
                >
                    Add Academic
                </Button>
                <Divider my="8" />
                <Heading as="h4" size="lg" my="4">Other Organizations Where You Currently or Formerly Had Appointments</Heading>
                {otherContacts.map((contact) => (
                    <ContactDisplayCard
                        key={contact.id}
                        contact={contact}
                        handleEditContact={handleEditContact}
                        removeContact={removeContact}
                        isDisabled={submitResult !== 'idle'}
                    />
                ))}
                <Button mt="4" 
                    onClick={() => handleAddContact("OTHER")}
                    isDisabled={submitResult !== 'idle'}
                >
                    Add Other
                </Button>
                {currentContact && (
                    <ContactEditModal
                        isOpen={isOpen}
                        onClose={handleModalClose}
                        isEditOrAdd={isEditOrAdd}
                        formConstraint={formConstraint}
                        contact={currentContact}
                        removeContact={removeContact}
                        handleContactChange={handleContactUpdate}
                    />
                )}
                <Divider my="8" />
                <Text>
                    When complete, click submit to send form data.
                </Text>
                <Button mt="2" 
                        isDisabled={submitResult !== 'idle'} 
                        onClick={handleSubmit}
                >
                    {submitResult === 'idle' && 'Submit'}
                    {submitResult === 'loading' && <Spinner />}
                    {submitResult === 'success' && 'Submitted'}
                    {submitResult === 'error' && 'Error'}
                </Button>
            </Box>
            {submitResult === 'success' && 
                <>
                    <Text>Form submitted successfully.</Text>
                    <Button as={ReactRouterLink} to="/consenting" my="2em"> Return to Dashboard</Button>
                </>
            }
            {submitResult === 'error' && 
                <Text>There was an error submitting the form.</Text>
            }
        </Box>
    );
}
