import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Heading, Button } from '@chakra-ui/react';

import { exchangeAuthorizationCode } from '../lib/exchangeAuthorizationCode';
import { signOut } from '../lib/signOut';

export default function EntityPage() {

    let [searchParams, setSearchParams] = useSearchParams();

    const [entityAdminInfo, setEntityAdminInfo] = useState({});

    useEffect(() => {
        const fetchData = async () => {

            if (searchParams.has('code') && Cookies.get('EttAccessJwt') === undefined) {
                // If this exists, then there is a sign in request, so use the code to get the tokens and store them as cookies.
                const clientId = import.meta.env.VITE_ENTITY_COGNITO_CLIENTID;
                await exchangeAuthorizationCode( clientId, 'entity');
                //Once the tokens are stored, should remove the code from the URL.

                // Use setSearchParams to empty the search params once exchangeAuthorizationCode is done with them.
                setSearchParams({});
            }

            const accessToken = Cookies.get('EttAccessJwt');
            const idToken = Cookies.get('EttIdJwt');

            if (accessToken && idToken) {
                const decodedIdToken = JSON.parse(atob(idToken.split('.')[1]));

                //console.log("decodedIdToken", decodedIdToken);
                setEntityAdminInfo(decodedIdToken);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <Heading as={"h3"} size={"lg"}>Registered Entity Administrator</Heading>
            {entityAdminInfo && entityAdminInfo.email &&
                <>
                    <p>Signed in as {entityAdminInfo.email}</p>
                    <Button my="2em" onClick={signOut}>Sign Out</Button>
                </>
            }
        </div>
    );
}
