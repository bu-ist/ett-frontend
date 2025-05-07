import { 
    Modal, ModalOverlay, ModalContent, ModalHeader, 
    ModalFooter, ModalBody, Button, FormControl,
    FormLabel, Input, Box, Alert, AlertIcon,
    FormErrorMessage, Text, VStack
} from "@chakra-ui/react";
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useState, useContext, useEffect } from 'react';
import { emailRegex } from '../../../lib/formatting/emailRegex';
import { ConfigContext } from '../../../lib/configContext';

export default function EditConsentDetailsModal({ isOpen, onClose, consenter, onSaveSuccess }) {
    const { appConfig } = useContext(ConfigContext);
    const [apiState, setApiState] = useState('idle');
    const [apiError, setApiError] = useState(null);

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
    const isEmailChanged = watchEmail !== consenter.email;

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
        // Will implement API call in next step
        console.log('Form submitted:', data);
    };

    function handleClose() {
        onClose();
        reset();
        setApiState('idle');
        setApiError(null);
    }

    return (
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