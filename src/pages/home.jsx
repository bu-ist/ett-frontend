import { useContext } from "react";
import { Link as ReactRouterLink, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Box, Button, Card, CardBody, CardFooter, Heading, Image, ListItem, SimpleGrid, Stack, Text, UnorderedList } from "@chakra-ui/react";

import { ConfigContext } from "../lib/configContext";

import { signIn } from '../lib/signIn';
import { getRoleForScope } from '../lib/getRoleForScope';

export default function Home() {

    const { appConfig } = useContext(ConfigContext);

    // Mapping for friendlier form labels
    const formLabelMap = {
        "registration-form-entity": "Entity Registration Form",
        "registration-form-individual": "Individual Registration Form",
        "consent-form": "Individual Consent Form",
        "exhibit-form-current-full": "Exhibit Form (All Affiliates - Full)",
        "exhibit-form-current-single": "Exhibit Form (All Affiliates, Single Entity for Each Affiliate)",
        "exhibit-form-other-full": "Exhibit Form (All Affiliates Other Than Current Employer(s) and Appointing Entit(ies) — Full)",
        "exhibit-form-other-single": "Exhibit Form (All Affiliates Other Than Current Employer(s) and Appointing Entit(ies), Single Entity for Each Affiliate)",
        "exhibit-form-both-full": "Exhibit Form (Current Employer(s) and Appointing Entit(ies) - Full)",
        "exhibit-form-both-single": "Exhibit Form (Current Employer(s) and Appointing Entit(ies) - Single Entity for Each Affiliate)",
        "disclosure-form": "Disclosure Form"
    };

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
                    transparency about findings (not allegations) of individuals’ misconduct (sexual/gender and race/ethnicity, as well as financial, 
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
                    <Image src="/ett-explanation-diagram.png" alt="ETT Diagram" />
                </Box>
                <Heading my="4" size="md">What information is retained in the ETT?</Heading>
                <Text>
                    Organizations’ and individuals’ registration to use ETT and individuals’ consent forms are stored in ETT.  Candidate professional affiliations 
                    (their employers, appointing and honoring organizations, and societies with contact information) and organization requests for disclosures are deleted 
                    as soon as ETT sends the requests
                    and two reminders. (A limited archival record of the transmission is kept behind a firewall.)  ETT is a conduit, not a records repository. 
                </Text>
                {/* Conditionally render the blank forms section only if appConfig and publicBlankFormURIs are available */}
                {appConfig?.publicBlankFormURIs && (
                  <Box my="8">
                      <Heading size="md" mb="2">Download Blank Example Forms</Heading>
                      <UnorderedList>
                          {appConfig.publicBlankFormURIs.reduce((items, uri) => {
                              const key = uri.split('/').pop();
                              const label = formLabelMap[key] || key.replace(/-/g, ' ').replace('.pdf', '');
                              
                              // If this is a "single" variant, skip it as we'll handle it with its parent
                              if (key.includes('-single')) {
                                  return items;
                              }

                              // Only look for single variants for exhibit forms with -full suffix
                              const singleVariantUri = key.includes('exhibit-form-') && key.includes('-full')
                                  ? appConfig.publicBlankFormURIs.find(u => 
                                      u.split('/').pop() === key.replace('-full', '-single')
                                    )
                                  : null;

                              items.push(
                                  <ListItem key={uri}>
                                      <a href={uri} target="_blank" rel="noopener noreferrer">
                                          {label}
                                      </a>
                                      {singleVariantUri && (
                                          <UnorderedList ml={4} mt={1}>
                                              <ListItem key={singleVariantUri}>
                                                  <a href={singleVariantUri} target="_blank" rel="noopener noreferrer">
                                                      {formLabelMap[singleVariantUri.split('/').pop()]}
                                                  </a>
                                              </ListItem>
                                          </UnorderedList>
                                      )}
                                  </ListItem>
                              );
                              return items;
                          }, [])}
                      </UnorderedList>
                  </Box>
                )}
            </Box>
        </>
    );
}
