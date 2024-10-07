import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Heading, Text, Spinner, Box, Checkbox, Button } from "@chakra-ui/react";

import { lookupInvitationAPI } from '../../lib/entity/lookupInvitationAPI';
import { acknowledgeEntityAPI } from '../../lib/entity/acknowledgeEntityAPI';
import { lookupEntityAPI } from '../../lib/entity/lookupEntityAPI';

import SignUpAuthIndStepper from './signUpAuthInd/signUpAuthIndStepper';
import SignUpAuthIndForm from "./signUpAuthInd/signUpAuthIndForm";

export default function SignUpAuthIndPage() {
    let [searchParams, setSearchParams] = useSearchParams();

    const [inviteInfo, setInviteInfo] = useState({});
    const [entityInfo, setEntityInfo] = useState({});

    const [apiState, setApiState] = useState('');
    const [privacyPolicyAccepted, setPrivacyPolicyAccepted] = useState(false);


    const [stepIndex, setStepIndex] = useState(0);


    useEffect(() => {
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

        if (searchParams.has('code') && searchParams.has('entity_id')) {
            // If there are both a code and an entity ID, call the acknowledgeEntity function.
            // First, set the API state to loading.
            setApiState('loading');
            lookupInvitation();
        } else {
            // If there is no code, display an error message.
            setApiState('no-code');
        }
    }, []);

    async function acknowledgeEntity() {
        const code = searchParams.get('code');

        const acknowledgeResult = await acknowledgeEntityAPI(code);

        if (acknowledgeResult.payload.ok) {

            console.log('acknowlege result:', acknowledgeResult);

            // Look up the entity information.
            const entityId = inviteInfo.entity_id;
            const entityResult = await lookupEntityAPI(code);

            //console.log('entityResult: ', entityResult);

            if (entityResult.payload.ok) {
                setEntityInfo(entityResult.payload);
                setApiState('acknowledged');
                setStepIndex(2);
            }

        } else {
            setApiState('error');
            console.error(acknowledgeResult);
        }
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
                        onClick={acknowledgeEntity}
                    >
                        Accept
                    </Button>
                </>
            }
            {apiState == 'acknowledged' &&
               <SignUpAuthIndForm entityInfo={entityInfo} />
            }

        </>
    );
}