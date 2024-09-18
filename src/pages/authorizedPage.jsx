import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Box, Button, FormControl, FormLabel, Heading, Input } from '@chakra-ui/react';

import { exchangeAuthorizationCode } from '../lib/exchangeAuthorizationCode';

export default function AuthorizedPage() {
    let [searchParams, setSearchParams] = useSearchParams();

    const [authorizedInfo, setAuthorizedInfo] = useState({});

    useEffect(() => {
        const fetchData = async () => {

            if (searchParams.has('code') && Cookies.get('EttAccessJwt') === undefined) {
                // If this exists, then there is a sign in request, so use the code to get the tokens and store them as cookies.
                const clientId = import.meta.env.VITE_AUTHORIZED_COGNITO_CLIENTID;
                await exchangeAuthorizationCode( clientId, 'auth-ind');
                //Once the tokens are stored, should remove the code from the URL.

                // Use setSearchParams to empty the search params once exchangeAuthorizationCode is done with them.
                setSearchParams({});
            }

            const accessToken = Cookies.get('EttAccessJwt');
            const idToken = Cookies.get('EttIdJwt');

            if (accessToken && idToken) {
                const decodedIdToken = JSON.parse(atob(idToken.split('.')[1]));

                //console.log("decodedIdToken", decodedIdToken);
                setAuthorizedInfo(decodedIdToken);
            }
        };

        fetchData();
    }, []);

    function handleSignOut() {
        // This function redirects to the cognito logout page.
        // Cognito will redirect back to the logout page, which will clear the cookies and display a message.
        const cognitoDomain = import.meta.env.VITE_COGNITO_DOMAIN;
        const clientId = import.meta.env.VITE_AUTHORIZED_COGNITO_CLIENTID;
        const logoutRedirect = encodeURIComponent(`${import.meta.env.VITE_REDIRECT_BASE}/logout`);

        const logoutUrl = `https://${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${logoutRedirect}`;

        window.location.href = logoutUrl;
    }

    return (
        <div>
            <Heading as="h2" size={"xl"}>Authorized Individual</Heading>
            {authorizedInfo && authorizedInfo.email &&
                <>
                    <p>Signed in as {authorizedInfo.email}</p>

                    <Heading as="h3" my="1em" size={"lg"}>Make a disclosure request</Heading>
                    <Box my={"2em"}>
                        <FormControl>
                            <FormLabel>Consenting individual email</FormLabel>
                            <Input placeholder="email@example.com" />
                            <FormLabel>Affiliate of the consenting individual email</FormLabel>
                            <Input placeholder="email@example.com" />

                        </FormControl>
                        <Button my="2em">Send</Button>
                    </Box>

                    <Button my="2em" onClick={handleSignOut}>Sign Out</Button>
                </>
            }
        </div>
    );
}
