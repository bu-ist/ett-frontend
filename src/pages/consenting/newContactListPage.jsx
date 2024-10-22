import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { nanoid } from "nanoid";
import { Text, Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Heading, Spinner, FormControl, FormLabel, Input, Card, CardBody, CardHeader, Button, Divider, CardFooter } from "@chakra-ui/react";

import ConsenterCard from './consentFormPage/consenterCard';
import EntityAutocomplete from './newContactListPage/entityAutocomplete';

import { getConsentData } from '../../lib/getConsentData';

export default function NewContactListPage() {
    const [apiState, setApiState] = useState('');
    const [consentData, setConsentData] = useState({});

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
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = {
            entity,
            contacts
        };
        console.log('Form submitted:', formData);
        // Add form submission logic here
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
                <Input
                    type="text"
                    name="organizationType"
                    value={contact.organizationType}
                    onChange={(e) => handleContactChange(contact.id, e)}
                />
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
            <Breadcrumb separator=">">
                <BreadcrumbItem>
                    <BreadcrumbLink as={Link} to='/'>Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem>
                    <BreadcrumbLink as={Link} to={'/consenting'}>Consenting Person</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink>New Contact List</BreadcrumbLink>   
                </BreadcrumbItem>
            </Breadcrumb>
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
                    <Button mt="0.5em" type="submit">Submit</Button>
                </FormControl>

            </>
            }
        </Box>
    );
}
