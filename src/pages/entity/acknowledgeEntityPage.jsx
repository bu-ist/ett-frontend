import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Heading, Text, Spinner, Button, Checkbox, Box } from '@chakra-ui/react';

import { lookupInvitationAPI } from '../../lib/entity/lookupInvitationAPI';
import { acknowledgeEntityAPI } from '../../lib/entity/acknowledgeEntityAPI';

import RegisterEntityStepper from "./acknowledgeEntity/registerEntityStepper";

export default function AcknowledgeEntityPage() {
    let [searchParams, setSearchParams] = useSearchParams();

    const [entityInfo, setEntityInfo] = useState({});
    const [apiState, setApiState] = useState('');
    const [privacyPolicyAccepted, setPrivacyPolicyAccepted] = useState(false);

    const [stepIndex, setStepIndex] = useState(0);


    useEffect(() => {
        const lookupInvitation = async () => {
            // This is where the API call to acknowledge the entity would go.
            const code = searchParams.get('code');
            const entityId = searchParams.get('entity_id');

            const lookupResult = await lookupInvitationAPI(code, entityId);

            if (lookupResult.payload.ok) {
                setApiState('validated');
                setEntityInfo(lookupResult.payload);
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
            setApiState('acknowledged');
            setStepIndex(2);
            console.log(acknowledgeResult);
        } else {
            setApiState('error');
            console.error(acknowledgeResult);
        }
    }

    return (
        <div>
            <Heading as="h2" size={"lg"} >Acknowledge Entity</Heading>

            <RegisterEntityStepper currentIndex={stepIndex} />

            {apiState == 'no-code' &&
                <Text>Missing invitation code or entity. Please check your email for the link to acknowledge the entity.</Text>
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
                    <Text>Invitation Code Validated for {entityInfo.entity_name}</Text>
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
                        Acknowledge Entity: {entityInfo.entity_name}
                    </Button>
                </>
            }
            {apiState == 'acknowledged' &&
                <Text>Entity Acknowledged</Text>
            }
        </div>
    );
}