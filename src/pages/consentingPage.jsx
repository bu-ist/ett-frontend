import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Button, Heading } from '@chakra-ui/react';

import { exchangeAuthorizationCode } from '../lib/exchangeAuthorizationCode';
import { getConsentData } from '../lib/getConsentData';

export default function ConsentingPage() {
    let [searchParams] = useSearchParams();

    const [consenterInfo, setConsenterInfo] = useState({});
    const [consentData, setConsentData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            if (searchParams.has('code') && Cookies.get('EttAccessJwt') === undefined) {
                // If this exists, then there is a sign in request, so use the code to get the tokens and store them as cookies.
                await exchangeAuthorizationCode('consenter', setConsenterInfo);
                //Once the tokens are stored, should remove the code from the URL.
            }

            const accessToken = Cookies.get('EttAccessJwt');
            const idToken = Cookies.get('EttIdJwt');

            if (accessToken && idToken) {
                const decodedIdToken = JSON.parse(atob(idToken.split('.')[1]));

                setConsenterInfo(decodedIdToken);

                //await handleGetConsentData();
            }
        };

        fetchData();
    }, []);

    const handleGetConsentData = async () => {
        const accessToken = Cookies.get('EttAccessJwt');
        const email = consenterInfo.email;

        if (accessToken && email) {
            const data = await getConsentData(accessToken, email);
            setConsentData(data);
            console.log(data);
        }
    };

    return (
        <div>
            <Heading as="h2" size={"xl"} >Consenting Person</Heading>
            {consenterInfo && consenterInfo.email &&
                <>
                    <p>Welcome, {consenterInfo.email}!</p>
                    <p>Here is your consent data:</p>
                    <p>{JSON.stringify(consentData)}</p>
                    <Button onClick={handleGetConsentData}>Get Consent Data</Button>
                </>
            }
        </div>
    );
}
