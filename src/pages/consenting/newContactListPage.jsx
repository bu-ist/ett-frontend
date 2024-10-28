import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { nanoid } from "nanoid";
import { Text, Box, Heading, Spinner, FormControl, FormLabel, Input, Card, CardBody, CardHeader, Button, Divider, CardFooter, RadioGroup, Stack, Radio } from "@chakra-ui/react";

import { getConsentData } from '../../lib/getConsentData';
import { sendExhibitFormAPI } from '../../lib/consenting/sendExhibitFormAPI';

import ConsenterCard from './consentFormPage/consenterCard';
import EntityAutocomplete from './newContactListPage/entityAutocomplete';


export default function NewContactListPage() {
    const [apiState, setApiState] = useState('');
    const [consentData, setConsentData] = useState({});

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

    useEffect(() => {
        // Should probably add a handler for the case where the user is not signed in.
        async function fetchData() {
            setApiState('loading');
            const accessToken = Cookies.get('EttAccessJwt');
            const idToken = Cookies.get('EttIdJwt');

            // If the user is signed in, get their consent data.
            if (accessToken && idToken) {
                const decodedIdToken = JSON.parse(atob(idToken.split('.')[1]));

                const consentResponse = await getConsentData(accessToken, decodedIdToken.email);
                setConsentData(consentResponse);
                setApiState('success');
            } else {
                setApiState('error');
            }
        }

        fetchData();
    }, []);

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

    // Handle form submission
    async function handleSubmit(e) {
        e.preventDefault();

        const accessToken = Cookies.get('EttAccessJwt');
        const idToken = Cookies.get('EttIdJwt');
        const email = JSON.parse(atob(idToken.split('.')[1])).email;

        // Send the contact list to the API.
        const response = await sendExhibitFormAPI(accessToken, contacts, entity, email);

        console.log('send exhibit form response', response);
        
        if (response.payload.ok) {
            setSubmitResult('success');
        } else {
            setSubmitResult('error');
        }

    };

    const contactCards = contacts.map((contact, index) => (
        <Card mb="1em" key={contact.id}>
            <CardHeader>
                <Heading as="h4" size="sm">Contact {index + 1}</Heading>
            </CardHeader>
            <CardBody>
                <FormLabel>Organiziation</FormLabel>
                <Input
                    type="text"
                    name="organizationName"
                    value={contact.organizationName}
                    onChange={(e) => handleContactChange(contact.id, e)}
                />
                <FormLabel>Organization Type</FormLabel>
                <RadioGroup
                    my="0.5em"
                    name="organizationType"
                    value={contact.organizationType}
                    onChange={(value) => handleOrgTypeRadioChange(contact.id, value)}
                >
                    <Stack spacing="1.5em" direction="row">
                        <Radio value="EMPLOYER">Employer</Radio>
                        <Radio value="ACADEMIC">Academic</Radio>
                        <Radio value="OTHER">Other</Radio>
                    </Stack>
                </RadioGroup>
                <FormLabel>Contact Name</FormLabel>
                <Input
                    type="text"
                    name="contactName"
                    value={contact.contactName}
                    onChange={(e) => handleContactChange(contact.id, e)}
                />
                <FormLabel>Contact Title</FormLabel>
                <Input
                    type="text"
                    name="contactTitle"
                    value={contact.contactTitle}
                    onChange={(e) => handleContactChange(contact.id, e)}
                />
                <FormLabel>Contact Email</FormLabel>
                <Input
                    type="email"
                    name="contactEmail"
                    value={contact.contactEmail}
                    onChange={(e) => handleContactChange(contact.id, e)}
                />
                <FormLabel>Contact Phone</FormLabel>
                <Input
                    type="tel"
                    name="contactPhone"
                    value={contact.contactPhone}
                    onChange={(e) => handleContactChange(contact.id, e)}
                />
            </CardBody>
            <CardFooter>
                <Button 
                    onClick={() => setContacts(contacts.filter((_, i) => i !== index))}
                    isDisabled={contacts.length === 1}
                >
                    Remove Contact
                </Button>
            </CardFooter>
        </Card>
    ));

    return (
        <Box>
            {apiState === 'loading' && <Spinner />}
            {apiState === 'error' && <Text>There was an error loading the new contact list page.</Text>}
            {apiState === 'success' && 
            <>
                <Heading as={"h2"} mb="1em" size={"lg"}>New Contact List for {consentData.fullName}</Heading>
                <FormControl my="2em" as="form" onSubmit={handleSubmit}>
                    <FormLabel>Receiving Institution</FormLabel>
                    <EntityAutocomplete entities={consentData.entities} entity={entity} setEntity={setEntity} />
                    <Heading my="1em" as={"h3"} size={"md"}>Contacts</Heading>
                    {contactCards}
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
            </>
            }
        </Box>
    );
}
