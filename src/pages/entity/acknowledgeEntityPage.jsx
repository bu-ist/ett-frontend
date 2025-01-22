import { useEffect, useState, useContext, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Heading, Text, Spinner, Button, Checkbox, Box, Card, CardBody, VStack, Alert, AlertIcon, Code } from '@chakra-ui/react';

import { lookupEntityAPI } from '../../lib/entity/lookupEntityAPI';

import { ConfigContext } from '../../lib/configContext';

import RegisterEntityStepper from "./acknowledgeEntity/registerEntityStepper";
import EntityPrivacyPolicy from './acknowledgeEntity/entityPrivacyPolicy';
import RegisterEntityForm from './acknowledgeEntity/registerEntityForm';

export default function AcknowledgeEntityPage() {
    let [searchParams, setSearchParams] = useSearchParams();

    const { appConfig } = useContext(ConfigContext);

    const [entityInfo, setEntityInfo] = useState({});
    const [apiState, setApiState] = useState('');
    const [privacyPolicyAccepted, setPrivacyPolicyAccepted] = useState(false);

    const [stepIndex, setStepIndex] = useState(0);

    // Create a ref so we can scroll back to the header when the privacy policy is accepted.
    const headerRef = useRef(null);

    useEffect(() => {
        // Validation of the invite code was taken out, but might be put back in later.

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
    const sysadminEmail = entityInfo?.users?.find(user => user.role === 'SYS_ADMIN')?.email || '';

    return (
        <div>
            <Heading ref={headerRef} as="h2" size={"lg"} >Register Entity</Heading>

            <RegisterEntityStepper currentIndex={stepIndex} />

            {apiState == 'no-code' &&
                <Text>Missing invitation code or entity. Please check your email for the link to acknowledge the entity.</Text>
            }
            {apiState == 'unauthorized' &&
                <Text>Code not accepted, check that the emailed link is intact. Or the invitation could have expired or been rescinded.</Text>
            }
            {apiState == 'error' &&
                <Text>There was an error acknowledging the entity. Please try again.</Text>
            }
            {apiState == 'loading' &&
                <Spinner
                    thickness='4px'
                    speed='0.65s'
                    emptyColor='gray.200'
                    color='blue.500'
                    size='xl'
                />
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
                            <Text>
                                You have been invited by <Code>{sysadminEmail}</Code> to register as an Administrative Support Professional on behalf of 
                                {(entityInfo.entity) ? ` ${entityInfo.entity_name}` : ' a new entity'}.
                            </Text>
                        </CardBody>
                    </Card>
                    <Text mt="6">
                        Nisi occaecat Lorem velit reprehenderit magna ea anim sint ut excepteur nostrud laborum excepteur. Quis labore quis eu mollit. Cillum anim ex elit ut eu eiusmod est adipisicing minim irure. Voluptate velit veniam elit id cupidatat officia culpa velit amet irure commodo duis. Elit veniam eu ipsum et amet qui cillum elit elit occaecat. Id est enim ut eiusmod qui velit ipsum consectetur enim.
                    </Text>
                    <EntityPrivacyPolicy accepted={privacyPolicyAccepted} />
                    <Box mt="4">
                        <Checkbox
                        size={"lg"}
                        my="4"
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
               <RegisterEntityForm code={searchParams.get('code')} setStepIndex={setStepIndex} />
            }
        </div>
    );
}