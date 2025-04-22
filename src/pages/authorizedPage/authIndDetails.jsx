import { 
    Heading, Card, Text, CardBody, HStack, Box, 
    StackDivider, Button, useDisclosure, Modal, ModalOverlay,
    ModalContent, ModalHeader, ModalFooter, ModalBody, FormControl,
    FormLabel, Input, Alert, AlertIcon, Divider
} from "@chakra-ui/react";
import { HiPencil } from "react-icons/hi";
import { AiOutlineClose } from 'react-icons/ai';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { emailRegex } from '../../lib/formatting/emailRegex';

export default function AuthIndDetails({ userInfo }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [apiStatus, setApiStatus] = useState('idle');
    
    // Check if userInfo.delegate exists and is not empty
    const hasDelegate = userInfo.delegate && Object.keys(userInfo.delegate).length > 0;
    const [showDelegateFields, setShowDelegateFields] = useState(hasDelegate);

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
        // TODO: Implement API call to update user info
        console.log('Form data to submit:', data);
        
        // For now just simulate API call
        setTimeout(() => {
            setApiStatus('success');
            setTimeout(() => {
                onClose();
                setApiStatus('idle');
            }, 1000);
        }, 1000);
    };

    return (
        <Card my="2em">
            <CardBody>
                <HStack align="top" spacing={16} divider={<StackDivider borderColor="gray.200" />}>
                    <Box>
                        <HStack justify="space-between" w="100%" mb="4">
                            <Heading as="h3" size="md">{userInfo.fullname}</Heading>
                            <Button
                                leftIcon={<HiPencil />}
                                size="sm"
                                onClick={onOpen}
                            >
                                Edit
                            </Button>
                        </HStack>
                        {userInfo.title && <Text>{userInfo.title}</Text>}
                        {userInfo.email && <Text>{userInfo.email}</Text>}
                        {userInfo.phone_number && <Text>{userInfo.phone_number}</Text>}
                    </Box>
                    {hasDelegate && 
                        <Box>
                            <Heading as="h4" size="sm">Delegated Contact</Heading>
                            <Text>{userInfo.delegate.fullname}</Text>
                            <Text>{userInfo.delegate.email}</Text>
                            <Text>{userInfo.delegate.phone_number}</Text>
                        </Box>
                    }
                </HStack>

                {/* Edit Modal */}
                <Modal isOpen={isOpen} onClose={onClose} size="lg">
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
                                    </FormControl>
                                    <FormControl mb="4" isInvalid={errors.title}>
                                        <FormLabel>Title</FormLabel>
                                        <Input
                                            {...register('title', {
                                                required: 'Title is required'
                                            })}
                                        />
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
                                            </FormControl>
                                            <FormControl mb="4" isInvalid={errors.delegate_title}>
                                                <FormLabel>Title</FormLabel>
                                                <Input
                                                    {...register('delegate_title', {
                                                        required: showDelegateFields ? 'Delegate title is required' : false
                                                    })}
                                                />
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
                                            </FormControl>
                                            <FormControl mb="4" isInvalid={errors.delegate_phone}>
                                                <FormLabel>Phone Number</FormLabel>
                                                <Input
                                                    {...register('delegate_phone', {
                                                        required: showDelegateFields ? 'Delegate phone number is required' : false
                                                    })}
                                                />
                                            </FormControl>
                                        </>
                                    )}
                                </Box>

                                {apiStatus === 'error' && (
                                    <Alert status="error" mt="4">
                                        <AlertIcon />
                                        There was an error saving your changes
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
            </CardBody>
        </Card>
    );
}

AuthIndDetails.propTypes = {
    userInfo: PropTypes.shape({
        fullname: PropTypes.string,
        title: PropTypes.string,
        email: PropTypes.string,
        phone_number: PropTypes.string,
        delegate: PropTypes.shape({
            fullname: PropTypes.string,
            email: PropTypes.string,
            phone_number: PropTypes.string,
            title: PropTypes.string
        })
    }).isRequired
};
