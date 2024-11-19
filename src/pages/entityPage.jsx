import { useEffect, useState, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Heading, Button, Text, Spinner, Box, Card, CardHeader, CardBody, Flex, Icon, CardFooter } from '@chakra-ui/react';
import { BsFileEarmarkLock2 } from 'react-icons/bs';

import { exchangeAuthorizationCode } from '../lib/exchangeAuthorizationCode';
import { lookupUserContextAPI } from '../lib/entity/lookupUserContextAPI';
import { signIn } from '../lib/signIn';
import { signOut } from '../lib/signOut';

import { UserContext } from '../lib/userContext';

import AuthorizedCard from './entityPage/authorizedCard';

export default function EntityPage() {

    let [searchParams, setSearchParams] = useSearchParams();

    const {setUser} = useContext(UserContext);

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

            if (!accessToken || !idToken) {
                // If there are not login tokens, signal that there is not a login session and return early.
                setEntityAdminInfo({login: false});
                return;
            }

            // If there are login tokens, use them to get the user data.
            const decodedIdToken = JSON.parse(atob(idToken.split('.')[1]));
            setEntityAdminInfo(decodedIdToken);

            // Get the user data from the API and store it in local state.
            const userInfoResponse = await lookupUserContextAPI(accessToken, decodedIdToken.email);
            setUserInfo(userInfoResponse.payload);

            // Also set the user context for the avatar in the header.
            setUser(userInfoResponse.payload.user);
            
        };

        fetchData();
    }, []);

    return (
        <div>
            <Heading as={"h2"} size={"xl"}>Registered Entity Administrator</Heading>
            <Text>
                Lorem ipsum minim anim id do nisi aliqua. Consequat cillum sint qui ad aliqua proident nostrud. Cillum ullamco consectetur mollit eu labore amet ullamco mollit dolor veniam adipisicing veniam nulla ex. Quis irure minim id commodo dolore anim nulla aliqua reprehenderit pariatur. Id aute mollit pariatur tempor ex aute id voluptate enim. Et excepteur dolore non non ad deserunt duis voluptate aliqua officia qui ut elit.
            </Text>
            {entityAdminInfo.login === false &&
                <Card my={6} align="center">
                    <CardHeader><Heading as="h2" color="gray.500" >Not logged in</Heading></CardHeader>
                    <CardBody>
                        <Icon color="gray.500" as={BsFileEarmarkLock2} w={24} h={24} />
                    </CardBody>
                    <CardFooter>
                        <Button
                            onClick={() => signIn( import.meta.env.VITE_ENTITY_COGNITO_CLIENTID, 'entity' )}
                        >
                            Sign In as an Entity Administrator
                        </Button>
                    </CardFooter>
                </Card>
            }
            {entityAdminInfo && entityAdminInfo.email &&
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
                                                {userInfo.user.active == 'Y' ? 'Active' : 'Inactive' } {'>'} Last updated {userInfo.user.update_timestamp}
                                            </Text>
                                        </CardBody>
                                    </Card>
                                    <Card flex="1">
                                        <CardHeader>
                                            <Heading as="h3" size="lg">{userInfo.user.entity.entity_name}</Heading>
                                        </CardHeader>
                                        <CardBody>
                                            <Text>
                                                {userInfo.user.entity.active == 'Y' ? 'Active' : 'Inactive' } {'>'} Last updated {userInfo.user.entity.update_timestamp}
                                            </Text>
                                        </CardBody>
                                    </Card>
                                </Flex>

                                <AuthorizedCard entity={userInfo.user.entity} />
                            </>
                        }
                    </Box>
                    <Button my="2em" onClick={signOut}>Sign Out</Button>
                </>
            }
        </div>
    );
}
