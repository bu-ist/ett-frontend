import { useState } from 'react';
import { nanoid } from 'nanoid';
import Cookies from 'js-cookie';

import { Box, Text, Heading, Divider, FormControl, FormLabel, Button, Spinner } from '@chakra-ui/react';

import { sendExhibitFormAPI } from '../../../lib/consenting/sendExhibitFormAPI';

import ContactCard from "./contactCard";
import ConsenterCard from '../consentFormPage/consenterCard';
import EntityAutocomplete from './entityAutocomplete';

// Contains the full contact list form and form state.
export default function ContactList({ consentData }) {

    const [submitResult, setSubmitResult] = useState('idle');

    const [entity, setEntity] = useState('');
    const [contacts, setContacts] = useState([
        {
            id: nanoid(),
            organizationName: '',
            organizationType: '',
            contactName: '',
            contactTitle: '',
            contactEmail: '',
            contactPhone: ''
        }
    ]);

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

    // Add a new blank contact card to the form state data.
    function handleAddContact() {
        setContacts([
            ...contacts,
            {
                id: nanoid(),
                organizationName: '',
                organizationType: '',
                contactName: '',
                contactTitle: '',
                contactEmail: '',
                contactPhone: ''
            }
        ]);
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
            <Heading as={"h2"} mb="1em" size={"lg"}>New Contact List for {consentData.fullName}</Heading>
            <FormControl my="2em" as="form" onSubmit={handleSubmit}>
                <FormLabel>Receiving Institution</FormLabel>
                <EntityAutocomplete entities={consentData.entities} entity={entity} setEntity={setEntity} />
                <Heading my="1em" as={"h3"} size={"md"}>Contacts</Heading>
                {contacts.map((contact, index) => (<ContactCard key={contact.id} contact={contact} removeContact={removeContact} disableRemove={contacts.length === 1} setContacts={setContacts} index={index} handleContactChange={handleContactChange} handleOrgTypeRadioChange={handleOrgTypeRadioChange} />))}
                <Button mt="0.5em" onClick={handleAddContact}>Add Contact</Button>
                <Divider my="1em" />
                <ConsenterCard consentData={consentData} />
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
