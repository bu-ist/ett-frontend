import { useEffect, useState, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Button, Card, CardBody, CardFooter, CardHeader, Heading, Icon, SimpleGrid, Spinner, Stack, Text } from '@chakra-ui/react';
import { Bs1CircleFill, Bs2CircleFill, BsFileEarmarkLock2 } from "react-icons/bs";

import { ConfigContext } from "../lib/configContext";
import { UserContext } from '../lib/userContext';

import { exchangeAuthorizationCode } from '../lib/exchangeAuthorizationCode';
import { signIn } from '../lib/signIn';
import { signOut } from '../lib/signOut';

import { lookupAuthIndAPI } from '../lib/auth-ind/lookupAuthIndAPI';

import ConsentersAutocomplete from './authorizedPage/consentersAutocomplete';
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

            // Need to add error checking, but I'm not yet sure all these components will stay on the same page.
            setApiState('success');
        };

        fetchData();
    }, [appConfig]);

    return (
        <div>
            <Heading as="h2" size={"xl"}>Authorized Individual</Heading>
            <Text>
                Authorized Individuals (AIs) should be in senior institutional roles, accustomed to managing sensitive
                and confidential information, and knowledgeable about the ETT-Registered Entity.
            </Text>
            {apiState === 'loading' && <Spinner />}
            {apiState === 'not-logged-in' &&
                <Card my={6} align="center">
                    <CardHeader><Heading as="h2" color="gray.500">Not logged in</Heading></CardHeader>
                    <CardBody>
                        <Icon color="gray.500" as={BsFileEarmarkLock2} w={24} h={24} />
                    </CardBody>
                    <CardFooter>
                        <Button onClick={() => signIn( appConfig.authorizedIndividual.cognitoID, 'auth-ind' )}>Sign In as Authorized Individual</Button>
                    </CardFooter>
                </Card>
            }
            {(authorizedInfo && authorizedInfo.email && apiState == 'success' && appConfig) &&
                <>
                    <AuthIndDetails userInfo={userData} />
                    <EntityInfoCard entityInfo={userData.entity} />
                    <SimpleGrid mt="10" spacing={4} columns={2}>
                        <Card
                            overflow={"hidden"}
                            variant={"outline"}
                        >
                            <Stack>
                                <CardBody>
                                    <Stack direction="row">
                                        <Bs1CircleFill size="1.6rem" color="gray" />
                                        <Heading size="md">Make an Exhibit Form request</Heading>
                                    </Stack>
                                    <Text py={"2"} mb={"1em"}>
                                        Make an request via email to a Consenting Person. Upon receiving the request, the Consenting Person enters 
                                        their private ETT page to complete Exhibit Forms (a Full Form listing all of the Consenting Person's Affiliates, 
                                        prior or current at the time—and Single Entity Forms, one for each Affiliate listing only it), with a contact for each. 
                                        Exhibit Forms pair with Consent Forms to confirm individual’s Consent Recipients for authorized disclosures. A Consenting Person 
                                        completes new Exhibit Forms, with up-to-date Affiliate listings and contacts, each time the Consenting Person is considered by any 
                                        registered entity.
                                    </Text>
                                    <ConsentersAutocomplete entityId={userData.entity.entity_id} />
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
                                        <Bs2CircleFill size="1.6rem" color="gray" />
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
                                    <DisclosureRequestForm entityId={userData.entity.entity_id} />
                                </CardBody>
                            </Stack>
                        </Card>
                    </SimpleGrid>
                    <Button my="2em" onClick={ () => signOut( appConfig.cognitoDomain, appConfig.authorizedIndividual.cognitoID ) }>Sign Out</Button>
                </>
            }
        </div>
    );
}
