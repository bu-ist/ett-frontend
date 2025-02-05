import { useState} from 'react';
import { useForm } from 'react-hook-form';
import { Button, FormControl, FormErrorMessage, FormHelperText, FormLabel, Input, Spinner, Text } from "@chakra-ui/react";

export default function SignUpCognitoButton({ signUpRedirect}) {
    const [apiState, setApiState] = useState('idle');

    // Setup the digital signature form.
    const { handleSubmit, register, formState: { errors } } = useForm({
        defaultValues: {
            signature: '',
        }
    });

    function handleSignUpClick() {
        setApiState('loading');
        signUpRedirect();
    }

    return (
        <form onSubmit={handleSubmit(handleSignUpClick)}>
            <FormControl mb="4" isInvalid={errors.signature}>
                <FormLabel>Your Signature on behalf of the Registered Entity</FormLabel>
                <Input
                    id="signature"
                    name="signature"
                    placeholder="Signature"
                    {...register('signature', {
                        required: 'Signature is required',
                    })}
                />
                {!errors.signature ? (
                    <FormHelperText>Type your name here as your digital signature, agreeing to the terms and affirming your authority to do so.</FormHelperText>
                ) : (
                    <FormErrorMessage>{errors.signature.message}</FormErrorMessage>
                )}
            </FormControl>
            <Text>Click <i>Accept and Create Account</i> to accept the terms of use on behalf of the Registered Entity, and create an account with a password.</Text>
            <Button
                my="1em"
                type="submit"
            >
                {apiState === 'loading' && <>Redirecting <Spinner ml="2" /></>}
                {apiState !== 'loading' && 'Accept and Create Account'}
            </Button>
        </form>
    );
}
