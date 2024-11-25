import { Link as ReactRouterLink, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Box, Button, Card, CardBody, CardFooter, Heading, SimpleGrid, Stack, Text } from "@chakra-ui/react";

import { signIn } from '../lib/signIn';
import { getRoleForScope } from '../lib/getRoleForScope';

export default function Home() {

    const navigate = useNavigate();

    const idToken = Cookies.get('EttIdJwt');
    const accessToken = Cookies.get('EttAccessJwt');

    const decodedIdToken = idToken ? JSON.parse(atob(idToken.split('.')[1])) : {};
    const decodedAccessToken = accessToken ? JSON.parse(atob(accessToken.split('.')[1])) : null;

    const sessionRole = decodedAccessToken ? getRoleForScope(decodedAccessToken.scope) : 'none';


    function handleConsentingSignIn(event) {
        event.preventDefault();

        const consentClientId = import.meta.env.VITE_CONSENTING_COGNITO_CLIENTID;

        // If there is an idToken, navigate to the consenting page, otherwise sign in with the consenting role.
        idToken ? navigate('/consenting') : signIn( consentClientId, 'consenting' );
    }

    function handleAuthorizedSignIn(event) {
        event.preventDefault();

        const authClientId = import.meta.env.VITE_AUTHORIZED_COGNITO_CLIENTID;

        idToken ? navigate('/auth-ind') : signIn( authClientId, 'auth-ind' );
    }

    function handleEntitySignIn(event) {
        event.preventDefault();

        const entityClientId = import.meta.env.VITE_ENTITY_COGNITO_CLIENTID;

        idToken ? navigate('/entity') : signIn( entityClientId, 'entity' );
    }

    return (
        <>
            <Box my={"2em"}>
                <Text>
                ETT is designed to support AAU’s harassment prevention principles and the recommendations of NASEM’s June 2018 report on sexual harassment of women in academic science, engineering, and medicine by helping to create a norm of transparency about findings of misconduct against a person, across the higher-education and research ecosystem of societies, institutions of higher education, and other research organizations. This tool covers sexual, gender, and racial misconduct — as well as professional licensure, financial, and research misconduct to maximize its utility.    
                </Text>
            </Box>
            <SimpleGrid spacing={4} templateColumns={"repeat(auto-fill, minmax(300px, 1fr))"}>
                <Card
                    maxWidth={"sm"}
                    overflow={"hidden"}
                    variant={"outline"}
                >
                    <Stack>
                        <CardBody>
                            <Heading size="md">Administrative Support Person</Heading>
                            <Text py={"2"}>
                                lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
                            </Text>
                        </CardBody>
                        <CardFooter>
                            <Button 
                              onClick={handleEntitySignIn} 
                              isDisabled={sessionRole !== 'none' && sessionRole !== 'entity'} 
                              colorScheme="gray" 
                              variant="solid"
                            >
                                {sessionRole === 'entity' ? 'Enter' : 'Sign In'}
                            </Button>
                        </CardFooter>
                    </Stack>
                </Card>
                <Card
                    maxWidth={"sm"}
                    overflow={"hidden"}
                    variant={"outline"}
                >
                    <Stack>
                        <CardBody>
                            <Heading size="md">Authorized Individual</Heading>
                            <Text py={"2"}>
                                lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            </Text>
                        </CardBody>
                        <CardFooter paddingTop={"-2"}>
                            <Button 
                              onClick={handleAuthorizedSignIn} 
                              isDisabled={sessionRole !== 'none' && sessionRole !== 'auth-ind'} 
                              colorScheme="gray" 
                              variant="solid"
                            >
                                {sessionRole === 'auth-ind' ? 'Enter' : 'Sign In'}
                            </Button>
                        </CardFooter>
                    </Stack>
                </Card>
                <Card
                    maxW={"sm"}
                    overflow={"hidden"}
                    variant={"outline"}
                >
                    <Stack>
                        <CardBody>
                            <Heading size="md">Consenting Person</Heading>
                            <Text py={"2"}>
                                lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            </Text>
                        </CardBody>
                        <CardFooter paddingTop={"-2"}>
                            <Button
                                mr="1em"
                                isDisabled={sessionRole !== 'none' && sessionRole !== 'consenting'}
                                onClick={handleConsentingSignIn} colorScheme="gray"
                                variant="solid"
                            >
                                {sessionRole === 'consenting' ? 'Enter' : 'Sign In'}
                            </Button>
                            <Button as={ReactRouterLink} isDisabled={sessionRole !== 'none'} to='/consenting/register' colorScheme="gray" variant="solid">Register</Button>
                        </CardFooter>
                    </Stack>
                </Card>
            </SimpleGrid>
        </>
    );
}
