import { useEffect, useState, useContext, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Heading, Text, Spinner, Box, Checkbox, Button, Fade, VStack, Alert, AlertIcon } from "@chakra-ui/react";

import { lookupEntityAPI } from '../../lib/entity/lookupEntityAPI';

import { ConfigContext } from '../../lib/configContext';

import SignUpAuthIndStepper from './signUpAuthInd/signUpAuthIndStepper';
import SignUpAuthIndForm from './signUpAuthInd/signUpAuthIndForm';
import AcknowledgePrivacy from './signUpAuthInd/acknowledgePrivacy';
import EntityInfoCard from "./signUpAuthInd/entityInfoCard";


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

    return (
        <>
            <Heading ref={headerRef} as="h2" size={"xl"}>Register Authorized Individual</Heading>
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
                <Text>Code not accepted, check that the emailed link is intact. Or the invitation could have expired or been rescinded.</Text>
            }
            {apiState == 'validated' &&
                <>
                    <VStack>
                        <Alert status='success'>
                            <AlertIcon />
                            Invitation Code Validated
                        </Alert>
                    </VStack>
                    <EntityInfoCard inviteInfo={inviteInfo} />
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
                    <EntityInfoCard inviteInfo={inviteInfo} />
                    <SignUpAuthIndForm inviteInfo={inviteInfo} setStepIndex={setStepIndex} code={searchParams.get('code')} />
                </Fade>
            }

        </>
    );
}