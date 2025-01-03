import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Heading, Text, Spinner, Box, Checkbox, Button, Fade, VStack, Alert, AlertIcon } from "@chakra-ui/react";

// Unused now, but might return in the future.
//import { lookupInvitationAPI } from '../../lib/entity/lookupInvitationAPI';
//import { lookupEntityAPI } from '../../lib/entity/lookupEntityAPI';

import SignUpAuthIndStepper from './signUpAuthInd/signUpAuthIndStepper';
import SignUpAuthIndForm from './signUpAuthInd/signUpAuthIndForm';
import AcknowledgePrivacy from './signUpAuthInd/acknowledgePrivacy';

export default function SignUpAuthIndPage() {
    let [searchParams, setSearchParams] = useSearchParams();

    const [inviteInfo, setInviteInfo] = useState({});
    const [entityInfo, setEntityInfo] = useState({});

    const [apiState, setApiState] = useState('');
    const [privacyPolicyAccepted, setPrivacyPolicyAccepted] = useState(false);


    const [stepIndex, setStepIndex] = useState(0);


    useEffect(() => {
        // Invitation lookup is being disabled because the endpoint was removed, but we may want to re-enable it later.
        /*
        async function lookupInvitation() {
           // Get the code and the entity from the request parameters.
            const code = searchParams.get('code');
            const entityId = searchParams.get('entity_id');

            // Call the lookupInvitationAPI function with the code and entity ID.
            const lookupResult = await lookupInvitationAPI(code, entityId);

            console.log( 'lookupResult: ', lookupResult);

            if (lookupResult.payload.ok) {
                setApiState('validated');
                setInviteInfo(lookupResult.payload);
                setStepIndex(1);
            } else {
                setApiState('error');
                console.error(lookupResult);
            }

        }
        */

        if (searchParams.has('code') && searchParams.has('entity_id')) {
            // If there are both a code and an entity ID, call the acknowledgeEntity function.
            // First, set the API state to loading.
            setApiState('loading');
            
            // We may start using an invitation lookup function again in the future, so this is here but commented out.
            //lookupInvitation();

            // This is a temporary workaround to skip the lookupInvitation function.
            setApiState('validated');
            setStepIndex(1);

        } else {
            // If there is no code, display an error message.
            setApiState('no-code');
        }
    }, []);


    function acceptPrivacyPolicy() {
        setApiState('acknowledged');
        setStepIndex(2);
    }

    return (
        <>
            <Heading as="h2" size={"xl"}>Sign Up Authorized Individual</Heading>
            <SignUpAuthIndStepper currentIndex={stepIndex} />
            
            {apiState === 'no-code' &&
                <Text>Error: No code provided. Try again with a valid sign up link</Text>
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
            {apiState == 'error' &&
                <Text>Error: There was an error acknowledging the entity. Please try again.</Text>
            }
            {apiState == 'validated' &&
                <>
                    <VStack>
                        <Alert status='success'>
                            <AlertIcon />
                            Invitation Code Validated
                        </Alert>
                    </VStack>
                    <Text mt="6">
                        Nisi occaecat Lorem velit reprehenderit magna ea anim sint ut excepteur nostrud laborum excepteur. Quis labore quis eu mollit. Cillum anim ex elit ut eu eiusmod est adipisicing minim irure. Voluptate velit veniam elit id cupidatat officia culpa velit amet irure commodo duis. Elit veniam eu ipsum et amet qui cillum elit elit occaecat. Id est enim ut eiusmod qui velit ipsum consectetur enim.
                    </Text>
                    <AcknowledgePrivacy acceptPrivacyPolicy={acceptPrivacyPolicy}  />
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
                    <SignUpAuthIndForm entityInfo={entityInfo} setStepIndex={setStepIndex} code={searchParams.get('code')} />
                </Fade>
            }

        </>
    );
}