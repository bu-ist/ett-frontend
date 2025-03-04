import { useContext } from "react";
import { Link as ReactRouterLink, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Box, Button, Card, CardBody, CardFooter, Heading, Image, ListItem, SimpleGrid, Stack, Text, UnorderedList } from "@chakra-ui/react";

import { ConfigContext } from "../lib/configContext";

import { signIn } from '../lib/signIn';
import { getRoleForScope } from '../lib/getRoleForScope';

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
                <Heading size="md">Welcome to the Ethical Transparency Tool (ETT)</Heading>
                <Text>
                    ETT is an ethical and efficient communication tool for societies, colleges, and universities to lead by helping to create a norm of 
                    transparency about findings (not allegations) of misconduct about individuals (sexual/gender and race/ethnicity, as well as financial, 
                    scientific/research, and licensure), wherever it occurs.  ETT is designed to implement AAU’s harassment prevention principles and the 
                    recommendations of NASEM’s June 2018 report on sexual harassment of women in academia and to support inclusive learning and research for all talent.   
                </Text>
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
                            <Text py={"2"}>
                                A person who assists a Registered Entity's Authorized Individuals in the use of ETT.
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
                            <Text py={"2"} mb="6">
                                A person in a senior role(s) within a Registered Entity that deals with sensitive information, and who will directly view completed Disclosure Form on behalf of the Registered Entity. Each registered entity has two Authorized Individuals.
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
                            <Heading size="md">Consenting Person</Heading>
                            <Text py={"2"}>
                                A candidate for employee, post-doc, volunteer, board member, etc. at a Registered Entity, who
                                provides contact information of current/prior affiliates. 
                                Affiliates will be asked to disclose any findings of misconduct to the authorized individual(s) of the registered entity.
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
                <Heading my="4" size="md">What are the benefits of ETT?</Heading>
                <UnorderedList>
                    <ListItem>
                        Creating a healthy climate for all - reducing awards and appointments for harassers, while recognizing that a person 
                        may learn and correct past behaviors, benefiting everyone.  
                    </ListItem>
                    <ListItem>
                        Ethically treating everyone - making it easier for an entity that made a misconduct finding (the most reliable source) 
                        to share it with an entity that requests it via ETT.  Doing so with care for sensitive information and without shaming or whisper campaigns.
                    </ListItem>
                    <ListItem>
                        Minimizing legal and enterprise risk for all involved: organizations maintain independence in all policy- and decision making; candidates provide 
                        consent for disclosures; and disclosures are limited to useful but hard to dispute facts—the kind and date of a misconduct finding.
                    </ListItem>
                    <ListItem>
                        Enhancing efficiency in consenting to and requesting disclosures – a consent has a 10-year life and can be used to request and provide disclosures 
                        throughout (unless rescinded early) and ETT automates requests for disclosures and reminders.
                    </ListItem>
                    <ListItem>
                        ETT never receives disclosures–only the organizations that request them using ETT do - there is no centralized shame list or conduct record. 
                    </ListItem>
                </UnorderedList>
                <Heading my="4" size="md">How does the Ethical Transparency Tool work?</Heading>
                <Box display="flex" justifyContent="center" mt="4">
                    <Image src="/ett-diagram.png" alt="ETT Diagram" />
                </Box>
                <Heading my="4" size="md">What information is retained in the ETT?</Heading>
                <Text>
                    Organizations’ and individuals’ registration to use ETT and individuals’ consent forms are stored in ETT.  Candidate professional affiliations 
                    (their employers, appointing and honoring organizations, and societies) and organization requests for disclosures are deleted as soon as ETT sends 
                    them and two reminders. (A limited archival record of the transmission is kept behind a firewall.)  ETT is a conduit, not a records repository. 
                </Text>
            </Box>
        </>
    );
}
