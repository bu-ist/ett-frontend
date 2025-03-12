// Very much like the editUserModal, this component is a modal that allows the user to invite another user, with the role given as a parameter.

import { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalFooter, ModalOverlay, useDisclosure, Text, VStack, Alert, AlertIcon, ButtonGroup, AlertTitle, AlertDescription, Code, FormControl, Box, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react';

import { emailRegex } from '../../lib/formatting/emailRegex';

import { RiMailLine } from "react-icons/ri";

import { ConfigContext } from '../../lib/configContext';


import { inviteUserAI } from '../../lib/amendment/inviteUserAI';


export default function InviteUserModal({ entity, role, fetchData }) {
    const { appConfig } = useContext(ConfigContext);

    // UI State
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [apiState, setApiState] = useState('idle');

    const [apiError, setApiError] = useState(null);

    // The role will either be 'RE_ADMIN' or 'RE_AUTH_IND'.
    // Map the role to a human-readable string.
    const roleMap = {
        RE_ADMIN: 'Administrative Support Professional',
        RE_AUTH_IND: 'Authorized Individual',
    };

    const roleString = roleMap[role];

    // Set the initial state of the form data using react-hook-form.
    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = useForm();

    async function processInvite(formData) {
        const { email } = formData;

        console.log('Inviting user with email: ', email);

        // Get the access token from the cookies.
        const accessToken = Cookies.get('EttAccessJwt');

        setApiState('loading');

        // Send the invitation to the API.
        const inviteResult = await inviteUserAI(appConfig, accessToken, email, entity.entity_id, role);
        console.log(JSON.stringify(inviteResult));

        if (inviteResult.payload?.ok) {
            console.log('Invitation successful');

            setApiState('success');
        }
        else {
            setApiState('error');
            setApiError(inviteResult.message);
        }
    }

    function handleClose() {
        onClose();
        
        // To reflect the changes in the UI, trigger a re-fetch of the entity data.
        if (apiState === 'success' || apiState === 'error') {
            fetchData();
        }
        setApiState('idle');
    }

    return (
        <>
            <Button leftIcon={<RiMailLine />} onClick={onOpen}>Invite User</Button>
            <Modal size="xl" isOpen={isOpen} onClose={handleClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Invite {roleString} User</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text mb="6">
                            Enter the email address of the person you would like to invite as a {roleString}.
                        </Text>
                        <form onSubmit={handleSubmit(processInvite)}>
                            <FormControl isInvalid={errors.email}>
                                <FormLabel>Email Address</FormLabel>
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
                        </form>
                        {apiState === 'success' &&
                            <VStack mb="4">
                                <Alert status='success'>
                                    <AlertIcon />
                                    Invitation Successful
                                </Alert>
                            </VStack>
                        }
                        {apiState === 'error' &&
                            <VStack mb="4">
                                <Alert status="error">
                                    <AlertIcon />
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>{apiError ? apiError : 'Unknown Error, API not responsive'}</AlertDescription>
                                </Alert>
                            </VStack>
                        }
                    </ModalBody>
                    <ModalFooter>
                        {apiState !== 'success' && apiState !== 'error' &&
                            <ButtonGroup spacing="4">
                                <Button onClick={handleClose}>Cancel</Button>
                                <Button
                                    leftIcon={<RiMailLine />}
                                    onClick={handleSubmit(processInvite)}
                                    isLoading={apiState === 'loading'}
                                >
                                    Invite User
                                </Button>
                            </ButtonGroup>
                        }
                        {apiState === 'success' &&
                            <Button onClick={handleClose}>Done</Button>
                        }
                        {apiState === 'error' &&
                            <Button onClick={handleClose}>Sorry, try reloading</Button>
                        }
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
