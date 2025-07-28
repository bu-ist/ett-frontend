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
    const [apiError, setApiError] = useState(null);

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
            setApiError(inviteResult.message);
            console.error(inviteResult);
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
            <Button isDisabled={numUsers > 0} colorScheme="blue" size="lg" onClick={onOpen}>Invite Authorized Individuals</Button>
            <Modal size="2xl" isOpen={isOpen} onClose={handleClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Invite Authorized Individuals</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text mb="2">
                            Invite two Authorized Individuals by their email addresses. These will each be a person in a senior role that 
                            is accustomed to managing confidential and sensitive information, who will directly receive the completed Disclosure Form 
                            information on behalf of the Requesting Registered Entity and will decide who at the Registered Entity needs the information.
                        </Text>
                        <Text mb="4">
                            Each of the Authorized Individuals will receive an email invitation to register with the system.
                            They will be able to create an account and complete the registration process, or optionally they
                            can reject the invitation. You will be notified if either Authorized Individual rejects the invitation.
                            You will also receive a notification when both Authorized Individuals have completed the registration process.
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
                                    {apiState === 'error' && (apiError ? apiError : 'Error please try again')}
                                </Button>
                            }
                        </form>
                        {apiState === 'success' &&
                            <VStack mb="4">
                                <Alert status='success'>
                                    <AlertIcon />
                                    Invitations sent successfully
                                </Alert>
                            </VStack>
                        }
                        {apiState === 'success' &&
                            <Button my="4" onClick={handleClose}>Close</Button>
                        }
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}
