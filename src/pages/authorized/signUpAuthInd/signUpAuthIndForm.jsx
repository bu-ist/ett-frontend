import { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Button, Card, CardBody, CardHeader, Flex, FormControl, FormErrorMessage, FormHelperText, FormLabel, Heading, Input, Spinner, Text } from "@chakra-ui/react";

import SignUpCognitoButton from './signUpCognitoButton';

import { ConfigContext } from '../../../lib/configContext';

import { registerEntityAPI } from '../../../lib/entity/registerEntityAPI';
import { signUp } from '../../../lib/signUp';
import { emailRegex } from '../../../lib/formatting/emailRegex';

export default function SignUpAuthIndForm({inviteInfo, setStepIndex, code}) {
    //const  { entity, invitation, users }  = entityInfo;

    // Get the appConfig from the ConfigContext.
    const { appConfig } = useContext( ConfigContext );

    // Get the email for the invitation from the URL search params.
    let [searchParams] = useSearchParams();
    const invitationEmail = searchParams.get('email');

    // Setup state variables for the API call.
    const [apiState, setApiState] = useState('idle');
    const [apiError, setApiError] = useState(null);

    // Set the initial state of the form data using react-hook-form.
    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            fullname: '',
            title: '',
            email: invitationEmail ? invitationEmail : '',
            signature: '',
        }
    });

    // Store the email from the form separately in a state variable, so the sign up redirect can use it.
    const [ signUpEmail, setSignUpEmail ] = useState('');

    // Handle form submission
    async function processRegistration(values) {
        // Setup the signUp email value for the cognito sign up redirect.
        setSignUpEmail(values.email);

        setApiState('loading');

        // The signature field is not used in the API call, so create a new object without the signature property
        const { signature, ...valuesWithoutSignature } = values;

        const registerResult = await registerEntityAPI(appConfig, code, valuesWithoutSignature);
        console.log(registerResult);

         if (registerResult.payload.ok) {
            console.log('Registration successful');
            setStepIndex(3);
            setApiState('success');
        }

        if (!registerResult.payload.ok) {
            console.log('Registration failed');
            setApiState('error');
            setApiError(registerResult.message);
        }
    }

    function signUpRedirect() {
        const { cognitoDomain, authorizedIndividual: { cognitoID } } = appConfig;
        signUp( cognitoDomain, signUpEmail, cognitoID, 'auth-ind?action=post-signup')
    }

    return (
        <>
            <Heading as="h3" my="4" size="md">Register For an Authorized Individual Account</Heading>
            <Text mb="8">
                Nisi voluptate irure culpa dolor laborum enim consectetur eu incididunt. Id culpa esse ad Lorem dolor cupidatat incididunt ipsum ipsum velit. Incididunt non velit et minim eiusmod occaecat ex consectetur voluptate cillum.
            </Text>
            <form onSubmit={handleSubmit(processRegistration)}>
                <Box as="section" borderWidth="0.1em" borderRadius="16" borderColor="gray.100" p="4" mb="8">
                    <Heading as="h4" size={"sm"} mb="4">Your Information</Heading>
                    <FormControl mb="4" isInvalid={errors.fullname}>
                        <FormLabel>Your Full Name</FormLabel>
                        <Input
                            id="fullname"
                            name="fullname"
                            placeholder="Full Name"
                            {...register('fullname', {
                                required: 'Full name is required',
                            })}
                        />
                        {!errors.fullname ? (
                            <FormHelperText>The name to use for your account.</FormHelperText>
                        ) : (
                            <FormErrorMessage>{errors.fullname && errors.fullname.message}</FormErrorMessage>
                        )}
                    </FormControl>
                    <FormControl mb="4" isInvalid={errors.title}>
                        <FormLabel>Your Title</FormLabel>
                        <Input
                            id="title"
                            name="title"
                            placeholder="Title"
                            {...register('title', {
                                required: 'Title is required',
                            })}
                        />
                        {!errors.title ? (
                            <FormHelperText>Your current title.</FormHelperText>
                        ) : (
                            <FormErrorMessage>{errors.title && errors.title.message}</FormErrorMessage>
                        )}
                    </FormControl>
                    <FormControl mb="4" isInvalid={errors.email}>
                        <FormLabel>Your Email</FormLabel>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Email"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: emailRegex,
                                    message: 'Invalid email address',
                                },
                            })}
                        />
                        {!errors.email ? (
                            <FormHelperText>The email address to use for this account.</FormHelperText>
                        ) : (
                            <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
                        )}
                    </FormControl>
                </Box>
                <Box as="section" borderWidth="0.1em" borderRadius="16" borderColor="gray.100" p="4" mb="8">
                    <Heading as="h4" size={"sm"} mb="4">Optional Delegated Contact</Heading>
                    <Text mb="4">
                        If you wish to have disclosure correspendence sent to a different contact, you may add a delegated contact here.
                    </Text>
                    <Flex justifyContent="flex-end" width="100%">
                        <Button
                            onClick={() => alert('This feature is not yet implemented.')}
                        >
                        Add Delegated Contact
                        </Button>
                    </Flex>
                </Box>
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
                <Button my="1em" type="submit" isDisabled={apiState !== 'idle'}>
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
                            <AlertDescription>{apiError ? apiError : 'Unknown Error, API not responsive'}</AlertDescription>
                        </Alert>
                    </Box>
                }
            </form>
            {apiState === 'success' &&
                <SignUpCognitoButton signUpRedirect={signUpRedirect} />
            }
        </>
    );
}
