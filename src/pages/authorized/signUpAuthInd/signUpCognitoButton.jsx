import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Card, CardBody, CardFooter, Flex, FormControl, FormErrorMessage, FormHelperText, FormLabel, Input, Spacer, Spinner, Text } from "@chakra-ui/react";

export default function SignUpCognitoButton({ signUpRedirect, signUpRedirectWithAmend }) {
    const [apiState, setApiState] = useState('idle');

    // Create a ref to store the action type of the button that was clicked.
    const actionTypeRef = useRef(null);

    // Setup the digital signature form.
    const { handleSubmit, register, formState: { errors } } = useForm({
        defaultValues: {
            signature: '',
        }
    });

    async function handleSignUpClick() {
        // Get the special reference value of the button that was clicked.
        // This is so we can have two buttons for the same form that do different things, without disturbing the form validation.
        const actionType = actionTypeRef.current;

        if (actionType === 'createAccount') {
            setApiState('redirect-create');
            signUpRedirect();
        } else if (actionType === 'createAndAmend') {
            setApiState('redirect-amend');
            await signUpRedirectWithAmend();
        }
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
            <Flex>
                <Card width="40%">
                    <CardBody>
                        <Text>Click <i>Accept & Create Account</i> to accept the terms of use on behalf of the Registered Entity, and create an account with a password.</Text>
                    </CardBody>
                    <CardFooter>
                        <Button
                            my="1em"
                            type="submit"
                            onClick={() => actionTypeRef.current = 'createAccount'}
                        >
                            {apiState === 'redirect-create' && <>Redirecting <Spinner ml="2" /></>}
                            {apiState !== 'redirect-create' && 'Accept & Create Account'}
                        </Button>
                    </CardFooter>
                </Card>
                <Spacer />
                <Card width="40%">
                    <CardBody>
                        <Text color="gray.600">
                            <b>Optionally</b>, click <i>Accept & Amend</i> to accept the terms of use on behalf of the Registered Entity, 
                            create an account, and then <Text as="span" color="orange.800">amend the entity to change one or more of the participants</Text>.
                        </Text>
                    </CardBody>
                    <CardFooter>
                        <Button
                            my="1em"
                            type="submit"
                            onClick={() => actionTypeRef.current = 'createAndAmend'}
                            backgroundColor="#f2e7d3"
                            _hover={{ bg: "orange.100" }}
                        >
                            {apiState === 'redirect-amend' && <>Redirecting <Spinner ml="2" /></>}
                            {apiState !== 'redirect-amend' && 'Accept & Amend'}
                        </Button>
                    </CardFooter>
                </Card>
            </Flex>
        </form>
    );
}
