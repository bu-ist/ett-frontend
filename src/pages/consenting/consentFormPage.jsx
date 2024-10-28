import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Box, Heading, Spinner, Text } from "@chakra-ui/react";

import { getConsentData } from "../../lib/getConsentData";

import ConsentFormText from './consentFormPage/consentFormText';
import ConsenterCard from "./consentFormPage/consenterCard";
import GrantConsentButton from './consentFormPage/grantConsentButton';

export default function ConsentFormPage() {
    const [consentData, setConsentData] = useState({});

    const [apiState, setApiState] = useState('idle');

    useEffect(() => {
        async function fetchData() {
            setApiState('loading');
            const accessToken = Cookies.get('EttAccessJwt');
            const idToken = Cookies.get('EttIdJwt');

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