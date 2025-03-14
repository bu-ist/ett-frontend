// Very much like the editUserModal, this component is a modal that allows the user to invite another user, with the role given as a parameter.

import { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalFooter, ModalOverlay, useDisclosure, Text, VStack, Alert, AlertIcon, ButtonGroup, AlertTitle, AlertDescription, Code, FormControl, Box, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react';

import { emailRegex } from '../../lib/formatting/emailRegex';

import { RiMailLine } from "react-icons/ri";

import { ConfigContext } from '../../lib/configContext';


import { removeAndReplaceUserAI } from '../../lib/amendment/removeAndReplaceUserAI';


export default function RemoveAndInviteReplacementModal({ entity, role, emailToRemove, emailOfRequestor, fetchData }) {
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

    async function processChange(formData) {
        const { email: emailToInvite } = formData;

        console.log('Inviting user with email: ', emailToInvite);
        console.log('Removing user with email ', emailToRemove);

        // Get the access token from the cookies.
        const accessToken = Cookies.get('EttAccessJwt');

        setApiState('loading');

        // Send the request to the API.
        const replaceResult = await removeAndReplaceUserAI(appConfig, accessToken, entity.entity_id, emailToRemove, emailToInvite, role, emailOfRequestor)

        console.log(JSON.stringify(replaceResult));

        if (replaceResult.payload?.ok) {
            console.log('Invitation successful');

            setApiState('success');
        }
        else {
            setApiState('error');
            setApiError(replaceResult.message);
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
            <Button leftIcon={<RiMailLine />} onClick={onOpen}>Remove and Invite Replacement</Button>
            <Modal size="xl" isOpen={isOpen} onClose={handleClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Remove and Invite Replacement {roleString}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text mb="6">
                            You will be removing the user with email: <br /> <Code>{emailToRemove}</Code> <br /> from this entity and inviting a new user as a {roleString}.
                        </Text>
                        <Text mb="6">
                            Enter the email address of the person you would like to invite as a {roleString}.
                        </Text>
                        <form onSubmit={handleSubmit(processChange)}>
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
                                    Removal and Invitation Successful
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
                                <Button isDisabled={apiState === 'loading'} onClick={handleClose}>Cancel</Button>
                                <Button
                                    leftIcon={<RiMailLine />}
                                    onClick={handleSubmit(processChange)}
                                    isLoading={apiState === 'loading'}
                                >
                                    Remove and Invite User
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
