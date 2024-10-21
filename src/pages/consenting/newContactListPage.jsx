import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Text, Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";

import { getConsentData } from '../../lib/getConsentData';

export default function NewContactListPage() {
    const [apiState, setApiState] = useState('');
    const [consentData, setConsentData] = useState({});

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
            <Text>New Contact List Page</Text>
            <Text>Consent Data: {JSON.stringify(consentData)}</Text>
        </Box>
    );
}
