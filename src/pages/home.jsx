import { Link as ReactRouterLink, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Box, Button, Card, CardBody, CardFooter, Heading, SimpleGrid, Stack, Text } from "@chakra-ui/react";

import { signIn } from '../lib/signIn';



export default function Home() {

    const navigate = useNavigate();

    const idToken = Cookies.get('EttIdJwt');

    function handleConsentingSignIn(event) {
        event.preventDefault();
    
        idToken ? navigate('/consenting') : signIn();
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
                            <Heading size="md">Registered Entity Administrator</Heading>
                            <Text py={"2"}>
                                The Registered Entity Administrator is responsible for managing the entity’s profile, including adding and removing Authorized Individuals and Consenting Persons.
                            </Text>
                        </CardBody>
                        <CardFooter paddingTop={"-2"}>
                            <Button as={ReactRouterLink} to='/entity' colorScheme="gray" variant="solid">Sign In</Button>
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
                            <Button as={ReactRouterLink} to='/authorized' colorScheme="gray" variant="solid">Sign In</Button>
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
                            <Button mr="1em" onClick={handleConsentingSignIn} colorScheme="gray" variant="solid">{ idToken ? 'Enter' : 'Sign In'}</Button>
                            <Button as={ReactRouterLink} to='/consenting' colorScheme="gray" variant="solid">Register</Button>
                        </CardFooter>
                    </Stack>
                </Card>
            </SimpleGrid>
        </>
    );
}
