import { useState} from 'react';
import { Button, Heading, Spinner, Text } from "@chakra-ui/react";

export default function SignUpCognitoButton({ signUpRedirect}) {
    const [apiState, setApiState] = useState('idle');

    function handleSignUpClick() {
        setApiState('loading');
        signUpRedirect();
    }

    return (
        <>
            <Heading as="h4" size={"sm"} >Registration successful</Heading>
            <Text>Click Sign Up to create a password and complete registration.</Text>
            <Button
                my="1em"
                onClick={handleSignUpClick}
            >
                {apiState === 'loading' && <>Redirecting <Spinner /></>}
                {apiState !== 'loading' && 'Sign Up'}
            </Button>
        </>
    );
}