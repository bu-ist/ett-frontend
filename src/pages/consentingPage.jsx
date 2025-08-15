import { useEffect, useState, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Button, Card, CardBody, CardFooter, CardHeader, Heading, Icon, List, ListItem, Spinner, Text } from '@chakra-ui/react';
import { BsFileEarmarkLock2 } from "react-icons/bs";

import { ConfigContext } from '../lib/configContext';
import { UserContext } from '../lib/userContext';

import { exchangeAuthorizationCode } from '../lib/exchangeAuthorizationCode';
import { getConsentData } from '../lib/consenting/getConsentData';
import { signIn } from '../lib/signIn';

import ConsentDetails from "./consentingPage/consentDetails";

export default function ConsentingPage() {
    let [searchParams, setSearchParams] = useSearchParams();

    // Get the appConfig from the ConfigContext.
    const { appConfig } = useContext( ConfigContext );

    const { setUser } = useContext(UserContext);

    const [consenterInfo, setConsenterInfo] = useState({});
    const [consentData, setConsentData] = useState({});

    useEffect(() => {
        // This isn't really fully baked maybe, probably needs more consideration on how to enter the page both with and without a cognito code.
        const fetchData = async () => {

            // appConfig is initially loaded through an api call, which won't have been completed on the first render, so return early if it's not loaded yet.
            // Because appConfig is a dependency of this useEffect, fetchData will be called again when appConfig is loaded.
            if (!appConfig) {
                return;
            }

            // Check to see if this is a first time login from the cognito redirect, and if so do a signIn.
            // This workaround has to do with the state and code_verifier, which aren't part of the sign up flow.
            if ( searchParams.get('action') === 'post-signup' ) {
                // Any existing login cookies will get in the way, so clear them first.
                Cookies.remove('EttAccessJwt');
                Cookies.remove('EttIdJwt');

                const { cognitoDomain, consentingPerson: { cognitoID } } = appConfig;

                // Sign in does a window.location redirect, so execution will stop here.
                signIn( cognitoID, 'consenting', cognitoDomain );
            }

            if (searchParams.has('code') && Cookies.get('EttAccessJwt') === undefined) {
                // If this exists, then there is a sign in request, so use the code to get the tokens and store them as cookies.

                const { cognitoDomain, consentingPerson: { cognitoID } } = appConfig;

                await exchangeAuthorizationCode( cognitoDomain, cognitoID, 'consenting');
                //Once the tokens are stored, should remove the code from the URL.

                // Use setSearchParams to empty the search params once exchangeAuthorizationCode is done with them.
                setSearchParams({});
            }

            const accessToken = Cookies.get('EttAccessJwt');
            const idToken = Cookies.get('EttIdJwt');

            if (!accessToken || !idToken) {
                // If there are not login tokens, signal that there is not a login session and return early.
                setConsenterInfo({login: false});
                return;
            }

            const decodedIdToken = JSON.parse(atob(idToken.split('.')[1]));

            setConsenterInfo(decodedIdToken);

            // At this point one way or another there should be a consenterInfo object with the email.
            const consentResponse = await getConsentData( appConfig, accessToken, decodedIdToken.email);
            setConsentData(consentResponse);

            // Set the fullname and email in the user context for the header avatar.
            setUser( {fullname: consentResponse.fullName, email: consentResponse.consenter.email } );
        };

        fetchData();
    }, [appConfig]);

    return (
        <div>
            <Heading as="h2" size={"lg"} >Consenting Individual</Heading>
            <Text mt="4" mb="8">
                A person who is  (or may be in the future) a candidate under consideration by an ETT-Registered Entity for a
                <List spacing={2} ml={8} my={2}>
                    <ListItem>
                        <Text><b>Privilege or Honor</b> (e.g. elected fellow, elected or life membership; recipient of an honor or award, emeritus or endowed role; elected or appointed governance, committee, officer, or leadership role; other Privilege(s) or Honor(s) that an ETT Registered Entity identifies as affecting climate, culture or enterprise risk, e.g. volunteer roles) or</Text>
                    </ListItem>
                    <ListItem>
                        <Text><b>Employment or Role</b> (e.g., employment; employee appointment or assignment to a supervisory, evaluative, or mentoring role; other employment-related roles and decisions that an ETT Registered Entity identifies as affecting climate, culture or enterprise risk.</Text>
                    </ListItem>
                </List>
                Consenting Individuals provide consent via ETT for certain disclosures (findings not allegations) 
                to be made about the person’s conduct.  Disclosures are made by the person’s professionally 
                affiliated entities (employers, societies and membership organizations, appointing and honoring 
                organizations) directly to any ETT Registered Entit(ies) that make a disclosure request via ETT. 
                But ETT never receives any disclosures or conduct records.
            </Text>
            {consenterInfo.login === false &&
                <Card align="center">
                    <CardHeader>
                        <Heading as="h2" color="gray.500" >Not logged in</Heading>
                    </CardHeader>
                    <CardBody>
                        <Icon color="gray.500" as={BsFileEarmarkLock2} w={24} h={24} />
                    </CardBody>
                    <CardFooter>
                        <Button
                            onClick={() => signIn( appConfig.consentingPerson.cognitoID, 'consenting', appConfig.cognitoDomain )}
                        >
                            Sign in as a Consenting Person
                        </Button>
                    </CardFooter>
                </Card>
            }
            {consenterInfo && consenterInfo.email && appConfig &&
                <>
                    {JSON.stringify(consentData) != '{}' &&
                        <ConsentDetails consentData={consentData} setConsentData={setConsentData} consenterInfo={consenterInfo} />
                    }
                    {JSON.stringify(consentData) == '{}' &&
                        <Spinner
                            thickness='4px'
                            speed='0.65s'
                            emptyColor='gray.200'
                            color='blue.500'
                            size='xl'
                        />
                    }
                </>
            }
        </div>
    );
}
