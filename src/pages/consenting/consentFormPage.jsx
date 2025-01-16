import { useState, useEffect, useContext } from 'react';
import Cookies from 'js-cookie';
import { Box, Heading, Spinner, Text } from "@chakra-ui/react";

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

            if (accessToken && idToken) {
                const decodedIdToken = JSON.parse(atob(idToken.split('.')[1]));

                const consentResponse = await getConsentData( appConfig, accessToken, decodedIdToken.email);
                setConsentData(consentResponse);

                // Set the fullname and email in the user context for the header avatar.
                setUser( {fullname: consentResponse.fullName, email: consentResponse.consenter.email } );

                setApiState('success');
            } else {
                setApiState('error');
            }
        }

        fetchData();
    }, []);

    // Should require valid session token to access this page.
    return (
        <Box>
            <Heading as={"h2"} size={"lg"}>Consent Form {(consentData?.fullName) && `for ${consentData.fullName}` }</Heading>
            {apiState === 'loading' && <Spinner />}
            {apiState === 'error' && <Text>There was an error loading the consent form.</Text>}
            {apiState === 'success' &&
                <Box>
                    <ConsentFormText />
                    <ConsenterCard consentData={consentData} />
                    <GrantConsentButton consentData={consentData} />
                </Box>
            }
            
        </Box>
    );

}