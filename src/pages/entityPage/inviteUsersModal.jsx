import { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure, FormControl, Text, FormLabel, Input, Spinner, VStack, Alert, AlertIcon, FormHelperText, FormErrorMessage } from '@chakra-ui/react';
import { RiMailLine } from "react-icons/ri";

import { ConfigContext } from "../../lib/configContext";

import { inviteAuthIndFromEntityAPI } from '../../lib/entity/inviteAuthIndFromEntityAPI';

import { emailRegex } from "../../lib/formatting/emailRegex";

export default function InviteUsersModal({ numUsers, entity, updatePendingInvitations }) {
    // get the appConfig from the ConfigContext.
    const { appConfig } = useContext( ConfigContext );
    
    // Capture the email addresses to invite in a state variable, so we can update the UI.
    const [emailsToInvite, setEmailsToInvite] = useState({
        email1: '',
        email2: '',
    });

    // Set the initial state of the form data using react-hook-form.
    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
        watch,
    } = useForm();

    // Watch the value of email1 to use it in the validation of email2
    const email1Value = watch('email1');

    // UI State
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [apiState, setApiState] = useState('idle');

    // Handle form submission
    async function processInvitations(values) {
        console.log('Inviting: ', values);

        // Get the access token and email from the cookies.
        const accessToken = Cookies.get('EttAccessJwt');
        const idToken = Cookies.get('EttIdJwt');
        const email = JSON.parse(atob(idToken.split('.')[1])).email;

        setApiState('loading');

        // Send the invitation to the API.
        const inviteResult = await inviteAuthIndFromEntityAPI( appConfig, accessToken, email, entity, values );
        console.log(JSON.stringify(inviteResult));

        if (inviteResult.payload.ok) {
            console.log('Invitation successful');

            // Set the email addresses that were invited so we can update the UI.
            setEmailsToInvite(values);

            setApiState('success');
        } else {
            setApiState('error');
        }
    }

    function handleClose() {
        if (apiState === 'success') {
            // If we are closing after successful invites, update the pending invitations in the main page state in order to show the new invitations in the UI.
            updatePendingInvitations(emailsToInvite.email1, emailsToInvite.email2);
        }

        setEmailsToInvite({
            email1: '',
            email2: '',
        });

        setApiState('idle');
        onClose();
    }

    return (
        <>
            <Button isDisabled={numUsers > 0} onClick={onOpen}>Invite Authorized Individuals</Button>
            <Modal size="xl" isOpen={isOpen} onClose={handleClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Invite Authorized Individuals</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {apiState === 'success' &&
                            <VStack mb="4">
                                <Alert status='success'>
                                    <AlertIcon />
                                    Invitations sent successfully
                                </Alert>
                            </VStack>
                        }
                        <Text mb="2">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            Elit deserunt labore cillum sunt qui excepteur ut. Quis nulla quis occaecat et ex eiusmod dolor est voluptate est aliquip deserunt minim quis. Id proident cupidatat aliquip ut tempor ipsum esse laborum laboris nostrud. Mollit ea labore aliqua et laborum adipisicing dolore. Laborum esse cupidatat magna exercitation.
                        </Text>
                        <Text mb="4">
                            Commodo ullamco commodo tempor amet aliqua elit amet esse ut sint aliquip id laborum. Consectetur eu id pariatur cillum. Excepteur velit in enim deserunt.
                        </Text>
                        <form onSubmit={handleSubmit(processInvitations)}>
                            <FormControl mb="4" isInvalid={errors.email1}>
                                <FormLabel>Email 1</FormLabel>
                                <Input
                                    id="email1"
                                    name="email1"
                                    type="email"
                                    placeholder="Email Address"
                                    isDisabled={apiState === 'success'}
                                    {...register('email1', {
                                        required: 'Email 1 is required',
                                        pattern: {
                                            value: emailRegex,
                                            message: 'Invalid email address'
                                        }
                                    })}
                                />
                                {!errors.email1 ? (
                                    <FormHelperText>The email address of the first Authorized Individual</FormHelperText>
                                ) : (
                                    <FormErrorMessage>{errors.email1.message}</FormErrorMessage>
                                )}
                            </FormControl>
                            <FormControl mb="4" isInvalid={errors.email2}>
                                <FormLabel>Email 2</FormLabel>
                                <Input
                                    id="email2"
                                    name="email2"
                                    type="email"
                                    placeholder="Email Address"
                                    isDisabled={apiState === 'success'}
                                    {...register('email2', {
                                        required: 'Email 2 is required',
                                        pattern: {
                                            value: emailRegex,
                                            message: 'Invalid email address'
                                        },
                                        validate: value =>
                                            value !== email1Value || 'Email 2 cannot be the same as Email 1'
                                    })}
                                />
                                {!errors.email2 ? (
                                    <FormHelperText>The email address of the second Authorized Individual</FormHelperText>
                                ) : (
                                    <FormErrorMessage>{errors.email2.message}</FormErrorMessage>
                                )}
                            </FormControl>
                            {apiState !== 'success' &&
                                <Button my="1em" type="submit">
                                    {apiState === 'loading' && <Spinner />}
                                    {apiState === 'idle' && <><RiMailLine style={{ marginRight: '0.5em' }} /> Send Invitations </>}
                                    {apiState === 'error' && 'Error please try again'}
                                </Button>
                            }
                        </form>
                        {apiState === 'success' &&
                            <Button my="4" onClick={handleClose}>Close</Button>
                        }
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}
