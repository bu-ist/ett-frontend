import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Cookies from 'js-cookie';

import { exchangeAuthorizationCode } from '../lib/exchangeAuthorizationCode';
import { Heading, Button } from '@chakra-ui/react';

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

    function handleSignOut() {
        // This function redirects to the cognito logout page.
        // Cognito will redirect back to the logout page, which will clear the cookies and display a message.
        const cognitoDomain = import.meta.env.VITE_COGNITO_DOMAIN;
        const clientId = import.meta.env.VITE_ENTITY_COGNITO_CLIENTID;
        const logoutRedirect = encodeURIComponent(`${import.meta.env.VITE_REDIRECT_BASE}/logout`);

        const logoutUrl = `https://${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${logoutRedirect}`;

        window.location.href = logoutUrl;
    }

    return (
        <div>
            <Heading as={"h3"} size={"lg"}>Registered Entity Administrator</Heading>
            {entityAdminInfo && entityAdminInfo.email &&
                <>
                    <p>Signed in as {entityAdminInfo.email}</p>
                    <Button my="2em" onClick={handleSignOut}>Sign Out</Button>
                </>
            }
        </div>
    );
}
