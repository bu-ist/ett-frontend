import { useEffect, useState, useContext } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Button, Heading, Text, SimpleGrid, Card, CardBody, CardFooter, Spinner } from '@chakra-ui/react';

import { ConfigContext } from "../lib/configContext";
import { UserContext } from '../lib/userContext';

import { signIn } from '../lib/signIn';
import { signOut } from "../lib/signOut";
import { exchangeAuthorizationCode } from '../lib/exchangeAuthorizationCode';

export default function SysadminPage() {

    let [searchParams, setSearchParams] = useSearchParams();

    // Get the appConfig from the ConfigContext.
    const { appConfig } = useContext( ConfigContext );

    const { setUser } = useContext(UserContext);

    const [sysadminInfo, setSysadminInfo] = useState({});

    useEffect(() => {
        
        // appConfig is initially loaded through an api call, which won't have been completed on the first render, so return early if it's not loaded yet.
        // Because appConfig is a dependency of this useEffect, fetchData will be called again when appConfig is loaded.
        if (!appConfig) {
            return;
        }

        // Desctructure useful values from the appConfig.
        const { sysadmin: { cognitoID } } = appConfig;

        // If there is no existing session, and no code in the URL, redirect to the cognito login page.
        if (!searchParams.has('code') && Cookies.get('EttAccessJwt') === undefined) {
            signIn(cognitoID, 'sysadmin'); // This will immediately redirect to the cognito login page.
        }
        
        // Otherwise, declare an async function in the useEffect hook to get the session token.
        const getSessionToken = async () => {
            
            if (searchParams.has('code') && Cookies.get('EttAccessJwt') === undefined) {
                // If this exists, then there is a sign in request, so use the code to get the tokens and store them as cookies.
                await exchangeAuthorizationCode( cognitoID, 'sysadmin');
                //Once the tokens are stored, should remove the code from the URL.

                // Use setSearchParams to empty the search params once exchangeAuthorizationCode is done with them.
                setSearchParams({});
            }

            const accessToken = Cookies.get('EttAccessJwt');
            const idToken = Cookies.get('EttIdJwt');

            if (accessToken && idToken) {
                const decodedIdToken = JSON.parse(atob(idToken.split('.')[1]));

                setSysadminInfo(decodedIdToken);

                // Set the user context; sysadmins don't have a user object, so just set the email.
                setUser( {email: decodedIdToken.email } );
            }
        };

        getSessionToken();
    }, [appConfig]);

    if ( !sysadminInfo || !appConfig ) {
        // If the sysadminInfo or appConfig is not loaded yet, show a spinner.
        return (
            <div>
                <Heading as={"h3"} size={"lg"}>Sysadmin Page</Heading>
                <Spinner size="xl" />
            </div>
        );
    }

    return (
        <div>
            <Heading as={"h3"} size={"lg"}>Sysadmin Page</Heading>
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
