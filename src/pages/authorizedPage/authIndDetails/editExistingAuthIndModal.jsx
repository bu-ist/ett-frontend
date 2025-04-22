import { 
    Modal, ModalOverlay, ModalContent, ModalHeader, 
    ModalFooter, ModalBody, Button, FormControl,
    FormLabel, Input, Box, Heading, Alert, AlertIcon,
    Divider, HStack, FormErrorMessage
} from "@chakra-ui/react";
import { AiOutlineClose } from 'react-icons/ai';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useState, useContext } from 'react';
import { emailRegex } from '../../../lib/formatting/emailRegex';
import Cookies from 'js-cookie';
import { ConfigContext } from '../../../lib/configContext';

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
            
            // Remove delegate fields if not showing delegate section
            const submitData = { ...data };
            if (!showDelegateFields) {
                delete submitData.delegate_fullname;
                delete submitData.delegate_title;
                delete submitData.delegate_email;
                delete submitData.delegate_phone;
            }

            // TODO: Replace with actual API call
            // const response = await updateAuthIndAPI(appConfig.authorizedIndividual.apiHost, appConfig.apiStage, accessToken, submitData);
            
            // Simulate API call for now
            await new Promise(resolve => setTimeout(resolve, 1000));
            const response = { ok: true };

            if (response.ok) {
                setApiStatus('success');
                onSaveSuccess(submitData);
            } else {
                throw new Error('Failed to update user information');
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
                                {apiError || 'There was an error saving your changes'}
                            </Alert>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button 
                            colorScheme="blue" 
                            type="submit"
                            isLoading={apiStatus === 'loading'}
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