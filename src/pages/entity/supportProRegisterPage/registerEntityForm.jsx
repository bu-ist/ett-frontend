import { useState, useContext, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Heading, FormControl, FormLabel, FormErrorMessage, FormHelperText, Input, Button, Spinner, Text, Card, CardHeader, CardBody, CardFooter } from "@chakra-ui/react";

import RegisterStatementText from "../../../components/sharedTexts/registerStatementText";

import { registerEntityAPI } from '../../../lib/entity/registerEntityAPI';
import { signUp } from '../../../lib/signUp';
import { emailRegex } from '../../../lib/formatting/emailRegex';

import { ConfigContext } from '../../../lib/configContext';

export default function RegisterEntityForm({ code, setStepIndex, entityInfo }) {
    // Get the appConfig from the ConfigContext.
    const { appConfig } = useContext( ConfigContext );

    // Get the email for the invitation from the URL search params.
    let [searchParams] = useSearchParams();
    const invitationEmail = searchParams.get('email');

    // Destructure the entity info, with optional chaining and default values to handle the case where there is no existing entity.
    const { entity_id = '', entity_name = '' } = entityInfo?.entity || {};

    // Setup the initial state of the form data.
    const defaultValues = {
        ...(!entity_id && { entity_name: '' }), // Only include the entity_name if there is no entity_id.
        fullname: '',
        title: '',
        email: invitationEmail ? invitationEmail : '',
        signature: '',
    };
    // Set the initial state of the form data using react-hook-form.
    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues
    });

    // Setup state variables for the API call.
    const [apiState, setApiState] = useState('idle');
    const [apiError, setApiError] = useState(null);

    // Store the email from the form separately in a state variable, so the sign up redirect can use it.
    const [ signUpEmail, setSignUpEmail ] = useState('');

    // Create a ref so we can scroll to the card when the apiState is 'success'.
    const createCardRef = useRef(null);

    // Handle form submission
    async function processRegistration(values) {
        // Setup the signUp email value for the cognito sign up redirect.
        setSignUpEmail(values.email);

        setApiState('loading');

        // Destructure signature and create final values object with renamed signature
        const { signature, ...otherValues } = values;
        const finalValues = {
            ...otherValues,
            registration_signature: signature,
            ...(entity_id && { entity_id })  // If this is an ASP signing up for an existing entity, add the entity_id to a new object.
        };
        
        const registerResult = await registerEntityAPI(appConfig, code, finalValues);
        console.log(registerResult);

        // This is the error handling code that should be replicated across the app.
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
        signUp( cognitoDomain, signUpEmail.toLowerCase(), cognitoID, 'entity?action=post-signup');
    }

    // Scroll to the "Create Account" card after a successful registration.
    useEffect(() => {
        if (apiState === 'success') {
            createCardRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [apiState]);

    return (
        <>
            <Heading as="h3" size={"md"} >Registering An Entity</Heading>
            <RegisterStatementText />
            <form onSubmit={handleSubmit(processRegistration)}>
                <Box as="section" borderWidth="0.1em" borderRadius="16" borderColor="gray.100" p="4" mb="8">
                    <Heading as="h4" size={"sm"} mb="4">Entity Information</Heading>
                    {entity_id !== '' ? (
                         <Text fontSize="2xl">{entity_name}</Text>
                    ) : (    
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
                    )}
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
                            <FormHelperText>&nbsp;</FormHelperText>
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
                                    value: emailRegex,
                                    message: 'Invalid email address',
                                },
                            })}
                        />
                        {!errors.email ? (
                            <FormHelperText>&nbsp;</FormHelperText>
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
                        <Text>Click <i>Create Account</i> to create an account and password.</Text>
                    </CardBody>
                    <CardFooter>
                        <Button
                            onClick={handleRegisterClick}
                        >
                            Create Account
                        </Button>
                    </CardFooter>
                </Card>
            }
            <Box ref={createCardRef}></Box> {/* Invisible element for scrolling */}
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
