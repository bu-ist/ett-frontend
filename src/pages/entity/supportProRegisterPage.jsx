import { useEffect, useState, useContext, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Heading, Text, Spinner, Button, Card, CardBody, Alert, AlertIcon, HStack, Icon, Box } from '@chakra-ui/react';
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

    const [stepIndex, setStepIndex] = useState(0);

    // Create a ref so we can scroll back to the header when the privacy policy is accepted.
    const headerRef = useRef(null);

    useEffect(() => {
        // Check if appConfig is loaded.
        if (!appConfig) {
            setApiState('loading');
            return;
        }

        async function lookupInvitation() {
            // This is where the API call to acknowledge the entity would go.
            const code = searchParams.get('code');
            const entityId = searchParams.get('entity_id'); // ???

            const lookupResult = await lookupEntityAPI(appConfig, code);

            if (lookupResult.payload.ok) {
                setApiState('validated');
                setEntityInfo(lookupResult.payload);
                setStepIndex(1);
            } else if (lookupResult.payload.unauthorized) {
                setApiState('unauthorized');
                //console.error(lookupResult);
            } else {
                setApiState('error');
                console.error(lookupResult);
            }

        }

        if (searchParams.has('code') )  {
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
                <Text>There was an error acknowledging the entity. Please try again.</Text>
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
               <RegisterEntityForm code={searchParams.get('code')} setStepIndex={setStepIndex} />
            }
        </div>
    );
}