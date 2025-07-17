import { useState, useEffect, useContext } from 'react';
import Cookies from 'js-cookie';
import { Box, Heading, Spinner, Text, Alert, AlertIcon, AlertTitle, AlertDescription } from "@chakra-ui/react";

import { ConfigContext } from '../../lib/configContext';
import { UserContext } from '../../lib/userContext';

import { getConsentData } from "../../lib/consenting/getConsentData";

import ConsentFormText from './consentFormPage/consentFormText';
import ConsenterCard from "./consentFormPage/consenterCard";
import GrantConsentButton from './consentFormPage/grantConsentButton';

export default function ConsentFormPage() {
    const { setUser } = useContext(UserContext);

    // Get the appConfig from the ConfigContext.
    const { appConfig } = useContext( ConfigContext );

    const [consentData, setConsentData] = useState({});

    const [apiState, setApiState] = useState('idle');

    useEffect(() => {
        async function fetchData() {
            setApiState('loading');

            // appConfig is initially loaded through an api call, which won't have been completed on the first render, so return early if it's not loaded yet.
            // Because appConfig is a dependency of this useEffect, fetchData will be called again when appConfig is loaded.
            if (!appConfig) {
                return;
            }

            const accessToken = Cookies.get('EttAccessJwt');
            const idToken = Cookies.get('EttIdJwt');

            // Check if user is not signed in
            if (!accessToken || !idToken) {
                setApiState('notSignedIn');
                return;
            }

            // User is signed in, proceed with getting consent data
            const decodedIdToken = JSON.parse(atob(idToken.split('.')[1]));

            const consentResponse = await getConsentData(appConfig, accessToken, decodedIdToken.email);
            setConsentData(consentResponse);

            // Set the fullname and email in the user context for the header avatar.
            setUser({fullname: consentResponse.fullName, email: consentResponse.consenter.email});

            setApiState('success');
        }

        fetchData();
    }, [appConfig, setUser]);

    // Should require valid session token to access this page.
    return (
        <Box>
            <Heading as={"h2"} size={"lg"}>Consent Form {(consentData?.fullName) && `for ${consentData.fullName}`}</Heading>
            {apiState === 'loading' && <Spinner />}
            {apiState === 'notSignedIn' && 
                <Alert 
                    status="warning" 
                    variant="subtle" 
                    flexDirection="column" 
                    alignItems="center" 
                    justifyContent="center" 
                    textAlign="center" 
                    my={6}
                >
                    <AlertIcon boxSize="40px" mr={0} />
                    <AlertTitle mt={4} mb={1} fontSize="lg">
                        Not Signed In
                    </AlertTitle>
                    <AlertDescription maxWidth="sm">
                        You need to be signed in to view the consent form. Please sign in through your dashboard.
                    </AlertDescription>
                </Alert>
            }
            {apiState === 'error' && <Text>There was an error loading the consent form.</Text>}
            {apiState === 'success' &&
                <Box>
                    <ConsentFormText
                        disclosureFormUrl={appConfig.publicBlankFormURIs.find((url) => url.includes('disclosure')) || ""}
                        registrationFormEntityUrl={appConfig.publicBlankFormURIs.find((url) => url.includes('registration-form-entity')) || ""}
                    />
                    <ConsenterCard consentData={consentData} />
                    <GrantConsentButton consentData={consentData} />
                </Box>
            }
        </Box>
    );

}