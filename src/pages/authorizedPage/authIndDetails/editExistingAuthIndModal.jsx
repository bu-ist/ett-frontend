/**
 * Modal component for editing Authorized Individual and optional delegate contact information
 * 
 * Data Flow:
 * 1. Form displays current AI info and optional delegate contact
 * 2. User can toggle delegate contact section
 * 3. Form validation ensures:
 *    - Required fields are filled
 *    - Email format is valid
 *    - Delegate fields are required only when delegate section is enabled
 * 4. On submit:
 *    - Delegate fields are removed if section is disabled
 *    - Data is sent to updateAuthIndAPI
 *    - Parent component is notified on success via onSaveSuccess
 *    - Loading/error states are managed internally
 * 
 */
import { 
    Modal, ModalOverlay, ModalContent, ModalHeader, 
    ModalFooter, ModalBody, Button, FormControl,
    FormLabel, Input, Box, Heading, Alert, AlertIcon,
    Divider, HStack, FormErrorMessage, Text, VStack, 
    UnorderedList, ListItem, AlertDialog, AlertDialogBody, 
    AlertDialogContent, AlertDialogHeader, AlertDialogFooter, 
    AlertDialogOverlay, useDisclosure,
    ModalCloseButton
} from "@chakra-ui/react";
import { AiOutlineClose } from 'react-icons/ai';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useState, useContext, useRef, useEffect } from 'react';
import { emailRegex } from '../../../lib/formatting/emailRegex';
import Cookies from 'js-cookie';
import { ConfigContext } from '../../../lib/configContext';
import { updateAuthIndAPI } from '../../../lib/auth-ind/updateAuthIndAPI';
import { signOut } from '../../../lib/signOut';

export default function EditExistingAuthIndModal({ isOpen, onClose, userInfo, onSaveSuccess }) {
    const { appConfig } = useContext(ConfigContext);
    const [apiState, setApiState] = useState('idle');
    const [apiError, setApiError] = useState(null);
    const [showDelegateFields, setShowDelegateFields] = useState(
        userInfo.delegate && Object.keys(userInfo.delegate).length > 0
    );

    // State and refs for email change confirmation
    const { 
        isOpen: isConfirmOpen, 
        onOpen: onConfirmOpen, 
        onClose: onConfirmClose 
    } = useDisclosure();
    const cancelRef = useRef();
    const [formDataForConfirmation, setFormDataForConfirmation] = useState(null);

    const { register, handleSubmit, setValue, reset, watch, formState: { errors } } = useForm({
        defaultValues: {
            fullname: userInfo.fullname || '',
            title: userInfo.title || '',
            email: userInfo.email || '',
            phone_number: userInfo.phone_number || '',
            delegate_fullname: userInfo.delegate?.fullname || '',
            delegate_title: userInfo.delegate?.title || '',
            delegate_email: userInfo.delegate?.email || '',
            delegate_phone: userInfo.delegate?.phone_number || ''
        }
    });

    // Store submitted data to accurately detect email changes after submission
    const [submittedData, setSubmittedData] = useState(null);

    // Watch the email field to detect changes
    const watchEmail = watch("email");
    
    // Compare against submitted data if available, otherwise use original userInfo
    const isEmailChanged = submittedData 
        ? watchEmail !== userInfo.email 
        : watchEmail !== userInfo.email;

    // Only reset form when modal is first opened
    useEffect(() => {
        if (isOpen) {
            reset({
                fullname: userInfo.fullname || '',
                title: userInfo.title || '',
                email: userInfo.email || '',
                phone_number: userInfo.phone_number || '',
                delegate_fullname: userInfo.delegate?.fullname || '',
                delegate_title: userInfo.delegate?.title || '',
                delegate_email: userInfo.delegate?.email || '',
                delegate_phone: userInfo.delegate?.phone_number || ''
            });
            setShowDelegateFields(userInfo.delegate && Object.keys(userInfo.delegate).length > 0);
        }
    }, [isOpen]); // Only depend on isOpen, not userInfo

    const toggleDelegateFields = () => {
        setShowDelegateFields(!showDelegateFields);
        if (!showDelegateFields) {
            // Restore delegate values when showing fields
            setValue('delegate_fullname', userInfo.delegate?.fullname || '');
            setValue('delegate_title', userInfo.delegate?.title || '');
            setValue('delegate_email', userInfo.delegate?.email || '');
            setValue('delegate_phone', userInfo.delegate?.phone_number || '');
        } else {
            // Clear delegate values when hiding fields
            setValue('delegate_fullname', '');
            setValue('delegate_title', '');
            setValue('delegate_email', '');
            setValue('delegate_phone', '');
        }
    };

    // Initial form submission - shows confirmation if email changed
    const onSubmit = async (data) => {
        if (data.email !== userInfo.email) {
            console.log('Email changed, opening confirmation');
            setFormDataForConfirmation(data);
            onConfirmOpen();
        } else {
            await processSubmission(data);
        }
    };

    // Actual submission after confirmation if needed
    const processSubmission = async (data) => {
        setApiState('loading');
        setApiError(null);

        try {
            const accessToken = Cookies.get('EttAccessJwt');
            
            // Structure the data to match the API expectations
            const submitData = {
                email: userInfo.email, // Use original email for identification
                new_email: data.email, // Use form email as new_email
                entity_id: userInfo.entity.entity_id,
                fullname: data.fullname,
                title: data.title,
                phone_number: data.phone_number,
                role: 'RE_AUTH_IND'
            };

            // Add delegate object if delegate fields are shown
            if (showDelegateFields) {
                submitData.delegate = {
                    fullname: data.delegate_fullname,
                    title: data.delegate_title,
                    email: data.delegate_email,
                    phone_number: data.delegate_phone
                };
            }

            const response = await updateAuthIndAPI(appConfig, accessToken, submitData);

            if (response.payload.ok) {
                setSubmittedData(submitData);
                setApiState('success');
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
        if (apiState === 'success' && submittedData && submittedData.new_email !== userInfo.email) {
            signOut(appConfig.cognitoDomain, appConfig.authorizedIndividual.cognitoID);
            return;
        }

        // Reset all state only after modal is actually closed
        onClose();
        
        // Reset form and state after checking for email change
        reset({
            fullname: userInfo.fullname || '',
            title: userInfo.title || '',
            email: userInfo.email || '',
            phone_number: userInfo.phone_number || '',
            delegate_fullname: userInfo.delegate?.fullname || '',
            delegate_title: userInfo.delegate?.title || '',
            delegate_email: userInfo.delegate?.email || '',
            delegate_phone: userInfo.delegate?.phone_number || ''
        });
        setShowDelegateFields(userInfo.delegate && Object.keys(userInfo.delegate).length > 0);
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
                        <ModalHeader>Edit Personal Details</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Box mb="6">
                                <Heading as="h4" size="sm" mb="4">Your Information</Heading>
                                <FormControl mb="4" isInvalid={errors.fullname}>
                                    <FormLabel>Full Name</FormLabel>
                                    <Input
                                        {...register('fullname', {
                                            required: 'Full name is required'
                                        })}
                                        isDisabled={apiState === 'success'}
                                    />
                                    <FormErrorMessage>{errors.fullname?.message}</FormErrorMessage>
                                </FormControl>
                                <FormControl mb="4" isInvalid={errors.title}>
                                    <FormLabel>Title</FormLabel>
                                    <Input
                                        {...register('title', {
                                            required: 'Title is required'
                                        })}
                                        isDisabled={apiState === 'success'}
                                    />
                                    <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
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

                            <Divider my="4" />

                            <Box>
                                <HStack justify="space-between" mb="4">
                                    <Heading as="h4" size="sm">Delegated Contact</Heading>
                                    <Button
                                        onClick={toggleDelegateFields}
                                        leftIcon={showDelegateFields ? <AiOutlineClose/> : null}
                                        size="sm"
                                        isDisabled={apiState === 'success'}
                                    >
                                        {showDelegateFields ? 'Remove Delegated Contact' : 'Add Delegated Contact'}
                                    </Button>
                                </HStack>

                                {showDelegateFields && (
                                    <>
                                        <FormControl mb="4" isInvalid={errors.delegate_fullname}>
                                            <FormLabel>Full Name</FormLabel>
                                            <Input
                                                {...register('delegate_fullname', {
                                                    required: showDelegateFields ? 'Delegate full name is required' : false
                                                })}
                                                isDisabled={apiState === 'success'}
                                            />
                                            <FormErrorMessage>{errors.delegate_fullname?.message}</FormErrorMessage>
                                        </FormControl>
                                        <FormControl mb="4" isInvalid={errors.delegate_title}>
                                            <FormLabel>Title</FormLabel>
                                            <Input
                                                {...register('delegate_title', {
                                                    required: showDelegateFields ? 'Delegate title is required' : false
                                                })}
                                                isDisabled={apiState === 'success'}
                                            />
                                            <FormErrorMessage>{errors.delegate_title?.message}</FormErrorMessage>
                                        </FormControl>
                                        <FormControl mb="4" isInvalid={errors.delegate_email}>
                                            <FormLabel>Email</FormLabel>
                                            <Input
                                                {...register('delegate_email', {
                                                    required: showDelegateFields ? 'Delegate email is required' : false,
                                                    pattern: {
                                                        value: emailRegex,
                                                        message: 'Invalid email address'
                                                    }
                                                })}
                                                isDisabled={apiState === 'success'}
                                            />
                                            <FormErrorMessage>{errors.delegate_email?.message}</FormErrorMessage>
                                        </FormControl>
                                        <FormControl mb="4" isInvalid={errors.delegate_phone}>
                                            <FormLabel>Phone Number</FormLabel>
                                            <Input
                                                {...register('delegate_phone', {
                                                    required: showDelegateFields ? 'Delegate phone number is required' : false
                                                })}
                                                isDisabled={apiState === 'success'}
                                            />
                                            <FormErrorMessage>{errors.delegate_phone?.message}</FormErrorMessage>
                                        </FormControl>
                                    </>
                                )}
                            </Box>

                            {apiState === 'success' && isEmailChanged &&
                                <VStack mb="4">
                                    <Alert status='success'>
                                        <AlertIcon />
                                        <Box>
                                            <Text>Changes saved successfully. Because you changed your email:</Text>
                                            <Text mt="2">1. Your current account will be logged out</Text>
                                            <Text>2. Check your new email for temporary password</Text>
                                            <Text>3. You&apos;ll need to login with your new credentials</Text>
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
                                    {apiState !== 'error' ? 'Save Changes' : 'Sorry'}
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
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            Confirm Email Change
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            <Text mb="4">
                                Changing your email address will:
                            </Text>
                            <UnorderedList spacing={2}>
                                <ListItem>Create a new account with your new email</ListItem>
                                <ListItem>Send temporary password to your new email</ListItem>
                                <ListItem>Log you out of your current account</ListItem>
                                <ListItem>Require you to log in with your new credentials</ListItem>
                            </UnorderedList>
                            <Text mt="4">
                                Are you sure you want to proceed?
                            </Text>
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onConfirmClose}>
                                Cancel
                            </Button>
                            <Button colorScheme='blue' onClick={() => {
                                onConfirmClose();
                                processSubmission(formDataForConfirmation);
                            }} ml={3}>
                                Continue
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
}

EditExistingAuthIndModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    userInfo: PropTypes.shape({
        fullname: PropTypes.string,
        title: PropTypes.string,
        email: PropTypes.string,
        phone_number: PropTypes.string,
        entity: PropTypes.shape({
            entity_id: PropTypes.string
        }),
        delegate: PropTypes.shape({
            fullname: PropTypes.string,
            title: PropTypes.string,
            email: PropTypes.string,
            phone_number: PropTypes.string
        })
    }).isRequired,
    onSaveSuccess: PropTypes.func.isRequired
};
