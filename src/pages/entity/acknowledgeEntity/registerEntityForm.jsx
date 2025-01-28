import { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Heading, FormControl, FormLabel, FormErrorMessage, FormHelperText, Input, Button, Spinner, Text, Card, CardHeader, CardBody, CardFooter } from "@chakra-ui/react";

import { registerEntityAPI } from '../../../lib/entity/registerEntityAPI';
import { signUp } from '../../../lib/signUp';

import { ConfigContext } from '../../../lib/configContext';

export default function RegisterEntityForm({ code, setStepIndex }) {
    // Get the appConfig from the ConfigContext.
    const { appConfig } = useContext( ConfigContext );

    // Get the email for the invitation from the URL search params.
    let [searchParams] = useSearchParams();
    const invitationEmail = searchParams.get('email');

    // Set the initial state of the form data using react-hook-form.
    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            entity_name: '',
            fullname: '',
            title: '',
            email: invitationEmail ? invitationEmail : '',
            signature: '',
        }
    });

    // Setup state variables for the API call.
    const [apiState, setApiState] = useState('idle');
    const [apiError, setApiError] = useState(null);

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

    function handleRegisterClick() {
        const { cognitoDomain, entityAdmin: { cognitoID } } = appConfig;
        signUp( cognitoDomain, signUpEmail, cognitoID, 'entity?action=post-signup');
    }

    return (
        <>
            <Heading as="h3" size={"md"} >Register Entity</Heading>
            <Text my="6">
                Nisi ex qui dolore irure dolor ut id velit veniam consequat. Veniam aliqua sint magna culpa proident dolore qui laborum ut mollit esse ea. Dolor pariatur aliquip non dolor nulla ipsum. Aute esse mollit commodo ad minim aute ut. Ullamco exercitation aliqua deserunt incididunt anim non aliquip.
            </Text>
            <form onSubmit={handleSubmit(processRegistration)}>
                <Box as="section" borderWidth="0.1em" borderRadius="16" borderColor="gray.100" p="4" mb="8">
                    <Heading as="h4" size={"sm"} mb="4">Entity Information</Heading>
                    <FormControl mb="4" isInvalid={errors.entity_name}>
                        <FormLabel>Full Name of Entity</FormLabel>
                        <Input
                            id="entity_name"
                            name="entity_name"
                            placeholder="Entity Name"
                            {...register('entity_name', {
                                required: 'Entity name is required',
                            })}
                        />
                        {!errors.entity_name ? (
                            <FormHelperText>Enter the full name of the entity, no acronyms. Example: Vanderbilt University</FormHelperText>
                        ) : (
                            <FormErrorMessage>{errors.entity_name.message}</FormErrorMessage>
                        )}
                    </FormControl>
                </Box>
                <Box as="section" borderWidth="0.1em" borderRadius="16" borderColor="gray.100" p="4" mb="8">
                <Heading as="h4" size={"sm"} mb="4">Administrative Support Professional Information</Heading>
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
                        <FormErrorMessage>{errors.fullname.message}</FormErrorMessage>
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
                        <FormErrorMessage>{errors.title.message}</FormErrorMessage>
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
                                value: /\S+@\S+\.\S+/,
                                message: 'Invalid email address',
                            },
                        })}
                    />
                    {!errors.email ? (
                        <FormHelperText>The email address to use for this account.</FormHelperText>
                    ) : (
                        <FormErrorMessage>{errors.email.message}</FormErrorMessage>
                    )}
                </FormControl>
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
                <Button my="1em" type="submit" isDisabled={apiState != 'idle'}>
                    { apiState == 'loading' && <Spinner /> }
                    { apiState == 'idle' && 'Register' }
                    { apiState == 'success' && 'Registered' }
                    { apiState === 'error' && 'Error' }
                </Button>
            </form>
            {apiState == 'success' &&
                <Card>
                    <CardHeader>
                        <Heading as="h4" size={"sm"}>Registration successful</Heading>
                    </CardHeader>
                    <CardBody>
                        <Text>Click Sign Up to create a password and complete registration.</Text>
                    </CardBody>
                    <CardFooter>
                        <Button
                            onClick={handleRegisterClick}
                        >
                            Sign Up
                        </Button>
                    </CardFooter>
                </Card>
            }
            {apiState == 'error' &&
                <Box mt="4">
                    <Alert status="error">
                        <AlertIcon />
                        <AlertTitle>Error registering: </AlertTitle>
                        <AlertDescription>{apiError ? apiError : 'Unknown Error, API not responsive'}</AlertDescription>
                    </Alert>
                </Box>
            }
        </>
    );
}
