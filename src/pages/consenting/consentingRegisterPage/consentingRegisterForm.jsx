import { useState, useContext } from "react";
import { useForm } from 'react-hook-form';
import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Button, FormControl, FormErrorMessage, FormLabel, Heading, Input, Spinner, Text } from "@chakra-ui/react";

import SignUpCognitoButton from '../../authorized/signUpAuthInd/signUpCognitoButton';

import { ConfigContext } from '../../../lib/configContext';

import { registerConsenterAPI } from '../../../lib/consenting/registerConsenterAPI';
import { signUp } from '../../../lib/signUp';

export default function ConsentingRegisterForm() {
    // Get the appConfig from the ConfigContext.
    const { appConfig } = useContext( ConfigContext );

    // Set the initial state of the form data using react-hook-form.
    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
      } = useForm();

    // Store the email from the form separately in a state variable, so the sign up redirect can use it.
    const [ signUpEmail, setSignUpEmail ] = useState('');

    const [apiState, setApiState] = useState('idle');
    const [apiError, setApiError] = useState(null);

    async function processRegistration(values) {
        // Setup the signUp email value for the cognito sign up redirect.
        setSignUpEmail(values.email);

        setApiState('loading');

        const response = await registerConsenterAPI( appConfig, values );
        console.log('register Response', response);

        // Use a ternary conditional to set the apiState based on the response
        setApiState(response.payload.ok ? 'success' : 'error');
        
        // Capture the error message if the response is not ok.
        setApiError(response.payload.ok ? null : response.message);
    }

    function signUpRedirect() {
        const { cognitoDomain, consentingPerson: { cognitoID } } = appConfig;
        signUp(cognitoDomain, signUpEmail, cognitoID, 'consenting?action=post-signup');
    }

    return (
        <form onSubmit={handleSubmit(processRegistration)}>
            <Heading as="h3" size="lg" mt="6" mb="4">Register</Heading>
            <Text mb="6">
                Eu velit nisi esse dolor mollit. Eiusmod ex do enim sit pariatur consectetur aute voluptate do. Elit cupidatat ex irure elit voluptate anim. Ad velit pariatur elit officia tempor qui mollit ullamco cillum fugiat proident dolor nisi in. Consectetur ipsum nostrud do ullamco adipisicing pariatur.
            </Text>
            <FormControl isInvalid={errors.firstname}>
                <FormLabel htmlFor="firstname">First Name</FormLabel>
                <Input
                    id="firstname"
                    name="firstname"
                    placeholder="First Name"
                    {...register('firstname', {
                        required: 'First name is required',
                    })}
                />
                <Box minH="1.5rem">
                    <FormErrorMessage>
                        {errors.firstname && errors.firstname.message}
                    </FormErrorMessage>
                </Box>
            </FormControl>
            <FormControl isInvalid={errors.middlename}>
                <FormLabel>Middle Name</FormLabel>
                <Input
                    id="middlename"
                    name="middlename"
                    placeholder="Middle Name"
                    {...register('middlename', {
                        required: false,
                    })}
                />
                <Box minH="1.5rem"></Box>
            </FormControl>
            <FormControl isInvalid={errors.lastname}>
                <FormLabel>Last Name</FormLabel>
                <Input
                    id="lastname"
                    name="lastname"
                    placeholder="Last Name"
                    {...register('lastname', {
                        required: 'Last Name is required',
                    })}
                />
                <Box minH="1.5rem">
                    <FormErrorMessage>
                        {errors.lastname && errors.lastname.message}
                    </FormErrorMessage>
                </Box>
            </FormControl>
            <FormControl isInvalid={errors.email}>
                <FormLabel>Email</FormLabel>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email"
                    {...register('email', {
                        required: 'Email is required',
                        pattern: {
                            value: /\S+@\S+\.\S+/,
                            message: 'Entered value does not match email format',
                        },
                    })}
                />
                <Box minH="1.5rem">
                    <FormErrorMessage>
                        {errors.email && errors.email.message}
                    </FormErrorMessage>
                </Box>
            </FormControl>
            <Button my="4" type="submit" isDisabled={apiState !== 'idle'}>
                { apiState === 'loading' && <Spinner /> }
                { apiState === 'idle' && 'Register' }
                { apiState === 'success' && 'Registered' }
                { apiState === 'error' && 'Error' }
            </Button>

            {apiState === 'error' &&
                <Box mt="4">
                    <Alert status="error">
                        <AlertIcon />
                        <AlertTitle>Error registering: </AlertTitle>
                        <AlertDescription>{apiError}</AlertDescription>
                    </Alert>
                </Box>
            }

            {apiState === 'success' &&
                <SignUpCognitoButton signUpRedirect={signUpRedirect} />
            }

        </form>
    );
}
