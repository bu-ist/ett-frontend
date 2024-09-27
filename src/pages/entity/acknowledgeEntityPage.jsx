import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Heading, Text, Spinner } from '@chakra-ui/react';

import { lookupInvitationAPI } from '../../lib/entity/lookupInvitationAPI';

export default function AcknowledgeEntityPage() {
    let [searchParams, setSearchParams] = useSearchParams();

    const [entityInfo, setEntityInfo] = useState({});
    const [apiState, setApiState] = useState('');

    useEffect(() => {
        const lookupInvitation = async () => {
            // This is where the API call to acknowledge the entity would go.
            const code = searchParams.get('code');
            const entityId = searchParams.get('entity_id');

            const acknowledgeResult = await lookupInvitationAPI(code, entityId);

            if (acknowledgeResult.payload.ok) {
                setApiState('success');
                setEntityInfo(acknowledgeResult.payload);
            } else {
                setApiState('error');
                console.error(acknowledgeResult);
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

    return (
        <div>
            <Heading as="h2" size={"lg"} >Acknowledge Entity</Heading>
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
            {apiState == 'success' &&
                <>
                    <Text>Invitation Code Validated</Text>
                    <Text>{JSON.stringify(entityInfo)}</Text>
                </>
            }
        </div>
    );
}