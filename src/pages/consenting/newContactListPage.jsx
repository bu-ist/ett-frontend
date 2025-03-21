import { useState, useEffect, useContext } from 'react';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import { Text, Box, Heading, Spinner, Card, CardBody, CardHeader, Button, CardFooter } from "@chakra-ui/react";

import { ConfigContext } from '../../lib/configContext';
import { UserContext } from '../../lib/userContext';

import { signIn } from '../../lib/signIn';
import { exchangeAuthorizationCode } from '../../lib/exchangeAuthorizationCode';
import { getConsentData } from '../../lib/consenting/getConsentData';

import ContactList from "./newContactListPage/contactList";

export default function NewContactListPage() {
    const { appConfig } = useContext(ConfigContext);
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const [apiState, setApiState] = useState('');
    const [consentData, setConsentData] = useState({});

    const [entityId, setEntityId] = useState('');

    let [searchParams, setSearchParams] = useSearchParams();

    const location = useLocation();
    const currentPath = location.pathname.substring(1); // Remove the leading slash

    // The form type is given by the last segment of the path, which is either 'other', 'current', or 'both'.
    const formConstraint = currentPath.split('/').pop();

    // Get the entity ID from the url hash; this should be a query parameter but somehow it is a hash.
    // So need to remove "#entity_id=" from the hash to get the entity ID.
    const entityIdFromHash = location.hash.substring(11);

    useEffect(() => {
        // Set the entityId state variable from the hash
        if (entityIdFromHash) {
            setEntityId(entityIdFromHash);
        }

        let accessToken = Cookies.get('EttAccessJwt');
        let idToken = Cookies.get('EttIdJwt');

        // If there is no access token and no code in the URL, the user is not signed in.
        if (!accessToken && ! searchParams.has('code')) {

            // Store the entityId in localStorage if not signed in
            window.localStorage.setItem('exhibitFormEntityId', entityIdFromHash);
            setEntityId(entityIdFromHash);

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

            setApiState('loading');

            // First check if there is a code in the URL, and if so, exchange it for tokens.
            if (searchParams.has('code')) {
                const { cognitoDomain, consentingPerson: { cognitoID } } = appConfig;
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

                const consentResponse = await getConsentData(appConfig, accessToken, decodedIdToken.email);
                setConsentData(consentResponse);

                // Set the user context for the site header avatar.
                setUser({email: consentResponse.consenter.email, fullname: consentResponse.fullName});

                // If there's not an existing entityId, look for entityId from localStorage that would be set after a successful login.
                const storedEntityId = window.localStorage.getItem('exhibitFormEntityId');
                if (storedEntityId && !entityId) {
                    setEntityId(storedEntityId);
                    window.localStorage.removeItem('exhibitFormEntityId');

                    // Add the hash value back to the URL
                    navigate('#entity_id=' + storedEntityId);
                }

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
                        <Heading as="h2" size="lg" color="gray.500" >Sign In for Exhibit Form</Heading>
                    </CardHeader>
                    <CardBody>
                        <Text>You have been invited to complete an exhibit form, please sign in.</Text>
                    </CardBody>
                    <CardFooter>
                        <Button onClick={() => signIn(appConfig.consentingPerson.cognitoID, currentPath, appConfig.cognitoDomain)}>Sign in as a Consenting Person</Button>
                    </CardFooter>
                </Card>
            }
            {apiState === 'loading' && <Spinner />}
            {apiState === 'error' && <Text>There was an error loading the new contact list page.</Text>}
            {apiState === 'success' && 
                <ContactList consentData={consentData} formConstraint={formConstraint} entityId={entityId} />
            }
        </Box>
    );
}
