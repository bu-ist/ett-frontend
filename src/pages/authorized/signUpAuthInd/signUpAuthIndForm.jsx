import { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Button, Flex, FormControl, FormErrorMessage, FormHelperText, FormLabel, Heading, Input, Spinner, Text } from "@chakra-ui/react";
import { AiOutlineClose } from 'react-icons/ai';

import DelegatedContactForm from './delegatedContactForm';

import { ConfigContext } from '../../../lib/configContext';

import { registerEntityAPI } from '../../../lib/entity/registerEntityAPI';
import { emailRegex } from '../../../lib/formatting/emailRegex';

export default function SignUpAuthIndForm({inviteInfo, setRegistered, setSignUpEmail, code}) {
    //const  { entity, invitation, users }  = entityInfo;

    // Get the appConfig from the ConfigContext.
    const { appConfig } = useContext( ConfigContext );

    // Get the email for the invitation from the URL search params.
    let [searchParams] = useSearchParams();
    const invitationEmail = searchParams.get('email');

    // Setup state variables for the API call.
    const [apiState, setApiState] = useState('idle');
    const [apiError, setApiError] = useState(null);

    // Setup state for the optional delegated contact; if true display the delegated contact form and add it to the API call.
    const [ addingDelegatedContact, setAddingDelegatedContact ] = useState(false);

    // Function to toggle the boolean value
    function toggleAddingDelegatedContact() {
        setAddingDelegatedContact(prevState => !prevState);
    };


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

    // Handle form submission
    async function processRegistration(values) {
        // Setup the signUp email value for the cognito sign up redirect.
        setSignUpEmail(values.email);

        setApiState('loading');

        // Remove delegate fields if addingDelegatedContact is false.
        // By doing it here, we don't have to get involved with the react-hook-form state.
        if (!addingDelegatedContact) {
            delete values.delegate_fullname;
            delete values.delegate_email;
            delete values.delegate_title;
            delete values.delegate_phone;
        }
        
        const registerResult = await registerEntityAPI(appConfig, code, values);
        console.log(registerResult);

         if (registerResult.payload.ok) {
            console.log('Registration successful');
            setApiState('success');

            // Tell the parent component that the registration is complete. 
            setRegistered();
        }

        if (!registerResult.payload.ok) {
            console.log('Registration failed');
            setApiState('error');
            setApiError(registerResult.message);
        }
    }

    return (
        <>
            <Heading as="h3" my="4" size="md">Register For an Authorized Individual Account - Required for Entity Registration</Heading>
            <Text mb="8">
                An Authorized Individual is a person in a senior role that is accustomed to managing confidential and sensitive information, who will make Disclosure Requests and directly
                receive the completed Disclosure Form information on behalf of the Requesting Registered Entity and will decide who at the Registered Entity needs
                the information.
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
                            <FormHelperText>&nbsp;</FormHelperText>
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
                            <FormHelperText>&nbsp;</FormHelperText>
                        ) : (
                            <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
                        )}
                    </FormControl>
                </Box>
                <Box as="section" borderWidth="0.1em" borderRadius="16" borderColor="gray.100" p="4" mb="8">
                    <Heading as="h4" size={"sm"} mb="4">Optional Delegated Contact</Heading>
                    <Text mb="4">
                        If you wish to have completed Disclosure Forms sent to a contact at the entity that you are 
                        registering — in addition to you — you may add a delegated contact here.
                    </Text>
                    { addingDelegatedContact &&
                        <DelegatedContactForm register={register} errors={errors} />
                    }
                    <Flex justifyContent="flex-end" width="100%">
                        <Button
                            onClick={toggleAddingDelegatedContact}
                            leftIcon={addingDelegatedContact ? <AiOutlineClose/> : null}
                        >
                            {addingDelegatedContact ? 'Cancel Delegated Contact' : 'Add Delegated Contact'}
                        </Button>
                    </Flex>
                </Box>
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
        </>
    );
}
