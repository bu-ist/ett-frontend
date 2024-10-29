import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Button, Heading, Text, SimpleGrid, Card, CardBody, CardFooter } from '@chakra-ui/react';

import { signIn } from '../lib/signIn';
import { signOut } from "../lib/signOut";
import { exchangeAuthorizationCode } from '../lib/exchangeAuthorizationCode';

export default function SysadminPage() {

    let [searchParams, setSearchParams] = useSearchParams();

    const [sysadminInfo, setSysadminInfo] = useState({});

    useEffect(() => {
        
        // If there is no existing session, and no code in the URL, redirect to the cognito login page.
        if (!searchParams.has('code') && Cookies.get('EttAccessJwt') === undefined) {
            const sysadminClientID = import.meta.env.VITE_SYSADMIN_COGNITO_CLIENTID;
            signIn(sysadminClientID, 'sysadmin'); // This will immediately redirect to the cognito login page.
        }
        
        // Otherwise, declare an async function in the useEffect hook to get the session token.
        const getSessionToken = async () => {
            
            if (searchParams.has('code') && Cookies.get('EttAccessJwt') === undefined) {
                // If this exists, then there is a sign in request, so use the code to get the tokens and store them as cookies.
                const clientId = import.meta.env.VITE_SYSADMIN_COGNITO_CLIENTID;
                await exchangeAuthorizationCode( clientId, 'sysadmin');
                //Once the tokens are stored, should remove the code from the URL.

                // Use setSearchParams to empty the search params once exchangeAuthorizationCode is done with them.
                setSearchParams({});
            }

            const accessToken = Cookies.get('EttAccessJwt');
            const idToken = Cookies.get('EttIdJwt');

            if (accessToken && idToken) {
                const decodedIdToken = JSON.parse(atob(idToken.split('.')[1]));

                setSysadminInfo(decodedIdToken);
            }
        };

        getSessionToken();
    }, []);

    return (
        <div>
            <Heading as={"h3"} size={"lg"}>Sysadmin Page</Heading>
            <Text my="2em">Signed in as {sysadminInfo.email}</Text>

            <SimpleGrid spacing={4} mt="2em" templateColumns='repeat(auto-fill, minmax(200px, 1fr))'>
                <Card>
                    <CardBody>Send a new invitation</CardBody>
                    <CardFooter>
                        <Button as={Link} to="/sysadmin/send-invitation">Go</Button>
                    </CardFooter>
                </Card>
            </SimpleGrid>

            <Button my="2em" onClick={signOut}>Sign Out</Button>
        </div>
    );
}
