import { useContext } from "react";
import { Link as ReactRouterLink, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Box, Button, Card, CardBody, CardFooter, Heading, Image, ListItem, SimpleGrid, Stack, Text, UnorderedList } from "@chakra-ui/react";

import { ConfigContext } from "../lib/configContext";

import { signIn } from '../lib/signIn';
import { getRoleForScope } from '../lib/getRoleForScope';

import DescriptionParagraph from '../components/sharedTexts/home-about/descriptionParagraph';
import DescriptionDetails from '../components/sharedTexts/home-about/descriptionDetails';
import DownloadBlankForms from '../components/sharedTexts/home-about/downloadBlankForms';

export default function Home() {

    const { appConfig } = useContext(ConfigContext);

    const navigate = useNavigate();

    const idToken = Cookies.get('EttIdJwt');
    const accessToken = Cookies.get('EttAccessJwt');

    const decodedIdToken = idToken ? JSON.parse(atob(idToken.split('.')[1])) : {};
    const decodedAccessToken = accessToken ? JSON.parse(atob(accessToken.split('.')[1])) : null;

    const sessionRole = decodedAccessToken ? getRoleForScope(decodedAccessToken.scope) : 'none';


    function handleConsentingSignIn(event) {
        event.preventDefault();

        // Get the correct cognitoID from the appConfig.
        const { cognitoDomain, consentingPerson: { cognitoID } } = appConfig;

        // If there is an idToken, navigate to the consenting page, otherwise sign in with the consenting role.
        idToken ? navigate('/consenting') : signIn( cognitoID, 'consenting', cognitoDomain );
    }

    function handleAuthorizedSignIn(event) {
        event.preventDefault();

        // Get the correct cognitoID from the appConfig.
        const { cognitoDomain, authorizedIndividual: { cognitoID } } = appConfig;

        // If there is an idToken, navigate to the auth-ind page, otherwise sign in with the auth-ind role.
        idToken ? navigate('/auth-ind') : signIn( cognitoID, 'auth-ind', cognitoDomain );
    }

    function handleEntitySignIn(event) {
        event.preventDefault();

        // Get the correct cognitoID from the appConfig.
        const { cognitoDomain, entityAdmin: { cognitoID } } = appConfig;

        // If there is an idToken, navigate to the entity page, otherwise sign in with the entity role.
        idToken ? navigate('/entity') : signIn( cognitoID, 'entity', cognitoDomain );
    }

    return (
        <>
            <Box my={"2em"}>
                <Heading size="md" mb="2">Welcome to the Ethical Transparency Tool (ETT)</Heading>
                <DescriptionParagraph />
            </Box>
            <Heading mb="4" size="md">Access ETT</Heading>
            <SimpleGrid spacing={4} templateColumns={"repeat(auto-fill, minmax(300px, 1fr))"}>
                <Card
                    maxWidth={"sm"}
                    overflow={"hidden"}
                    variant={"outline"}
                >
                    <Stack>
                        <CardBody>
                            <Heading size="md">Administrative Support Professional</Heading>
                            <Text py={"2"} mb="3rem">
                                A person who assists a Registered Entity&apos;s Authorized Individuals in the use of ETT.
                                A Registered Entity is a Society or IHE or other organization that has voluntarily joined the ETT by registering at this website.
                            </Text>
                        </CardBody>
                        <CardFooter>
                            <Button 
                              onClick={handleEntitySignIn} 
                              isDisabled={(sessionRole !== 'none' && sessionRole !== 'entity') || !appConfig} 
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
                            <Text py="2">
                                A person in a senior role within a Registered Entity who deals with sensitive information, 
                                and who will directly receive completed Disclosure Form on behalf of the Registered Entity and 
                                decide (or contact another official with authority to decide) who at the Entity needs to receive 
                                the information. Each registered entity has two Authorized Individuals.
                            </Text>
                        </CardBody>
                        <CardFooter paddingTop={"-2"}>
                            <Button 
                              onClick={handleAuthorizedSignIn} 
                              isDisabled={(sessionRole !== 'none' && sessionRole !== 'auth-ind') || !appConfig} 
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
                            <Heading size="md">Consenting Individual</Heading>
                            <Text py={"2"}>
                                A person who is (or may be in the future) a candidate for a privilege or honor (e.g., elected fellow, elected or life membership; 
                                honor or award recipient, emeritus or endowed role; elected or appointed governance committee, officer or leadership role) or employment 
                                or role (e.g., faculty or  staff employee, post-doc, mentor, supervisor, volunteer, etc.) who is being considered (or may be considered in the future) 
                                by a Registered Entity. Consenting Individuals provide consent via ETT for certain disclosures (findings  <b>not</b> allegations)  to be made about the person’s conduct.  Disclosures 
                                are made by the person’s professional affiliated entities (employers, societies and membership organizations, 
                                appointing and honoring organizations) <b>directly</b> to any Registered Entity(ies) that make a <b>disclosure request</b> via ETT.  
                                But ETT <b>never</b> receives any disclosures.
                            </Text>
                        </CardBody>
                        <CardFooter paddingTop={"-2"}>
                            <Button
                                mr="1em"
                                isDisabled={(sessionRole !== 'none' && sessionRole !== 'consenting') || !appConfig}
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
            <Box my="6">
                <DescriptionDetails />
                <DownloadBlankForms />
            </Box>
        </>
    );
}
