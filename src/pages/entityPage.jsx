import { useEffect, useState, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Heading, Button, Text, Spinner, Box, Card, CardHeader, CardBody, Flex, Icon, CardFooter, VStack, Stack, HStack, useDisclosure } from '@chakra-ui/react';
import { BsFileEarmarkLock2, BsExclamationTriangle } from 'react-icons/bs';
import { HiMinusCircle, HiCheckCircle, HiPencil } from "react-icons/hi";

import { exchangeAuthorizationCode } from '../lib/exchangeAuthorizationCode';
import { lookupUserContextAPI } from '../lib/entity/lookupUserContextAPI';
import { signIn } from '../lib/signIn';
import { signOut } from '../lib/signOut';

import { ConfigContext } from '../lib/configContext';
import { UserContext } from '../lib/userContext';

import AuthorizedCard from './entityPage/authorizedCard';
import EditAdminDetailsModal from './entityPage/editAdminDetailsModal';

import { formatTimestamp } from '../lib/formatting/formatTimestamp';

export default function EntityPage() {

    let [searchParams, setSearchParams] = useSearchParams();

    // Get the appConfig from the ConfigContext.
    const { appConfig } = useContext( ConfigContext );

    const {setUser} = useContext(UserContext);

    const [entityAdminInfo, setEntityAdminInfo] = useState({});
    const [userInfo, setUserInfo] = useState({});

    const [apiState, setApiState] = useState('idle');
    const [firstLogin, setFirstLogin] = useState(false);

    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleSaveSuccess = (updatedData) => {
        // Update userInfo with new values
        setUserInfo({
            ...userInfo,
            user: {
                ...userInfo.user,
                ...updatedData
            }
        });
    };

    useEffect(() => {
        // Asynchronously operations need to be declared in a local function to be called in useEffect.
        const fetchData = async () => {

            // appConfig is initially loaded through an api call, which won't have been completed on the first render, so return early if it's not loaded yet.
            // Because appConfig is a dependency of this useEffect, fetchData will be called again when appConfig is loaded.
            if (!appConfig) {
                setApiState('loading');
                return;
            }

            // Get the cognitoDomain and cognitoID from the appConfig.
            const { cognitoDomain, entityAdmin: { cognitoID } }  = appConfig;

            // Check to see if this is a first time login from the cognito redirect, and if so do a signIn.
            // This workaround has to do with the state and code_verifier, which aren't part of the sign up flow.
            if ( searchParams.get('action') === 'post-signup' ) {
                // Any existing login cookies will get in the way, so clear them first.
                Cookies.remove('EttAccessJwt');
                Cookies.remove('EttIdJwt');

                // Set a flag in localStorage to indicate first login.
                window.localStorage.setItem('firstLogin', 'true');

                // Sign in does a window.location redirect, so execution will stop here.
                signIn( cognitoID, 'entity', cognitoDomain );
            }


            if (searchParams.has('code') && Cookies.get('EttAccessJwt') === undefined) {
                // If this exists, then there is a sign in request, so use the code to get the tokens and store them as cookies.

                await exchangeAuthorizationCode( cognitoDomain, cognitoID, 'entity');
                //Once the tokens are stored, should remove the code from the URL.

                // Use setSearchParams to empty the search params once exchangeAuthorizationCode is done with them.
                setSearchParams({});
            }

            const accessToken = Cookies.get('EttAccessJwt');
            const idToken = Cookies.get('EttIdJwt');

            if (!accessToken || !idToken) {
                // If there are not login tokens, signal that there is not a login session and return early.
                setApiState('not-logged-in');
                return;
            }

            // If there are login tokens, use them to get the user data.
            const decodedIdToken = JSON.parse(atob(idToken.split('.')[1]));
            setEntityAdminInfo(decodedIdToken);

            // Signal that we are loading the user data.
            setApiState('loading');

            // Get the user data from the API and store it in local state.
            const userInfoResponse = await lookupUserContextAPI( appConfig, accessToken, decodedIdToken.email);

            // If invalid, set api state to error and return early.
            if (!userInfoResponse.payload || !userInfoResponse.payload.ok) {
                setApiState('error');
                setEntityAdminInfo({error: true});
                return;
            }

            // Set the user info in local state.
            setUserInfo(userInfoResponse.payload);

            // Also set the user context for the avatar in the header.
            setUser(userInfoResponse.payload.user);

            // Check if this is the first login by looking for the flag in localStorage.
            if (window.localStorage.getItem('firstLogin')) {
                setFirstLogin(true);
                window.localStorage.removeItem('firstLogin');
            }            
            
            // Need to add error checking, but I'm not yet sure all these components will stay on the same page.
            setApiState('success');
        };

        // Run the async wrapper function.
        fetchData();
    }, [appConfig, searchParams, setSearchParams, setUser]);

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
            {firstLogin && (
                <Card my={6} direction={{ base: "column", sm: "row" }} p="6">
                    <Icon as={HiCheckCircle} boxSize="16" color="green.500" />
                    <Box ml="4">
                        <Heading as="h3" size="md">Welcome!</Heading>
                        <Text>You have successfully created an account in the ETT system.</Text>
                    </Box>
                </Card>
            )}
            <Text>
                The Administrative Support Professional assists and directly works with one or both of the Authorized Individuals, 
                is accustomed to maintaining confidential and sensitive information, and can administratively support the 
                Registered Entity’s use of ETT, including submitting requests for disclosures when directed by an Authorized Individual. 
            </Text>
            {apiState === 'loading' && <Spinner />}
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
            { appConfig && apiState === 'not-logged-in' &&
                <Card my={6} align="center">
                    <CardHeader><Heading as="h2" color="gray.500" >Not logged in</Heading></CardHeader>
                    <CardBody>
                        <Icon color="gray.500" as={BsFileEarmarkLock2} w={24} h={24} />
                    </CardBody>
                    <CardFooter>
                        <Button
                            onClick={() => signIn( appConfig.entityAdmin.cognitoID, 'entity', appConfig.cognitoDomain )}
                        >
                            Sign In as an Entity Administrator
                        </Button>
                    </CardFooter>
                </Card>
            }
            {entityAdminInfo && entityAdminInfo.email && userInfo.ok && apiState == 'success' && appConfig &&
                <>
                    <Box my="2em">
                        <Flex direction="row" gap="4" mb="6">
                            <Card flex="1">
                                <CardHeader>
                                    <HStack justify="space-between" align="flex-start">
                                        <Box>
                                            <Heading as="h3" size="lg">{userInfo.user.fullname}</Heading>
                                            {userInfo.user.title && <Text>{userInfo.user.title}</Text>}
                                            {entityAdminInfo.email && <Text>{entityAdminInfo.email}</Text>}
                                        </Box>
                                        <Button
                                            leftIcon={<HiPencil />}
                                            size="sm"
                                            onClick={onOpen}
                                            mt="1"
                                        >
                                            Edit
                                        </Button>
                                    </HStack>
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
    
                                    {userInfo.user.entity.users.length < 2 &&
                                        <Stack mt="2" direction="row">
                                            <Icon as={HiMinusCircle} color="gray.300" boxSize={6} />
                                            <Text>Not fully registered, two Authorized Individuals required</Text>
                                        </Stack>
                                    }
                                    {userInfo.user.entity.users.length === 2 &&
                                        <Stack mt="2" direction="row">
                                            <Icon as={HiCheckCircle} color="green.300" boxSize={6} />
                                            <Text>Fully registered</Text>
                                        </Stack>
                                    }
                                </CardBody>
                            </Card>
                        </Flex>
                        <AuthorizedCard entity={userInfo.user.entity} updatePendingInvitations={updatePendingInvitations}  />
                    </Box>

                    <EditAdminDetailsModal 
                        isOpen={isOpen}
                        onClose={onClose}
                        adminInfo={userInfo.user}
                        onSaveSuccess={handleSaveSuccess}
                    />

                    <Button my="2em" onClick={() => signOut(appConfig.cognitoDomain, appConfig.entityAdmin.cognitoID)}>Sign Out</Button>
                </>
            }
        </div>
    );
}
