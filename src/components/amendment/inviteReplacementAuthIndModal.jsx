// This component is a modal that allows inviting a replacement Authorized Individual
// when one has been removed from the system.

import { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import { 
    Button, Modal, ModalBody, ModalCloseButton, 
    ModalContent, ModalHeader, ModalFooter, 
    ModalOverlay, useDisclosure, Text, VStack, 
    Alert, AlertIcon, ButtonGroup, AlertTitle, 
    AlertDescription, FormControl, Box, 
    FormErrorMessage, FormLabel, Input 
} from '@chakra-ui/react';
import PropTypes from 'prop-types';

import { emailRegex } from '../../lib/formatting/emailRegex';
import { RiMailLine } from "react-icons/ri";
import { ConfigContext } from '../../lib/configContext';
import { inviteAuthIndFromEntityAPI } from '../../lib/entity/inviteAuthIndFromEntityAPI';

export default function InviteReplacementAuthIndModal({ entity, updatePendingInvitations, isSecondInvite = false }) {
    const { appConfig } = useContext(ConfigContext);

    // UI State
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [apiState, setApiState] = useState('idle');
    const [apiError, setApiError] = useState(null);
    const [emailToInvite, setEmailToInvite] = useState('');

    // Set the initial state of the form data using react-hook-form
    const {
        handleSubmit,
        register,
        formState: { errors }
    } = useForm();

    async function processInvite(formData) {
        const { email } = formData;

        console.log('Inviting replacement Authorized Individual with email: ', email);

        const accessToken = Cookies.get('EttAccessJwt');
        const idToken = Cookies.get('EttIdJwt');
        const fromEmail = JSON.parse(atob(idToken.split('.')[1])).email;
        
        setApiState('loading');

        // Send the invitation using inviteAuthIndFromEntityAPI with single email
        const inviteResult = await inviteAuthIndFromEntityAPI(
            appConfig,
            accessToken,
            fromEmail,
            entity,
            { email1: email } // Only provide email1, making it a single-invite case
        );
        
        console.log(JSON.stringify(inviteResult));

        if (inviteResult.payload?.ok) {
            console.log('Replacement invitation successful');
            // Store the invited email for updating the UI
            setEmailToInvite(email);
            setApiState('success');
        } else {
            setApiState('error');
            setApiError(inviteResult.message);
        }
    }

    function handleClose() {
        onClose();
        
        // If successful, update the pending invitations in the UI
        if (apiState === 'success') {
            // Update with just the single email (no email2)
            updatePendingInvitations(emailToInvite);
        }
        
        // Reset all state
        setEmailToInvite('');
        setApiState('idle');
        setApiError(null);
    }

    return (
        <>
            <Button leftIcon={<RiMailLine />} colorScheme="blue" size="lg" onClick={onOpen}>
                Invite Replacement Authorized Individual
            </Button>
            <Modal size="xl" isOpen={isOpen} onClose={handleClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Invite Replacement Authorized Individual</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text mb="4">
                            {isSecondInvite
                                ? "You can now invite a second Authorized Individual to complete the entity registration."
                                : "An Authorized Individual has been removed from this entity. You can invite a replacement to maintain the required two Authorized Individuals for full entity registration."
                            }
                        </Text>
                        <Text mb="6">
                            Enter the email address of the person you would like to invite as an Authorized Individual.
                            They should be a person in a senior role who is accustomed to managing confidential and sensitive information.
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
                                            message: 'Entered value does not match email format'
                                        }
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
                                    Replacement Invitation Sent Successfully
                                </Alert>
                            </VStack>
                        }
                        {apiState === 'error' &&
                            <VStack mb="4">
                                <Alert status="error">
                                    <AlertIcon />
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>
                                        {apiError ? apiError : 'Unknown Error, API not responsive'}
                                    </AlertDescription>
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
                                    Send Invitation
                                </Button>
                            </ButtonGroup>
                        }
                        {apiState === 'success' &&
                            <Button onClick={handleClose}>Done</Button>
                        }
                        {apiState === 'error' &&
                            <Button onClick={handleClose}>Close</Button>
                        }
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

InviteReplacementAuthIndModal.propTypes = {
    entity: PropTypes.shape({
        entity_id: PropTypes.string.isRequired
    }).isRequired,
    updatePendingInvitations: PropTypes.func.isRequired,
    isSecondInvite: PropTypes.bool
};
