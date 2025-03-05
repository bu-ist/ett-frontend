import { useEffect, useState, useContext, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Heading, Text, Spinner, Box, Checkbox, Button, Fade, VStack, Alert, AlertIcon, CardBody, Card, HStack, Icon } from "@chakra-ui/react";
import { HiOutlineArrowCircleDown } from "react-icons/hi";

import { lookupEntityAPI } from '../../lib/entity/lookupEntityAPI';

import { ConfigContext } from '../../lib/configContext';
import { signUp } from '../../lib/signUp';

import SignUpAuthIndStepper from './signUpAuthInd/signUpAuthIndStepper';
import SignUpAuthIndForm from './signUpAuthInd/signUpAuthIndForm';
import PrivacyNoticeText from "../../components/sharedTexts/privacyNoticeText";
import PrivacyPolicyBox from "../../components/sharedTexts/privacyPolicyBox";
import RegisterStatementText from "../../components/sharedTexts/registerStatementText";
import EntityInfoCard from "./signUpAuthInd/entityInfoCard";
import TermsOfUseBox from '../../components/sharedTexts/termsOfUseBox';
import SignUpCognitoButton from "./signUpAuthInd/signUpCognitoButton";

// This may have some weakness around ensuring the appConfig is loaded before this component is rendered.

export default function SignUpAuthIndPage() {
    let [searchParams, setSearchParams] = useSearchParams();

    // Get the appConfig from the ConfigContext.
    const { appConfig } = useContext( ConfigContext );

    const [inviteInfo, setInviteInfo] = useState({});
    const [entityInfo, setEntityInfo] = useState({});

    const [apiState, setApiState] = useState('');
    const [privacyPolicyAccepted, setPrivacyPolicyAccepted] = useState(false);

    // Create a ref so we can scroll back to the header when the privacy policy is accepted.
    const headerRef = useRef(null);

    const [stepIndex, setStepIndex] = useState(0);

    // Store the email from the form separately in a state variable, so the sign up redirect can use it.
    const [ signUpEmail, setSignUpEmail ] = useState('');


    useEffect(() => {
        // Check if appConfig is loaded.
        if (!appConfig) {
            setApiState('loading');
            return;
        }
        
        // Declare an async function to look up the invitation.
        // This only gets called if there is a code and an entity ID in the URL.
        async function lookupInvitation() {
            // Get the code and the entity from the request parameters.
            const code = searchParams.get('code');
            const entityId = searchParams.get('entity_id');
    
            // Call the lookupInvitationAPI function with the code and entity ID.
            try {
                const lookupResult = await lookupEntityAPI(appConfig, code);
                console.log('lookupResult: ', lookupResult);
    
                if (lookupResult.payload.ok) {
                    setApiState('validated');
                    setInviteInfo(lookupResult.payload);
                    setStepIndex(1);
                } else if (lookupResult.payload.unauthorized) {
                    setApiState('unauthorized');
                    console.error('Unauthorized access: ', lookupResult);
                } else {
                    setApiState('error');
                    console.error('Error during lookup: ', lookupResult);
                }
            } catch (error) {
                setApiState('error');
                console.error('Error during API call: ', error);
            }
        }
    
        // If there are both a code and an entity ID, call the lookupInvitation function.
        if (searchParams.has('code') && searchParams.has('entity_id')) {
            // First, set the API state to loading.
            setApiState('loading');
            lookupInvitation();
        } else {
            // If there is no code, display an error message.
            setApiState('no-code');
        }
    }, [appConfig, searchParams]);


    function acceptPrivacyPolicy() {
        setApiState('acknowledged');
        setStepIndex(2);

        // Scroll to the top of the form, so we can see the stepper advance.
        headerRef.current.scrollIntoView();
    }

    // Advances the page state overall to 'registered'.
    function setRegistered() {
        setApiState('registered');
        setStepIndex(3);
        headerRef.current.scrollIntoView();
    }

    function signUpRedirect() {
        const { cognitoDomain, authorizedIndividual: { cognitoID } } = appConfig;
        signUp( cognitoDomain, signUpEmail, cognitoID, 'auth-ind?action=post-signup');
    }

    return (
        <>
            <Heading ref={headerRef} as="h2" size={"xl"}>Entity Registration by Authorized Individual</Heading>
            <SignUpAuthIndStepper currentIndex={stepIndex} />
            
            {apiState === 'no-code' &&
                <Text>Error: No code provided. Try again with a valid sign up link</Text>
            }
            {apiState == 'loading' &&
                <Box>
                    <Text>Validating invitation code...</Text>
                    <Spinner
                        thickness='4px'
                        speed='0.65s'
                        emptyColor='gray.200'
                        color='blue.500'
                        size='xl'
                    />
                </Box>
            }
            {apiState == 'error' &&
                <Text>Error: There was an error validating the invitation code. Please try again.</Text>
            }
            {apiState == 'unauthorized' &&
                <>
                    <Alert mb="4" status="error">
                        <AlertIcon />
                        Invitation Code Invalid
                    </Alert>
                    <Text>Code not accepted, check that the emailed link is intact. Or the invitation could have expired or been rescinded.</Text>
                </>
            }
            {apiState == 'validated' &&
                <>
                    <VStack>
                        <Alert status='success'>
                            <AlertIcon />
                            Invitation Code Validated
                        </Alert>
                    </VStack>
                     <Card mt="4">
                        <CardBody>
                            <Text>You have been invited to register as an Authorized Individual on behalf of <b>{inviteInfo.entity.entity_name}</b>.</Text>
                        </CardBody>
                     </Card>
                     <HStack mt="4">
                        <Icon as={HiOutlineArrowCircleDown} color="gray.400" boxSize="12" />
                        <Box>
                            <Text>
                                Registering your organization to use ETT requires that in your official and personal capacities you have read and agree to the 
                                ETT Privacy Notice and Privacy Policy.
                            </Text>
                            <Text>
                                <span style={{fontWeight: "500"}}> Scroll to the bottom</span> of the page to accept the Privacy Notice and Privacy Policy, and continue.
                            </Text>
                        </Box>
                    </HStack>
                    <PrivacyNoticeText />
                    <PrivacyPolicyBox />
                    <Button mt="12" mb="6" onClick={acceptPrivacyPolicy}>
                        Accept
                    </Button>
                </>
            }
            {
                // Leaving this validated-with-checkbox here for now, but at the moment the new component doesn't have a checkbox,
                // so this state is not being used.
            }
            {apiState == 'validated-with-checkbox' &&
                <>
                    <Text>Invitation Code Validated for {inviteInfo.entity_name}</Text>
                    <Text>Privacy Policy</Text>
                    <Box>
                        <Checkbox
                            value={privacyPolicyAccepted}
                            onChange={(e) => setPrivacyPolicyAccepted(e.target.checked)}
                        >
                            Accept Privacy Policy
                        </Checkbox>
                    </Box>
                    <Button
                        isDisabled={!privacyPolicyAccepted}
                        onClick={acceptPrivacyPolicy}
                    >
                        Accept
                    </Button>
                </>
            }
            {apiState == 'acknowledged' &&
                <Fade in={apiState == 'acknowledged'}>
                    <EntityInfoCard inviteInfo={inviteInfo} />
                    <SignUpAuthIndForm 
                        inviteInfo={inviteInfo} 
                        setRegistered={setRegistered}
                        setSignUpEmail={setSignUpEmail}
                        code={searchParams.get('code')} 
                    />
                </Fade>
            }
            {apiState === 'registered' &&
                <Fade in={apiState === 'registered'}>
                    <Alert status='success'>
                        <AlertIcon />
                        Registration Successful
                    </Alert>
                    <Heading mt="6" as="h3" size="lg">Accept Terms of Use and Create Account</Heading>
                    <Text my="4">
                       Before creating an account, you must accept the terms of use on behalf of the Registered Entity, <b>{inviteInfo.entity.entity_name}</b>.
                    </Text>
                    <RegisterStatementText />
                    <TermsOfUseBox />
                    <SignUpCognitoButton signUpRedirect={signUpRedirect} />
                </Fade>
            }
        </>
    );
}
