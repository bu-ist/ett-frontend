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
                Lorem ipsum minim anim id do nisi aliqua. Consequat cillum sint qui ad aliqua proident nostrud. Cillum ullamco consectetur mollit eu labore amet ullamco mollit dolor veniam adipisicing veniam nulla ex. Quis irure minim id commodo dolore anim nulla aliqua reprehenderit pariatur. Id aute mollit pariatur tempor ex aute id voluptate enim. Et excepteur dolore non non ad deserunt duis voluptate aliqua officia qui ut elit.
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
                    <SimpleGrid spacing={4} columns={2}>
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
                                       Minim ut velit fugiat dolore incididunt ullamco reprehenderit irure culpa. Occaecat aliquip consequat occaecat occaecat excepteur. Fugiat occaecat voluptate consectetur qui sunt est. Officia magna id aute incididunt cupidatat non ut sit in sit ea mollit minim. Nulla irure dolore occaecat Lorem amet proident duis adipisicing qui ex cillum laborum velit. Eiusmod aliquip velit nostrud elit aliqua ea reprehenderit Lorem anim minim. Ad nisi aute proident laborum proident minim Lorem velit.
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
                                        Minim ut velit fugiat dolore incididunt ullamco reprehenderit irure culpa. Occaecat aliquip consequat occaecat occaecat excepteur. Fugiat occaecat voluptate consectetur qui sunt est. Officia magna id aute incididunt cupidatat non ut sit in sit ea mollit minim. Nulla irure dolore occaecat Lorem amet proident duis adipisicing qui ex cillum laborum velit. Eiusmod aliquip velit nostrud elit aliqua ea reprehenderit Lorem anim minim. Ad nisi aute proident laborum proident minim Lorem velit.
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
