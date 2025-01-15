import { useState, useEffect, useContext } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

import { Text, Box, Heading, Spinner, Card, CardBody, CardHeader, Button, CardFooter } from "@chakra-ui/react";

import { ConfigContext } from '../../lib/configContext';
import { UserContext } from '../../lib/userContext';

import { signIn } from '../../lib/signIn';
import { exchangeAuthorizationCode } from '../../lib/exchangeAuthorizationCode';
import { getConsentData } from '../../lib/getConsentData';

import ContactList from "./newContactListPage/contactList";

export default function NewContactListPage() {
    const { appConfig } = useContext(ConfigContext);
    const { setUser } = useContext(UserContext);
    const [apiState, setApiState] = useState('');
    const [consentData, setConsentData] = useState({});

    let [searchParams, setSearchParams] = useSearchParams();

    const location = useLocation();
    const currentPath = location.pathname.substring(1); // Remove the leading slash

    useEffect(() => {
        // Should probably add a handler for the case where the user is not signed in.

        let accessToken = Cookies.get('EttAccessJwt');
        let idToken = Cookies.get('EttIdJwt');

        // If there is no access token and no code in the URL, the user is not signed in.
        if (!accessToken && ! searchParams.has('code')) {
            // Set the api response state to reflect that the user is not signed in.
            setApiState('notSignedIn');
            return;
        }

        async function fetchData() {
            // appConfig is initially loaded through an api call, which won't have been completed on the first render, so return early if it's not loaded yet.
            // Because appConfig is a dependency of this useEffect, fetchData will be called again when appConfig is loaded.
            if (!appConfig) {
                setApiState('loading');
                return;
            }
            const { cognitoDomain, apiStage, consentingPerson: { cognitoID, apiHost } } = appConfig;

            setApiState('loading');

            // First check if there is a code in the URL, and if so, exchange it for tokens.
            if (searchParams.has('code')) {
                await exchangeAuthorizationCode( cognitoDomain, cognitoID, currentPath );
                // Use setSearchParams to empty the search params once exchangeAuthorizationCode is done with them.
                setSearchParams({});

                // There should be cookies now, so get them again.
                accessToken = Cookies.get('EttAccessJwt');
                idToken = Cookies.get('EttIdJwt');
            }

            // If the user is signed in, get their consent data.
            if (accessToken && idToken) {
                const decodedIdToken = JSON.parse(atob(idToken.split('.')[1]));

                const consentResponse = await getConsentData(apiStage, apiHost, accessToken, decodedIdToken.email);
                setConsentData(consentResponse);

                // Set the user context for the site header avatar.
                setUser({email: consentResponse.consenter.email, fullname: consentResponse.fullName});

                setApiState('success');
            } else {
                setApiState('error');
            }
        }

        fetchData();
    }, [appConfig]);

    return (
        <Box>
            {apiState === 'notSignedIn' &&
                <Card my={6} align="center">
                    <CardHeader>
                        <Heading as="h2" color="gray.500" >Not Signed In</Heading>
                    </CardHeader>
                    <CardBody>
                        <Text>Sign in to access this page.</Text>
                    </CardBody>
                    <CardFooter>
                        <Button onClick={() => signIn(appConfig.consentingPerson.cognitoID, currentPath, appConfig.cognitoDomain)}>Sign in as a Consenting Person</Button>
                    </CardFooter>
                </Card>
            }
            {apiState === 'loading' && <Spinner />}
            {apiState === 'error' && <Text>There was an error loading the new contact list page.</Text>}
            {apiState === 'success' && 
                <ContactList consentData={consentData} />
            }
        </Box>
    );
}
