import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Button, Card, CardBody, Heading, SimpleGrid, Spinner, Stack, Text } from '@chakra-ui/react';

import { exchangeAuthorizationCode } from '../lib/exchangeAuthorizationCode';
import { signOut } from '../lib/signOut';

import { lookupAuthIndAPI } from '../lib/auth-ind/lookupAuthIndAPI';
import { getConsenterListAPI } from '../lib/auth-ind/getConsenterListAPI';

import ConsentersAutocomplete from './authorizedPage/consentersAutocomplete';
import AuthIndDetails from './authorizedPage/authIndDetails';
import DisclosureRequestForm from './authorizedPage/disclosureRequestForm';

export default function AuthorizedPage() {
    let [searchParams, setSearchParams] = useSearchParams();

    const [authorizedInfo, setAuthorizedInfo] = useState({});
    const [userData, setUserData] = useState({});

    const [apiState, setApiState] = useState('idle');

    const [consenterList, setConsenterList] = useState([]);

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
                setAuthorizedInfo(decodedIdToken);

                // Get the consenter list and user data.
                setApiState('loading');

                const consenterListResponse = await getConsenterListAPI(accessToken);
                setConsenterList(consenterListResponse.payload.consenters);

                const authIndResponse = await lookupAuthIndAPI(accessToken, decodedIdToken.email);
                setUserData(authIndResponse.payload.user);

                // Need to add error checking, but I'm not yet sure all these components will stay on the same page.
                setApiState('success');

            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <p>Signed in as {authorizedInfo.email}</p>
            <Heading as="h2" size={"xl"}>Authorized Individual</Heading>
            {apiState === 'loading' && <Spinner />}
            {(authorizedInfo && authorizedInfo.email && apiState == 'success') &&
                <>
                    <AuthIndDetails userInfo={userData} />
                    <SimpleGrid spacing={4} columns={2}>
                        <Card
                            overflow={"hidden"}
                            variant={"outline"}
                        >
                            <Stack>
                                <CardBody>
                                    <Heading size="md">Make an Exhibit Form request</Heading>
                                    <Text py={"2"} mb={"1em"}>
                                       Minim ut velit fugiat dolore incididunt ullamco reprehenderit irure culpa. Occaecat aliquip consequat occaecat occaecat excepteur. Fugiat occaecat voluptate consectetur qui sunt est. Officia magna id aute incididunt cupidatat non ut sit in sit ea mollit minim. Nulla irure dolore occaecat Lorem amet proident duis adipisicing qui ex cillum laborum velit. Eiusmod aliquip velit nostrud elit aliqua ea reprehenderit Lorem anim minim. Ad nisi aute proident laborum proident minim Lorem velit.
                                    </Text>
                                    <ConsentersAutocomplete consenterList={consenterList} entityId={userData.entity.entity_id} />
                                </CardBody>
                            </Stack>
                        </Card>
                        <Card
                            overflow={"hidden"}
                            variant={"outline"}
                        >
                            <Stack>
                                <CardBody>
                                    <Heading size="md">Make a disclosure request</Heading>
                                    <Text py={"2"} mb={"1em"}>
                                    Minim ut velit fugiat dolore incididunt ullamco reprehenderit irure culpa. Occaecat aliquip consequat occaecat occaecat excepteur. Fugiat occaecat voluptate consectetur qui sunt est. Officia magna id aute incididunt cupidatat non ut sit in sit ea mollit minim. Nulla irure dolore occaecat Lorem amet proident duis adipisicing qui ex cillum laborum velit. Eiusmod aliquip velit nostrud elit aliqua ea reprehenderit Lorem anim minim. Ad nisi aute proident laborum proident minim Lorem velit.
                                    </Text>
                                    <DisclosureRequestForm entityId={userData.entity.entity_id} />
                                </CardBody>
                            </Stack>
                        </Card>
                    </SimpleGrid>
                    <Button my="2em" onClick={signOut}>Sign Out</Button>
                </>
            }
        </div>
    );
}
