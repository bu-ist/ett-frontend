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
 * Note: Email field is disabled as email changes require a different workflow
 */
import { 
    Modal, ModalOverlay, ModalContent, ModalHeader, 
    ModalFooter, ModalBody, Button, FormControl,
    FormLabel, Input, Box, Heading, Alert, AlertIcon,
    Divider, HStack, FormErrorMessage, Text
} from "@chakra-ui/react";
import { AiOutlineClose } from 'react-icons/ai';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useState, useContext } from 'react';
import { emailRegex } from '../../../lib/formatting/emailRegex';
import Cookies from 'js-cookie';
import { ConfigContext } from '../../../lib/configContext';
import { updateAuthIndAPI } from '../../../lib/auth-ind/updateAuthIndAPI';

export default function EditExistingAuthIndModal({ isOpen, onClose, userInfo, onSaveSuccess }) {
    const { appConfig } = useContext(ConfigContext);
    const [apiStatus, setApiStatus] = useState('idle');
    const [apiError, setApiError] = useState(null);
    const [showDelegateFields, setShowDelegateFields] = useState(
        userInfo.delegate && Object.keys(userInfo.delegate).length > 0
    );

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
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

    const onSubmit = async (data) => {
        setApiStatus('loading');
        setApiError(null);

        try {
            const accessToken = Cookies.get('EttAccessJwt');
            
            // Structure the data to match the API expectations
            const submitData = {
                email: data.email,
                new_email: data.email, // Since email changes aren't allowed in this form
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

            // Send the data to the API.
            const response = await updateAuthIndAPI(appConfig, accessToken, submitData);

            if (response.payload.ok) {
                setApiStatus('success');
                onSaveSuccess(submitData);
            } else {
                throw new Error(response.message || 'Failed to update user information');
            }
        } catch (error) {
            console.error('Error saving changes:', error);
            setApiStatus('error');
            setApiError(error.message || 'An error occurred while saving changes');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalOverlay />
            <ModalContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <ModalHeader>Edit Contact Information</ModalHeader>
                    <ModalBody>
                        <Box mb="6">
                            <Heading as="h4" size="sm" mb="4">Your Information</Heading>
                            <FormControl mb="4" isInvalid={errors.fullname}>
                                <FormLabel>Full Name</FormLabel>
                                <Input
                                    {...register('fullname', {
                                        required: 'Full name is required'
                                    })}
                                />
                                <FormErrorMessage>{errors.fullname?.message}</FormErrorMessage>
                            </FormControl>
                            <FormControl mb="4" isInvalid={errors.title}>
                                <FormLabel>Title</FormLabel>
                                <Input
                                    {...register('title', {
                                        required: 'Title is required'
                                    })}
                                />
                                <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
                            </FormControl>
                            <FormControl mb="4" isDisabled>
                                <FormLabel>Email</FormLabel>
                                <Input
                                    {...register('email')}
                                />
                            </FormControl>
                            <FormControl mb="4" isInvalid={errors.phone_number}>
                                <FormLabel>Phone Number</FormLabel>
                                <Input
                                    {...register('phone_number', {
                                        required: 'Phone number is required'
                                    })}
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
                                        />
                                        <FormErrorMessage>{errors.delegate_fullname?.message}</FormErrorMessage>
                                    </FormControl>
                                    <FormControl mb="4" isInvalid={errors.delegate_title}>
                                        <FormLabel>Title</FormLabel>
                                        <Input
                                            {...register('delegate_title', {
                                                required: showDelegateFields ? 'Delegate title is required' : false
                                            })}
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
                                        />
                                        <FormErrorMessage>{errors.delegate_email?.message}</FormErrorMessage>
                                    </FormControl>
                                    <FormControl mb="4" isInvalid={errors.delegate_phone}>
                                        <FormLabel>Phone Number</FormLabel>
                                        <Input
                                            {...register('delegate_phone', {
                                                required: showDelegateFields ? 'Delegate phone number is required' : false
                                            })}
                                        />
                                        <FormErrorMessage>{errors.delegate_phone?.message}</FormErrorMessage>
                                    </FormControl>
                                </>
                            )}
                        </Box>

                        {apiStatus === 'error' && (
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
                                        Please close this form and try again. If the problem persists,
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
                            onClick={onClose}
                        >
                            {apiStatus === 'error' ? 'Close' : 'Cancel'}
                        </Button>
                        <Button 
                            colorScheme="blue"
                            type="submit"
                            isLoading={apiStatus === 'loading'}
                            isDisabled={apiStatus === 'error'}
                        >
                            Save Changes
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
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
        delegate: PropTypes.shape({
            fullname: PropTypes.string,
            title: PropTypes.string,
            email: PropTypes.string,
            phone_number: PropTypes.string
        })
    }).isRequired,
    onSaveSuccess: PropTypes.func.isRequired
};