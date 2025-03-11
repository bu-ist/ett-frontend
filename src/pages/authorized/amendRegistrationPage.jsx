import { useEffect, useState, useContext, Fragment } from 'react';
import { useSearchParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Heading, Text, Spinner, Card, CardHeader, CardBody, Icon, CardFooter, Button, ButtonGroup, Box } from "@chakra-ui/react";
import { BsFileEarmarkLock2 } from "react-icons/bs";
import { AiOutlineClose } from 'react-icons/ai';
import { RiMailLine } from "react-icons/ri";
import { HiCheckCircle } from 'react-icons/hi';

import { ConfigContext } from '../../lib/configContext';
import { UserContext } from '../../lib/userContext';

import { exchangeAuthorizationCode } from '../../lib/exchangeAuthorizationCode';
import { signIn } from '../../lib/signIn';

import { lookupAuthIndAPI } from '../../lib/auth-ind/lookupAuthIndAPI';

export default function AmendRegistrationPage() {
    let [searchParams, setSearchParams] = useSearchParams();

    const { appConfig } = useContext(ConfigContext);
    const { setUser } = useContext(UserContext);

    const [authorizedInfo, setAuthorizedInfo] = useState({});
    const [userData, setUserData] = useState({});

    const [apiState, setApiState] = useState('idle');
    const [firstLogin, setFirstLogin] = useState(false);


    // Get the user whose role is 'RE_ADMIN', which is the administrative support professional.
    const adminUser = userData.entity?.users?.find(user => user.role === 'RE_ADMIN') || '';

    // Get the user whose role is 'RE_AUTH_IND', which is the authorized individual.
    const authUser = userData.entity?.users?.find(user => user.role === 'RE_AUTH_IND') || '';

    async function fetchData() {
        // appConfig is initially loaded through an api call, which won't have been completed on the first render, so return early if it's not loaded yet.
        // Because appConfig is a dependency of this useEffect, fetchData will be called again when appConfig is loaded.
        if (!appConfig) {
            setApiState('loading');
            return;
        }

        // De-structure useful values from the appConfig.
        const { cognitoDomain, apiStage, authorizedIndividual: { cognitoID, apiHost } } = appConfig;

        // Check to see if this is a first time login from the cognito redirect, and if so do a signIn.
        // This workaround has to do with the state and code_verifier, which aren't part of the sign up flow.
        if ( searchParams.get('action') === 'post-signup' && searchParams.has('code') ) {
            // Any existing login cookies will get in the way, so clear them first.
            Cookies.remove('EttAccessJwt');
            Cookies.remove('EttIdJwt');

            // Set a flag in localStorage to indicate first login.
            window.localStorage.setItem('firstLogin', 'true');

            // Sign in does a window.location redirect, so execution will stop here.
            signIn( cognitoID, 'auth-ind', cognitoDomain );
        }

        if (searchParams.has('code') && Cookies.get('EttAccessJwt') === undefined) {
            // If this exists, then there is a sign in request, so use the code to get the tokens and store them as cookies.

            await exchangeAuthorizationCode( cognitoDomain, cognitoID, 'auth-ind');

            // Use setSearchParams to empty the search params once exchangeAuthorizationCode is done with them.
            setSearchParams({});
        }

        const accessToken = Cookies.get('EttAccessJwt');
        const idToken = Cookies.get('EttIdJwt');

        if (!accessToken || !idToken) {
            // Set the apiState to 'not-logged-in' to provide feedback
            setApiState('not-logged-in');
            return;
        }

        // If there are login tokens, get the user data.
        const decodedIdToken = JSON.parse(atob(idToken.split('.')[1]));
        setAuthorizedInfo(decodedIdToken);

        // Get the consenter list and user data.
        setApiState('loading');

        // Get the user data from the API and store it in local state.
        const authIndResponse = await lookupAuthIndAPI(apiHost, apiStage, accessToken, decodedIdToken.email);
        setUserData(authIndResponse.payload.user);

        // Also set the user context for the avatar in the header.
        setUser(authIndResponse.payload.user);

        // Check if this is the first login by looking for the flag in sessionStorage.
        if (window.localStorage.getItem('firstLogin')) {
            setFirstLogin(true);
            window.localStorage.removeItem('firstLogin');
        }

        // Need to add error checking, but I'm not yet sure all these components will stay on the same page.
        setApiState('success');
    };


    useEffect(() => {
        fetchData();
    }, [appConfig]);

    return (
        <>
            <Heading as="h2" my={4}>Amend Registration</Heading>
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
                You can amend the entity registration by modifying its name, or removing any of its representatives, including yourself. 
                If you remove a representative, you can continue normal operation for 30 days with the vacancy, 
                but will be terminated in the ETT system if no replacement registers by then. 
                Optionally, you can also invite an individual you intend as a replacement, and that 
                person will be issued an email that invites them to register with with a special link. The same 30 day deadline applies.
            </Text>
            {apiState === 'loading' && <Spinner />}
            {apiState === 'not-logged-in' &&
                <Card my={6} align="center">
                    <CardHeader><Heading as="h2" color="gray.500">Not logged in</Heading></CardHeader>
                    <CardBody>
                        <Icon color="gray.500" as={BsFileEarmarkLock2} w={24} h={24} />
                    </CardBody>
                    <CardFooter>
                        <Button onClick={() => signIn( appConfig.authorizedIndividual.cognitoID, 'auth-ind', appConfig.cognitoDomain )}>Sign In as Authorized Individual</Button>
                    </CardFooter>
                </Card>
            }
            {apiState === 'success' && appConfig &&
                <>
                    <Card my="6">
                        <CardHeader>
                            <Heading size="lg" as="h3">Entity Name</Heading>
                        </CardHeader>
                        <CardBody>
                            <Text fontSize="2xl">{userData.entity.entity_name}</Text>
                        </CardBody>
                        <CardFooter>
                            <Button>Change Entity Name</Button>
                        </CardFooter>
                    </Card>
                    <Card my="6">
                        <CardHeader>
                            <Heading size="lg" as="h3">Administrative Support Professional</Heading>
                        </CardHeader>
                        <CardBody>
                            <Text>{adminUser.fullname}</Text>
                            <Text>{adminUser.title}</Text>
                            <Text>{adminUser.email}</Text>
                            <Text>{adminUser.phone_number}</Text>
                        </CardBody>
                        <CardFooter>
                            <ButtonGroup spacing="6">
                                <Button leftIcon={<AiOutlineClose/>}>Remove</Button>
                                <Button leftIcon={<RiMailLine />} >Remove and Invite Replacement</Button>
                            </ButtonGroup>
                        </CardFooter>
                    </Card>
                    <Card my="6">
                        <CardHeader><Heading size="lg" as="h3">My Information (Authorized Individual)</Heading></CardHeader>
                        <CardBody>
                            <Text>{userData.fullname}</Text>
                            <Text>{userData.title}</Text>
                            <Text>{userData.email}</Text>
                            <Text>{userData.phone_number}</Text>
                        </CardBody>
                        <CardFooter>
                            <ButtonGroup spacing="6">
                                <Button leftIcon={<AiOutlineClose/>}>Remove</Button>
                                <Button leftIcon={<RiMailLine />} >Remove and Invite Replacement</Button>
                            </ButtonGroup>
                        </CardFooter>
                    </Card>
                    {authUser !== '' &&
                        <Card my="6">
                            <CardHeader><Heading size="lg" as="h3">Second Authorized Individual</Heading></CardHeader>
                            <CardBody>
                                <Text>{authUser.fullname}</Text>
                                <Text>{authUser.title}</Text>
                                <Text>{authUser.email}</Text>
                                <Text>{authUser.phone_number}</Text>
                            </CardBody>
                            <CardFooter>
                                <ButtonGroup spacing="6">
                                    <Button leftIcon={<AiOutlineClose/>}>Remove</Button>
                                    <Button leftIcon={<RiMailLine />} >Remove and Invite Replacement</Button>
                                </ButtonGroup>
                            </CardFooter>
                        </Card>
                    }
                    {userData.entity.pendingInvitations?.length > 0 &&
                        <Card my="6">
                            <CardHeader><Heading size="lg" as="h3">Pending Invitation to Authorized Individuals</Heading></CardHeader>
                            <CardBody>
                                {userData.entity.pendingInvitations.map((invitation, index) => {
                                    return (
                                        <Fragment key={index}>
                                            <Text key={index}>
                                                { ('code' in invitation) && `Invitation code starting with ${invitation.code.substring(0,6)} sent on ${invitation.sent_timestamp}` }
                                            </Text>
                                            <Button leftIcon={<AiOutlineClose />} mt="8">Retract Invitiation</Button>
                                        </Fragment>
                                    );
                                })}
                            </CardBody>
                        </Card>
                    }
                </>
            }
        </>
    );
}
