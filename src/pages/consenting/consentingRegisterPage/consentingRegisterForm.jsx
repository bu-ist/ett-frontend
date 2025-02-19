import { useState, useContext, useEffect, useRef } from "react";
import { useForm } from 'react-hook-form';
import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Button, Card, CardBody, CardFooter, CardHeader, FormControl, FormErrorMessage, FormHelperText, FormLabel, Heading, Input, Text } from "@chakra-ui/react";

import { ConfigContext } from '../../../lib/configContext';

import { registerConsenterAPI } from '../../../lib/consenting/registerConsenterAPI';
import { signUp } from '../../../lib/signUp';
import { emailRegex } from '../../../lib/formatting/emailRegex';

export default function ConsentingRegisterForm({ setStepIndex }) {
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

    // Create a ref so we can scroll to the register button when the apiState is 'success'.
    const scrollBoxRef = useRef(null);

    async function processRegistration(values) {
        // Setup the signUp email value for the cognito sign up redirect.
        setSignUpEmail(values.email);

        setApiState('loading');

        // The signature field is not used in the API call, so create a new object without the signature property
        const { signature, ...valuesWithoutSignature } = values;

        const response = await registerConsenterAPI( appConfig, valuesWithoutSignature );
        console.log('register Response', response);

        // Set the stepper to the next step if the response is ok.
        if (response.payload.ok) {
            setStepIndex(2);
        }

        // Use a ternary conditional to set the apiState based on the response
        setApiState(response.payload.ok ? 'success' : 'error');
        
        // Capture the error message if the response is not ok.
        setApiError(response.payload.ok ? null : response.message);
    }

    // Scroll to the "Create Account" card after a successful registration.
    useEffect(() => {
        if (apiState === 'success') {
            scrollBoxRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [apiState]);

    function signUpRedirect() {
        const { cognitoDomain, consentingPerson: { cognitoID } } = appConfig;
        signUp(cognitoDomain, signUpEmail, cognitoID, 'consenting?action=post-signup');
    }

    return (
        <form onSubmit={handleSubmit(processRegistration)}>
            <Heading as="h3" size="lg" mt="6" mb="4">Register</Heading>
            <Text mb="6">
                Registering on ETT means that you consent to inclusion of your name and contacts on the ETT database 
                and in ETT-related communications made in the ETT process. Once registered you will be able to grant consent
                for disclosures, and provide Exhibit Forms. You will also be able to rescind consent at any time. Once your consent
                is rescinded (or expires after 10 years), your registration will also end.
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
                            value: emailRegex,
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
            <FormControl mb="4" isInvalid={errors.signature}>
                <FormLabel>Your Signature</FormLabel>
                <Input
                    id="signature"
                    name="signature"
                    placeholder="Signature"
                    {...register('signature', {
                        required: 'Signature is required',
                    })}
                />
                {!errors.signature ? (
                    <FormHelperText>Type your name here as your digital signature.</FormHelperText>
                ) : (
                    <FormErrorMessage>{errors.signature.message}</FormErrorMessage>
                )}
            </FormControl>
            <Button 
                my="4" 
                type="submit"
                isLoading={apiState === 'loading'}
                loadingText="Registering"
                isDisabled={apiState !== 'idle'}
            >
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
                <Card>
                    <CardHeader>
                        <Heading as="h4" size={"sm"}>Registration successful</Heading>
                    </CardHeader>
                    <CardBody>
                        <Text>Click <i>Create Account</i> to create an account and password.</Text>
                    </CardBody>
                    <CardFooter>
                        <Button
                            onClick={signUpRedirect}
                        >
                            Create Account
                        </Button>
                    </CardFooter>
                </Card>
            }
            <Box ref={scrollBoxRef}></Box> {/* Invisible element for scrolling */}

        </form>
    );
}
