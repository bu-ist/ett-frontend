import { useEffect, useState, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Box, Button, Card, CardBody, CardFooter, CardHeader, Heading, Icon, SimpleGrid, Spinner, Stack, Text, Link } from '@chakra-ui/react';
import { Bs1CircleFill, Bs2CircleFill, Bs3CircleFill, BsFileEarmarkLock2 } from "react-icons/bs";
import { HiCheckCircle } from 'react-icons/hi';

import { ConfigContext } from "../lib/configContext";
import { UserContext } from '../lib/userContext';

import { exchangeAuthorizationCode } from '../lib/exchangeAuthorizationCode';
import { signIn } from '../lib/signIn';
import { signOut } from '../lib/signOut';

import { lookupAuthIndAPI } from '../lib/auth-ind/lookupAuthIndAPI';

import ExhibitFormRequest from './authorizedPage/exhibitFormRequest';
import AuthIndDetails from './authorizedPage/authIndDetails';
import EntityInfoCard from './authorizedPage/entityInfoCard';
import DisclosureRequestForm from './authorizedPage/disclosureRequestForm';

export default function AuthorizedPage() {
    let [searchParams, setSearchParams] = useSearchParams();

    const { appConfig } = useContext(ConfigContext);
    const { setUser } = useContext(UserContext);

    const [authorizedInfo, setAuthorizedInfo] = useState({});
    const [userData, setUserData] = useState({});

    const [apiState, setApiState] = useState('idle');
    const [firstLogin, setFirstLogin] = useState(false);

    // Check if the entity is registered by checking if the entity has a defined property named registered_timestamp.
    const isEntityRegistered = userData?.entity && Object.prototype.hasOwnProperty.call(userData.entity, 'registered_timestamp');


    useEffect(() => {
        const fetchData = async () => {
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

            // Check if this is the first login by looking for the flag in localStorage.
            if (window.localStorage.getItem('firstLogin')) {
                setFirstLogin(true);
                window.localStorage.removeItem('firstLogin');
            }

            // Need to add error checking here.
            if ( authIndResponse.payload?.ok && Object.keys( authIndResponse.payload.user ).length > 0 ) {
                console.log('User data retrieved successfully');
                setApiState('success');
                
            } else if (authIndResponse.payload?.ok && Object.keys( authIndResponse.payload.user ).length === 0) {
                // If there is an empty user, then probably there was a session logout so maybe clear the cookies.
                Cookies.remove('EttAccessJwt');
                Cookies.remove('EttIdJwt');

                // Set the apiState to 'not-logged-in' to provide feedback
                setApiState('not-logged-in');
                console.log('No user data found');
            } else {
                console.log('Error retrieving user data');
                setApiState('error');
            }

        };

        fetchData();
    }, [appConfig]);

    return (
        <div>
            <Heading as="h2" size={"xl"}>Authorized Individual</Heading>
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
                A person in a senior role within a Registered Entity who deals with sensitive information, 
                and who will request disclosures and directly receive completed Disclosure Form on behalf of the Registered Entity and 
                decide (or contact another official with authority to decide) who at the Entity needs to receive 
                the information. Each registered entity has two Authorized Individuals.
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
            {(authorizedInfo && authorizedInfo.email && apiState == 'success' && appConfig) &&
                <>
                    <AuthIndDetails userInfo={userData} setUserInfo={setUserData} />
                    <EntityInfoCard entityInfo={userData.entity} />

                    {isEntityRegistered &&
                    <SimpleGrid mt="10" spacing={4} columns={2}>
                        <Card
                            overflow={"hidden"}
                            variant={"outline"} 
                            gridColumn={{ base: "1 / span 2" }}  
                        >
                            <CardBody>
                                <Stack direction="row" >
                                    <Bs1CircleFill size="1.6rem" color="gray" />
                                    <Heading size="md">Send form for Requesting a New Individual Registration and Consent</Heading>
                                </Stack>
                                <Text py={"2"} mb={"1em"}>
                                    An Authorized Individual or Administrative Support Professional of an ETT-Registered 
                                    Entity that is considering a person for a privilege or honor, employment or role may 
                                    print out or download <Link textDecoration="underline" fontWeight="bold" color="blue.500" href="/consenter-invite-copy.pdf" target="_blank" rel="noopener noreferrer">this email template</Link> and 
                                    use it (and their own computer) to ask the person to register on ETT and complete a Consent Form if the person has 
                                    not already done so.
                                </Text>
                            </CardBody>
                        </Card>
                        <Card
                            overflow={"hidden"}
                            variant={"outline"}
                        >
                            <Stack>
                                <CardBody>
                                    <Stack direction="row">
                                        <Bs2CircleFill size="1.6rem" color="gray" />
                                        <Heading size="md">Make an Exhibit Form request</Heading>
                                    </Stack>
                                    <Text py={"2"} mb={"1em"}>
                                        Make a request via email to a Consenting Individual  whom your 
                                        ETT-Registered Entity is considering for a Privilege or Honor, Employment 
                                        or Role at the time. To do so, complete the information below and click on 
                                        “Send.” Upon receiving the Disclosure Request, the Consenting Individual 
                                        enters their private ETT page to complete Exhibit Forms (a Full Form 
                                        listing all of the Consenting Person’s professionally affiliated entities 
                                        (called “Affiliates,” also called “Disclosing Entities” and “Consent 
                                        Recipients”), prior or current at the time—and Single Entity Forms, one 
                                        for each Affiliate listing only it), with contact information for each. 
                                        Exhibit Forms pair with Consent Forms to confirm the Individual’s Consent 
                                        Recipients for authorized disclosures.  A Consenting Individual completes 
                                        new Exhibit Forms, with up-to-date Affiliate listings and contacts, each 
                                        time the person is considered by any ETT-Registered Entity.  ETT is a 
                                        conduit for making Disclosure Requests, not a record repository for 
                                        Exhibit Forms.
                                    </Text>
                                    <ExhibitFormRequest entityId={userData.entity.entity_id} />
                                </CardBody>
                            </Stack>
                        </Card>
                        <Card
                            overflow={"hidden"}
                            variant={"outline"}
                        >
                            <Stack>
                                <CardBody>
                                    <Stack direction="row">
                                        <Bs3CircleFill size="1.6rem" color="gray" />
                                        <Heading size="md">Make a disclosure request</Heading>
                                    </Stack>
                                    <Text py={"2"} mb={"1em"}>
                                        An entity that made findings (which is the most reliable source) makes disclosures directly to an ETT-Registered Entity 
                                        when it initiates an ETT-automated request. ETT provides an efficient “check the box” Disclosure Form Template, which 
                                        minimizes labor for a disclosing entity to make disclosures and for a receiving entity to review disclosures. 
                                        When completed, the Disclosure Form discloses the existence and year of a finding and the type of misconduct — or that there 
                                        is no finding of the types covered by ETT. A person’s input and these facts can be sufficient to inform an ETT-Registered Entity’s 
                                        independent decision-making in many situations. A disclosing entity retains sole custody of its records. ETT never receives 
                                        disclosures or conduct records and cannot create a central repository of them.
                                    </Text>
                                    <DisclosureRequestForm 
                                        entityId={userData.entity.entity_id}
                                        role="RE_AUTH_IND"
                                    />
                                </CardBody>
                            </Stack>
                        </Card>
                    </SimpleGrid>
                    }
                    {!isEntityRegistered &&
                        <Card>
                            <CardHeader>
                                <Heading as="h3" size="sm">Entity Registration</Heading>
                            </CardHeader>
                            <CardBody>
                                <Text>
                                    {userData.entity.entity_name} is not yet fully registered.
                                </Text>
                            </CardBody>
                        </Card>
                    }
                    <Button mt="24" onClick={ () => signOut( appConfig.cognitoDomain, appConfig.authorizedIndividual.cognitoID ) }>Sign Out</Button>
                </>
            }
        </div>
    );
}
