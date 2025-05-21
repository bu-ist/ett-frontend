import { useEffect, useState, useContext, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Heading, Text, Spinner, Button, Card, CardBody, Alert, AlertIcon, HStack, Icon, Box, VStack } from '@chakra-ui/react';
import { HiOutlineArrowCircleDown } from "react-icons/hi";

import { lookupEntityAPI } from '../../lib/entity/lookupEntityAPI';

import { ConfigContext } from '../../lib/configContext';

import RegisterEntityStepper from './supportProRegisterPage/registerEntityStepper';
import PrivacyNoticeText from '../../components/sharedTexts/privacyNoticeText';
import PrivacyPolicyBox from '../../components/sharedTexts/privacyPolicyBox';
import RegisterEntityForm from './supportProRegisterPage/registerEntityForm';

export default function SupportProRegisterPage() {
    let [searchParams] = useSearchParams();

    const { appConfig } = useContext(ConfigContext);

    const [entityInfo, setEntityInfo] = useState({});
    const [apiState, setApiState] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [stepIndex, setStepIndex] = useState(0);

    // Create a ref so we can scroll back to the header when the privacy policy is accepted.
    const headerRef = useRef(null);

    const isUserAlreadyRegistered = (invitation, users) => {
        if (!invitation || !users) return false;
        return users.some(user => user.email === invitation.email);
    };

    // Helper function to update invitation-related state
    const updateInvitationState = (state, payload, step = null) => {
        setApiState(state);
        setEntityInfo(payload);
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

        async function lookupInvitation() {
            const code = searchParams.get('code');
            const entityId = searchParams.get('entity_id');

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

        if (searchParams.has('code'))  {
            // If there is a code, set a loading state and look up the invitation.
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

    // If there are users in the entityInfo, get the email of the user whose role is 'SYS_ADMIN'.
    // This isn't used, but could be used to let the registering person know who invited them.
    const sysadminEmail = entityInfo?.users?.find(user => user.role === 'SYS_ADMIN')?.email || '';

    return (
        <div>
            <Heading ref={headerRef} as="h2" size={"lg"} >Register Entity and Administrative Support Professional</Heading>

            <RegisterEntityStepper currentIndex={stepIndex} />

            {apiState == 'no-code' &&
                <>
                    <Alert mb="4" status="error">
                        <AlertIcon />
                        Invitation Code Missing
                    </Alert>
                    <Text>Missing invitation code or entity. Please check your email for the link to acknowledge the entity.</Text>
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
            {apiState == 'loading' &&
                <>
                    <Text>Validating invitation code...</Text>
                    <Spinner
                        thickness='4px'
                        speed='0.65s'
                        emptyColor='gray.200'
                        color='blue.500'
                        size='xl'
                    />
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
                                    You have already registered as an Administrative Support Professional for <b>{entityInfo.entity.entity_name}</b> using this email address: <b>{entityInfo.invitation.email}</b>
                                </Text>
                                <Text>
                                    Please go to the dashboard to sign in to your existing account. 
                                    If you&apos;re having trouble signing in, you can use the password reset feature on the login page.
                                </Text>
                                <Button
                                    as="a"
                                    href="/entity"
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
            {apiState == 'validated' &&
                <>
                    <Alert status='success'>
                        <AlertIcon />
                        Invitation Code Validated
                    </Alert>
                    <Card mt="4">
                        <CardBody>
                            <Text>
                                You have been invited to register as an Administrative Support Professional on behalf of 
                                {(entityInfo.entity) ? ` ${entityInfo.entity.entity_name}` : ' a new entity'}.
                            </Text>
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
                    <Button
                        mt="12"
                        size="lg"
                        colorScheme="blue"
                        onClick={acceptPrivacyPolicy}
                    >
                        Accept
                    </Button>
                </>
            }
            {apiState == 'acknowledged' &&
               <RegisterEntityForm 
                    code={searchParams.get('code')} 
                    setStepIndex={setStepIndex} 
                    entityInfo={entityInfo}
                />
            }
        </div>
    );
}