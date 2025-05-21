import { useEffect, useState, useContext, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Heading, Text, Spinner, Box, Checkbox, Button, Fade, VStack, Alert, AlertIcon, CardBody, Card, HStack, Icon } from "@chakra-ui/react";
import { HiOutlineArrowCircleDown } from "react-icons/hi";

import { lookupEntityAPI } from '../../lib/entity/lookupEntityAPI';
import { registerEntityAPI } from '../../lib/entity/registerEntityAPI';

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

    const [apiState, setApiState] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [privacyPolicyAccepted, setPrivacyPolicyAccepted] = useState(false);

    // Create a ref so we can scroll back to the header when the privacy policy is accepted.
    const headerRef = useRef(null);

    const [stepIndex, setStepIndex] = useState(0);

    // Store the email from the form separately in a state variable, so the sign up redirect can use it.
    const [ signUpEmail, setSignUpEmail ] = useState('');

    // Actually store all the form data in a state variable here so that the sign up component can use it.
    const [ registrationData, setRegistrationData ] = useState({});

    const isUserAlreadyRegistered = (invitation, users) => {
        if (!invitation || !users) return false;
        return users.some(user => user.email === invitation.email);
    };

    // Helper function to update invitation-related state
    const updateInvitationState = (state, payload, step = null) => {
        setApiState(state);
        setInviteInfo(payload);
        if (step !== null) {
            setStepIndex(step);
        }
    };

    // Helper function to handle API errors
    function handleApiError(result, message) {
        console.error(message, result);
        setApiState('error');
        // Extract error message from the API response or use the default message
        const apiErrorMessage = result?.payload?.message || result?.message || message || 'An unexpected error occurred';
        setErrorMessage(apiErrorMessage);
    };

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
    
            // Call the lookupEntityAPI function with the code and entity ID.
            try {
                const lookupResult = await lookupEntityAPI(appConfig, code);
                console.log('lookupResult: ', lookupResult);
    
                // Handle unauthorized case first
                if (lookupResult.payload.unauthorized) {
                    // If the user is unauthorized, set the state to 'unauthorized' and return early.
                    updateInvitationState('unauthorized', lookupResult.payload);
                    return;
                }

                // Handle unsuccessful responses
                if (!lookupResult.payload.ok) {
                    handleApiError(lookupResult, 'Error during lookup');
                    return;
                }

                // Handle successful lookup
                if (isUserAlreadyRegistered(lookupResult.payload.invitation, lookupResult.payload.users)) {
                    updateInvitationState('already-registered', lookupResult.payload);
                } else {
                    updateInvitationState('validated', lookupResult.payload, 1);
                }
            } catch (error) {
                handleApiError(error, 'Error during API call');
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
        signUp( cognitoDomain, signUpEmail.toLowerCase(), cognitoID, 'auth-ind?action=post-signup');
    }

    async function signUpRedirectWithAmend() {
        // If we are making an amendment, we need to register a second time with an extra 'signup_parameter=amend' in the registration URL data.
        // This is to signal the backend that the registration is not complete, and it should not send a completed registration email.
        // Also the signature field is not used in the API call, so create a new object without the signature property
        const { signature, ...valuesWithoutSignature } = registrationData;
        const newRegistrationData = { ...valuesWithoutSignature , signup_parameter: 'amend' };

        // send the registration data to the backend. should add error checking here.
        const registerResult = await registerEntityAPI(appConfig, searchParams.get('code'), newRegistrationData);

        console.log('registerResult: ', registerResult);

        // If the registration was successful, redirect to the sign up page.
        const { cognitoDomain, authorizedIndividual: { cognitoID } } = appConfig;        
        signUp( cognitoDomain, signUpEmail.toLowerCase(), cognitoID, 'auth-ind/amend?action=post-signup');
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
                <>
                    <Alert mb="4" status="error">
                        <AlertIcon />
                        Error
                    </Alert>
                    <Card mt="4">
                        <CardBody>
                            <Text>{errorMessage || 'There was an error validating the invitation code. Please try again.'}</Text>
                        </CardBody>
                    </Card>
                </>
            }
            {apiState == 'already-registered' &&
                <>
                    <Alert mb="4" status="info">
                        <AlertIcon />
                        Already Registered
                    </Alert>
                    <Card mt="4">
                        <CardBody>
                            <VStack align="start" spacing={4}>
                                <Text>
                                    You have already registered as an Authorized Individual for <b>{inviteInfo.entity.entity_name}</b> using this email address: <b>{inviteInfo.invitation.email}</b>
                                </Text>
                                <Text>
                                    Please use go to the dashboard to sign in to your existing account. 
                                    If you&apos;re having trouble signing in, you can use the password reset feature on the login page.
                                </Text>
                                <Button
                                    as="a"
                                    href="/auth-ind"
                                    colorScheme="blue"
                                    size="lg"
                                >
                                    Go to Dashboard
                                </Button>
                            </VStack>
                        </CardBody>
                    </Card>
                </>
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
                        <Icon as={HiOutlineArrowCircleDown} color="blue.600" boxSize="36" />
                        <Box>
                            <Text>
                                Registering your organization to use ETT requires that in your official and personal capacities you have read and agree to the ETT Privacy Notice and Privacy Policy.
                            </Text>
                            <Text fontSize="2xl" fontWeight="black" color="blue.800">
                                Scroll to the bottom of the page to accept the Privacy Notice and Privacy Policy, and continue.
                            </Text>
                        </Box>
                    </HStack>
                    <PrivacyNoticeText />
                    <PrivacyPolicyBox />
                    <Button mt="12" size="lg" mb="6" colorScheme="blue" onClick={acceptPrivacyPolicy}>
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
                        setRegistrationData={setRegistrationData}
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
                    <SignUpCognitoButton signUpRedirect={signUpRedirect} signUpRedirectWithAmend={signUpRedirectWithAmend} />
                </Fade>
            }
        </>
    );
}
