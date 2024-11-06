import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Heading, Text, Spinner, Button, Checkbox, Box, Card, CardBody } from '@chakra-ui/react';

import { lookupInvitationAPI } from '../../lib/entity/lookupInvitationAPI';
import { acknowledgeEntityAPI } from '../../lib/entity/acknowledgeEntityAPI';

import RegisterEntityStepper from "./acknowledgeEntity/registerEntityStepper";
import EntityPrivacyPolicy from './acknowledgeEntity/entityPrivacyPolicy';
import RegisterEntityForm from './acknowledgeEntity/registerEntityForm';

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
                    <Card>
                        <CardBody>
                            <Text>Invitation Code Validated</Text>
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
                        onClick={acknowledgeEntity}
                    >
                        Acknowledge Entity
                    </Button>
                </>
            }
            {apiState == 'acknowledged' &&
               <RegisterEntityForm code={searchParams.get('code')} setStepIndex={setStepIndex} />
            }
        </div>
    );
}