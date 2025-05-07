import { 
    Modal, ModalOverlay, ModalContent, ModalHeader, 
    ModalFooter, ModalBody, Button, FormControl,
    FormLabel, Input, Box, Alert, AlertIcon,
    FormErrorMessage, Text, VStack,
    AlertDialog, AlertDialogBody, AlertDialogContent,
    AlertDialogHeader, AlertDialogFooter, AlertDialogOverlay,
    useDisclosure
} from "@chakra-ui/react";
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useState, useContext, useEffect, useRef } from 'react';
import { emailRegex } from '../../../lib/formatting/emailRegex';
import { ConfigContext } from '../../../lib/configContext';
import { updateConsenterAPI } from '../../../lib/consenting/updateConsenterAPI';
import { signOut } from '../../../lib/signOut';
import Cookies from 'js-cookie';

export default function EditConsentDetailsModal({ isOpen, onClose, consenter, onSaveSuccess }) {
    const { appConfig } = useContext(ConfigContext);
    const [apiState, setApiState] = useState('idle');
    const [apiError, setApiError] = useState(null);
    const [submittedData, setSubmittedData] = useState(null);

    // For email change confirmation dialog
    const { 
        isOpen: isConfirmOpen, 
        onOpen: onConfirmOpen, 
        onClose: onConfirmClose 
    } = useDisclosure();
    const cancelRef = useRef();
    const [formDataForConfirmation, setFormDataForConfirmation] = useState(null);

    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
        defaultValues: {
            firstname: consenter.firstname || '',
            middlename: consenter.middlename || '',
            lastname: consenter.lastname || '',
            email: consenter.email || '',
            phone_number: consenter.phone_number || ''
        }
    });

    // Watch the email field to detect changes
    const watchEmail = watch("email");
    // Compare against submitted data if available, otherwise use original consenter data
    const isEmailChanged = submittedData 
        ? submittedData.new_email !== consenter.email
        : watchEmail !== consenter.email;

    // Only reset form when modal is first opened
    useEffect(() => {
        if (isOpen) {
            reset({
                firstname: consenter.firstname || '',
                middlename: consenter.middlename || '',
                lastname: consenter.lastname || '',
                email: consenter.email || '',
                phone_number: consenter.phone_number || ''
            });
        }
    }, [isOpen, reset, consenter]);

    const onSubmit = async (data) => {
        // Show confirmation dialog if email is being changed
        if (data.email !== consenter.email) {
            setFormDataForConfirmation(data);
            onConfirmOpen();
            return;
        }
        await processSubmission(data);
    };

    const processSubmission = async (data) => {
        setApiState('loading');
        setApiError(null);

        try {
            const accessToken = Cookies.get('EttAccessJwt');
            
            // Structure the data to match the API expectations
            const submitData = {
                email: consenter.email, // Use original email for identification
                new_email: data.email, // Use form email as new_email
                firstname: data.firstname,
                middlename: data.middlename || '',
                lastname: data.lastname,
                phone_number: data.phone_number
            };

            const response = await updateConsenterAPI(appConfig, accessToken, submitData);

            if (response.payload.ok) {
                setApiState('success');
                setSubmittedData(submitData);
                onSaveSuccess(submitData);
            } else {
                throw new Error(response.message || 'Failed to update user information');
            }
        } catch (error) {
            console.error('Error saving changes:', error);
            setApiState('error');
            setApiError(error.message || 'An error occurred while saving changes');
        }
    };

    function handleClose() {
        // If email was changed and update was successful, sign out when modal is closed
        if (apiState === 'success' && submittedData && submittedData.new_email !== consenter.email) {
            signOut(appConfig.cognitoDomain, appConfig.consentingPerson.cognitoID);
            return;
        }

        // Reset all state only after modal is actually closed
        onClose();
        setSubmittedData(null);
        setApiState('idle');
        setApiError(null);
    }

    return (
        <>
            <Modal isOpen={isOpen} onClose={handleClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <ModalHeader>Edit Personal details</ModalHeader>
                        <ModalBody>
                            <Box mb="6">
                                <FormControl mb="4" isInvalid={errors.firstname}>
                                    <FormLabel>First Name</FormLabel>
                                    <Input
                                        {...register('firstname', {
                                            required: 'First name is required'
                                        })}
                                        isDisabled={apiState === 'success'}
                                    />
                                    <FormErrorMessage>{errors.firstname?.message}</FormErrorMessage>
                                </FormControl>

                                <FormControl mb="4" isInvalid={errors.middlename}>
                                    <FormLabel>Middle Name</FormLabel>
                                    <Input
                                        {...register('middlename')}
                                        isDisabled={apiState === 'success'}
                                    />
                                    <FormErrorMessage>{errors.middlename?.message}</FormErrorMessage>
                                </FormControl>

                                <FormControl mb="4" isInvalid={errors.lastname}>
                                    <FormLabel>Last Name</FormLabel>
                                    <Input
                                        {...register('lastname', {
                                            required: 'Last name is required'
                                        })}
                                        isDisabled={apiState === 'success'}
                                    />
                                    <FormErrorMessage>{errors.lastname?.message}</FormErrorMessage>
                                </FormControl>

                                <FormControl mb="4" isInvalid={errors.email}>
                                    <FormLabel>Email</FormLabel>
                                    <Input
                                        {...register('email', {
                                            required: 'Email is required',
                                            pattern: {
                                                value: emailRegex,
                                                message: 'Invalid email address'
                                            }
                                        })}
                                        isDisabled={apiState === 'success'}
                                    />
                                    {isEmailChanged && !errors.email && (
                                        <Alert status="warning" mt="2" size="sm">
                                            <AlertIcon />
                                            Changing your email will require creating a new account
                                        </Alert>
                                    )}
                                    <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
                                </FormControl>

                                <FormControl mb="4" isInvalid={errors.phone_number}>
                                    <FormLabel>Phone Number</FormLabel>
                                    <Input
                                        {...register('phone_number', {
                                            required: 'Phone number is required'
                                        })}
                                        isDisabled={apiState === 'success'}
                                    />
                                    <FormErrorMessage>{errors.phone_number?.message}</FormErrorMessage>
                                </FormControl>
                            </Box>

                            {apiState === 'success' && isEmailChanged &&
                                <VStack mb="4">
                                    <Alert status='success'>
                                        <AlertIcon />
                                        <Box>
                                            <Text>Changes saved successfully. Because you changed your email:</Text>
                                            <Text>1. Click Close to log out</Text>
                                            <Text>2. Check your new email for temporary password</Text>
                                            <Text>3. Log in with your new credentials</Text>
                                        </Box>
                                    </Alert>
                                </VStack>
                            }

                            {apiState === 'success' && !isEmailChanged &&
                                <VStack mb="4">
                                    <Alert status='success'>
                                        <AlertIcon />
                                        Changes saved successfully
                                    </Alert>
                                </VStack>
                            }

                            {apiState === 'error' && (
                                <Alert status="error" mt="4">
                                    <AlertIcon />
                                    <Box>
                                        <Text fontWeight="bold">Unable to save changes</Text>
                                        {apiError && (
                                            <Text mt="1" fontStyle="italic">
                                                {apiError}
                                            </Text>
                                        )}
                                        <Text mt="1">
                                            Please try again. If the problem persists,
                                            contact support.
                                        </Text>
                                    </Box>
                                </Alert>
                            )}
                        </ModalBody>
                        <ModalFooter>
                            <Button 
                                variant="ghost" 
                                mr={3} 
                                onClick={handleClose}
                            >
                                {apiState === 'success' ? 'Close' : 'Cancel'}
                            </Button>
                            {apiState !== 'success' && (
                                <Button 
                                    colorScheme="blue"
                                    type="submit"
                                    isLoading={apiState === 'loading'}
                                    isDisabled={apiState === 'error'}
                                >
                                    Save Changes
                                </Button>
                            )}
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>

            <AlertDialog
                isOpen={isConfirmOpen}
                leastDestructiveRef={cancelRef}
                onClose={onConfirmClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Confirm Email Change
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            Changing your email will require creating a new account. Are you sure you want to proceed?
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onConfirmClose}>
                                Cancel
                            </Button>
                            <Button 
                                colorScheme="red" 
                                onClick={async () => {
                                    onConfirmClose();
                                    await processSubmission(formDataForConfirmation);
                                }} 
                                ml={3}
                            >
                                Confirm
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
}

EditConsentDetailsModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    consenter: PropTypes.shape({
        firstname: PropTypes.string,
        middlename: PropTypes.string,
        lastname: PropTypes.string,
        email: PropTypes.string,
        phone_number: PropTypes.string
    }).isRequired,
    onSaveSuccess: PropTypes.func.isRequired
};