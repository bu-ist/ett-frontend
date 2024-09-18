import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Button, Heading, Spinner } from '@chakra-ui/react';

import { exchangeAuthorizationCode } from '../lib/exchangeAuthorizationCode';
import { getConsentData } from '../lib/getConsentData';

import ConsentDetails from "./consentingPage/consentDetails";

export default function ConsentingPage() {
    let [searchParams, setSearchParams] = useSearchParams();

    const [consenterInfo, setConsenterInfo] = useState({});
    const [consentData, setConsentData] = useState({});

    useEffect(() => {
        // This isn't really fully baked maybe, probably needs more consideration on how to enter the page both with and without a cognito code.
        const fetchData = async () => {
            if (searchParams.has('code') && Cookies.get('EttAccessJwt') === undefined) {
                // If this exists, then there is a sign in request, so use the code to get the tokens and store them as cookies.
                const clientId = import.meta.env.VITE_CONSENTING_COGNITO_CLIENTID;
                await exchangeAuthorizationCode( clientId, 'consenting');
                //Once the tokens are stored, should remove the code from the URL.

                // Use setSearchParams to empty the search params once exchangeAuthorizationCode is done with them.
                setSearchParams({});
            }

            const accessToken = Cookies.get('EttAccessJwt');
            const idToken = Cookies.get('EttIdJwt');

            if (accessToken && idToken) {
                const decodedIdToken = JSON.parse(atob(idToken.split('.')[1]));

                setConsenterInfo(decodedIdToken);

                // At this point one way or another there should be a consenterInfo object with the email.
                const consentResponse = await getConsentData(accessToken, decodedIdToken.email);
                setConsentData(consentResponse);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <Heading as="h2" size={"xl"} >Consenting Person</Heading>
            {consenterInfo && consenterInfo.email &&
                <>
                    <p>Signed in as {consenterInfo.email}</p>
                    {JSON.stringify(consentData) != '{}' &&
                        <ConsentDetails consentData={consentData} consenterInfo={consenterInfo} />
                    }
                    {JSON.stringify(consentData) == '{}' &&
                        <Spinner
                            thickness='4px'
                            speed='0.65s'
                            emptyColor='gray.200'
                            color='blue.500'
                            size='xl'
                        />
                    }
                </>
            }
        </div>
    );
}
