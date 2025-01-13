import { useEffect, useState, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Heading, Button, Text, Spinner, Box, Card, CardHeader, CardBody, Flex, Icon, CardFooter, VStack } from '@chakra-ui/react';
import { BsFileEarmarkLock2, BsExclamationTriangle } from 'react-icons/bs';

import { exchangeAuthorizationCode } from '../lib/exchangeAuthorizationCode';
import { lookupUserContextAPI } from '../lib/entity/lookupUserContextAPI';
import { signIn } from '../lib/signIn';
import { signOut } from '../lib/signOut';

import { ConfigContext } from '../lib/configContext';
import { UserContext } from '../lib/userContext';

import AuthorizedCard from './entityPage/authorizedCard';

import { formatTimestamp } from '../lib/formatting/formatTimestamp';

export default function EntityPage() {

    let [searchParams, setSearchParams] = useSearchParams();

    // Get the appConfig from the ConfigContext.
    const { appConfig } = useContext( ConfigContext );

    const {setUser} = useContext(UserContext);

    const [entityAdminInfo, setEntityAdminInfo] = useState({});
    const [userInfo, setUserInfo] = useState({});

    useEffect(() => {
        // Asynchronously operations need to be declared in a local function to be called in useEffect.
        const fetchData = async () => {

            // appConfig is initially loaded through an api call, which won't have been completed on the first render, so return early if it's not loaded yet.
            // Because appConfig is a dependency of this useEffect, fetchData will be called again when appConfig is loaded.
            if (!appConfig) {
                return;
            }

            // De-structure useful values from the appConfig.
            const { cognitoDomain, apiStage, entityAdmin: { cognitoID, apiHost } }  = appConfig;

            if (searchParams.has('code') && Cookies.get('EttAccessJwt') === undefined) {
                // If this exists, then there is a sign in request, so use the code to get the tokens and store them as cookies.

                // Check to see if this is a first time login from the cognito redirect, and if so do a signIn.
                // This workaround has to do with the state and code_verifier, which aren't part of the sign up flow.
                if ( searchParams.get('action') === 'post-signup' ) {
                    // Sign in does a window.location redirect, so execution will stop here.
                     signIn( cognitoID, 'entity' );
                }

                await exchangeAuthorizationCode( cognitoDomain, cognitoID, 'entity');
                //Once the tokens are stored, should remove the code from the URL.

                // Use setSearchParams to empty the search params once exchangeAuthorizationCode is done with them.
                setSearchParams({});
            }

            const accessToken = Cookies.get('EttAccessJwt');
            const idToken = Cookies.get('EttIdJwt');

            if (!accessToken || !idToken) {
                // If there are not login tokens, signal that there is not a login session and return early.
                setEntityAdminInfo({login: false});
                return;
            }

            // If there are login tokens, use them to get the user data.
            const decodedIdToken = JSON.parse(atob(idToken.split('.')[1]));
            setEntityAdminInfo(decodedIdToken);

            // Get the user data from the API and store it in local state.
            const userInfoResponse = await lookupUserContextAPI( apiStage, apiHost, accessToken, decodedIdToken.email);

            // If invalid, set api state to error and return early.
            if (!userInfoResponse.payload || !userInfoResponse.payload.ok) {
                setEntityAdminInfo({error: true});
                return;
            }

            // Set the user info in local state.
            setUserInfo(userInfoResponse.payload);

            // Also set the user context for the avatar in the header.
            setUser(userInfoResponse.payload.user);
            
        };

        // Run the async wrapper function.
        fetchData();
    }, [appConfig]);

    // Function to update the pending invitations in the userInfo object, passed down to the AuthorizedCard component.
    function updatePendingInvitations(email1, email2) {
        // Make a copy of the userInfo object, and update the pending invitations with the new emails.
        const updatedUserInfo = {...userInfo};
        updatedUserInfo.user.entity.pendingInvitations = [
            {email: email1, status: 'invited-in-page'},
            {email: email2, status: 'invited-in-page'},
        ];

        // Set the userInfo state to the updated object.
        setUserInfo(updatedUserInfo);
    }

    return (
        <div>
            <Heading as={"h2"} size={"xl"}>Administrative Support Professional</Heading>
            <Text>
                Lorem ipsum minim anim id do nisi aliqua. Consequat cillum sint qui ad aliqua proident nostrud. Cillum ullamco consectetur mollit eu labore amet ullamco mollit dolor veniam adipisicing veniam nulla ex. Quis irure minim id commodo dolore anim nulla aliqua reprehenderit pariatur. Id aute mollit pariatur tempor ex aute id voluptate enim. Et excepteur dolore non non ad deserunt duis voluptate aliqua officia qui ut elit.
            </Text>
            {entityAdminInfo.error === true &&
                <Card my={6} align="center">
                    <CardHeader><Heading as="h2" color="gray.500" >Login Error</Heading></CardHeader>
                    <CardBody>
                        <VStack>
                            <Icon color="gray.500" as={BsExclamationTriangle} w={24} h={24} />
                            <Text>There was an error looking up the user context. Please try again.</Text>
                        </VStack>
                    </CardBody>
                    <CardFooter>
                        <Button onClick={ () => signOut(appConfig.cognitoDomain, appConfig.entityAdmin.cognitoID) }>Sign Out</Button>
                    </CardFooter>
                </Card>
            }
            {( appConfig && entityAdminInfo.login === false ) &&
                <Card my={6} align="center">
                    <CardHeader><Heading as="h2" color="gray.500" >Not logged in</Heading></CardHeader>
                    <CardBody>
                        <Icon color="gray.500" as={BsFileEarmarkLock2} w={24} h={24} />
                    </CardBody>
                    <CardFooter>
                        <Button
                            onClick={() => signIn( appConfig.entityAdmin.cognitoID, 'entity' )}
                        >
                            Sign In as an Entity Administrator
                        </Button>
                    </CardFooter>
                </Card>
            }
            {(entityAdminInfo && entityAdminInfo.email && appConfig) &&
                <>
                    <Box my="2em">
                        {JSON.stringify(userInfo) == '{}' &&
                            <Spinner
                                thickness='4px'
                                speed='0.65s'
                                emptyColor='gray.200'
                                color='blue.500'
                                size='xl'
                            />
                        }
                        {userInfo.ok &&
                            <>
                                <Flex direction="row" gap="4" mb="6">
                                    <Card flex="1">
                                        <CardHeader>
                                            <Heading as="h3" size="lg">{userInfo.user.fullname}</Heading>
                                            {userInfo.user.title && <Text>{userInfo.user.title}</Text>}
                                            {entityAdminInfo.email && <Text>{entityAdminInfo.email}</Text>}
                                        </CardHeader>
                                        <CardBody>
                                            <Text>
                                                {userInfo.user.active == 'Y' ? 'Active' : 'Inactive' } {'>'} Last updated {formatTimestamp(userInfo.user.update_timestamp)}
                                            </Text>
                                        </CardBody>
                                    </Card>
                                    <Card flex="1">
                                        <CardHeader>
                                            <Heading as="h3" size="lg">{userInfo.user.entity.entity_name}</Heading>
                                        </CardHeader>
                                        <CardBody>
                                            <Text>
                                                {userInfo.user.entity.active == 'Y' ? 'Active' : 'Inactive' } {'>'} Last updated {formatTimestamp(userInfo.user.entity.update_timestamp)}
                                            </Text>
                                        </CardBody>
                                    </Card>
                                </Flex>

                                <AuthorizedCard entity={userInfo.user.entity} updatePendingInvitations={updatePendingInvitations}  />
                            </>
                        }
                    </Box>
                    <Button my="2em" onClick={() => signOut(appConfig.cognitoDomain, appConfig.entityAdmin.cognitoID)}>Sign Out</Button>
                </>
            }
        </div>
    );
}
