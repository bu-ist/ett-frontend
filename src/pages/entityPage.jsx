import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Heading, Button, Text, Spinner, Box, Card, CardHeader, CardBody } from '@chakra-ui/react';

import { exchangeAuthorizationCode } from '../lib/exchangeAuthorizationCode';
import { lookupUserContextAPI } from '../lib/entity/lookupUserContextAPI';
import { signOut } from '../lib/signOut';

export default function EntityPage() {

    let [searchParams, setSearchParams] = useSearchParams();

    const [entityAdminInfo, setEntityAdminInfo] = useState({});
    const [userInfo, setUserInfo] = useState({});

    useEffect(() => {
        const fetchData = async () => {

            if (searchParams.has('code') && Cookies.get('EttAccessJwt') === undefined) {
                // If this exists, then there is a sign in request, so use the code to get the tokens and store them as cookies.
                const clientId = import.meta.env.VITE_ENTITY_COGNITO_CLIENTID;
                await exchangeAuthorizationCode( clientId, 'entity');
                //Once the tokens are stored, should remove the code from the URL.

                // Use setSearchParams to empty the search params once exchangeAuthorizationCode is done with them.
                setSearchParams({});
            }

            const accessToken = Cookies.get('EttAccessJwt');
            const idToken = Cookies.get('EttIdJwt');

            if (accessToken && idToken) {
                const decodedIdToken = JSON.parse(atob(idToken.split('.')[1]));
                setEntityAdminInfo(decodedIdToken);

                const userInfoResponse = await lookupUserContextAPI(accessToken, decodedIdToken.email);
                setUserInfo(userInfoResponse.payload);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <Heading as={"h3"} size={"lg"}>Registered Entity Administrator</Heading>
            {entityAdminInfo && entityAdminInfo.email &&
                <>
                    <p>Signed in as {entityAdminInfo.email}</p>
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
                                <Card my="1em">
                                    <CardHeader>
                                        <Heading as="h3" size="md">{userInfo.user.fullname}</Heading>
                                        {userInfo.user.title && <Text>{userInfo.user.title}</Text>
                                        }
                                    </CardHeader>
                                    <CardBody>Lorem Ipsum</CardBody>
                                </Card>

                                <Card mb="1em">
                                    <CardHeader>Entity</CardHeader>
                                    <CardBody>{userInfo.user.entity.entity_name}</CardBody>
                                </Card>
                                <Card>
                                    <CardHeader>Members</CardHeader>
                                    <CardBody>
                                        {userInfo.user.entity.users.length == 0 && <Text>No Members</Text>}
                                        {userInfo.user.entity.users.map((member, index) => (
                                            <Text key={index}>{member.fullname}</Text>
                                        ))}
                                    </CardBody>
                                </Card>
                            </>
                        }
                    </Box>
                    <Button my="2em" onClick={signOut}>Sign Out</Button>
                </>
            }
        </div>
    );
}
