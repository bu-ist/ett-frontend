import { useState } from 'react';
import { Heading, Text, Box, Checkbox, Button } from "@chakra-ui/react";

import ConsentingRegisterForm from './consentingRegisterPage/consentingRegisterForm';

export default function ConsentingRegisterPage() {
    const [apiState, setApiState ] = useState('idle');
    const [privacyPolicyAccepted, setPrivacyPolicyAccepted] = useState(false);

    return (
        <>
            <Heading as="h2" size="xl">Sign Up Consenting Person</Heading>
            {apiState === 'idle'  &&
                <>
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
                        onClick={() => setApiState('accepted')}
                    >
                        Accept
                    </Button>
                </>
            }
            {apiState === 'accepted' &&
                <ConsentingRegisterForm />
            }
        </>
    );
}