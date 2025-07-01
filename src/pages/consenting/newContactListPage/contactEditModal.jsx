import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Stack, FormControl, FormLabel, FormErrorMessage, FormHelperText, Input, RadioGroup, Radio, Select } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import PropTypes from 'prop-types';
import { useEffect } from 'react';

export default function ContactEditModal({ 
    isOpen, 
    onClose, 
    isEditOrAdd, 
    formConstraint, 
    contact, 
    removeContact, 
    handleContactChange, 
    correctionsMode = false 
}) {
    // Initialize form with contact data
    const {
        handleSubmit,
        register,
        formState: { errors },
        watch,
        reset
    } = useForm({
        defaultValues: {
            organizationName: contact.organizationName || "",
            organizationType: contact.organizationType || "",
            contactName: contact.contactName || "",
            contactTitle: contact.contactTitle || "",
            contactEmail: contact.contactEmail || "",
            contactPhone: contact.contactPhone || "",
        }
    });

    // Reset form when contact changes to ensure form values are updated
    useEffect(() => {
        reset({
            organizationName: contact.organizationName || "",
            organizationType: contact.organizationType || "",
            contactName: contact.contactName || "",
            contactTitle: contact.contactTitle || "",
            contactEmail: contact.contactEmail || "",
            contactPhone: contact.contactPhone || "",
        });
    }, [contact, reset]);

    const selectedOrgType = watch('organizationType');

    // Define label for organization type
    const orgTypeLabel = {
        EMPLOYER: 'Current Employer',
        EMPLOYER_PRIOR: 'Prior Employer',
        ACADEMIC: 'Academic / Professional Organization',
        OTHER: 'Other Organization',
    };


    // Add a mapping for the employer constraint messages.
    // This got unreferenced and may need some additional attention.
    const constraintTypeLabel = {
        'current': 'Current Employer',
        'other': 'Prior Employer',
        'both': 'Employer'
    };

    function handleCancel() {
        removeContact(contact.id);
        onClose();
    }

    // Handle modal close
    function handleModalClose() {
        if (isEditOrAdd === 'add') {
            // If we're adding a new contact, treat close as cancel
            handleCancel();
        } else {
            // If we're editing an existing contact, just close the modal
            onClose();
        }
    }

    // This function will update the parent state when form is submitted
    function onSubmit(data) {
        // Just pass the complete form data to the parent - no need for synthetic events
        handleContactChange(contact.id, data);
        onClose();
    };
        
    return (
        <Modal
            isOpen={isOpen}
            onClose={handleModalClose}
            size="4xl"
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    {isEditOrAdd === 'add' && 'Add'} {isEditOrAdd === 'edit' && 'Edit'} {' '}
                    {selectedOrgType 
                        ? orgTypeLabel[selectedOrgType] 
                        : 'Contact'
                    }
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <form id="contact-form" onSubmit={handleSubmit(onSubmit)}>
                        {correctionsMode && (
                            <FormControl mb="4" isInvalid={errors.organizationType}>
                                <FormLabel>Organization Type</FormLabel>
                                <Select
                                    id="organizationType"
                                    placeholder="Select organization type"
                                    {...register('organizationType', {
                                        required: 'Organization type is required',
                                    })}
                                >
                                    {(!formConstraint || formConstraint === 'both' || formConstraint === 'current') && (
                                        <option value="EMPLOYER">Current Employer</option>
                                    )}
                                    {(!formConstraint || formConstraint === 'both' || formConstraint === 'other') && (
                                        <option value="EMPLOYER_PRIOR">Prior Employer</option>
                                    )}
                                    <option value="ACADEMIC">Academic / Professional Organization</option>
                                    <option value="OTHER">Other Organization</option>
                                </Select>
                                {errors.organizationType && (
                                    <FormErrorMessage>{errors.organizationType.message}</FormErrorMessage>
                                )}
                            </FormControl>
                        )}
                        
                        <FormControl mb="4" isInvalid={errors.organizationName}>
                            <FormLabel>Organization Name (No Acronyms)</FormLabel>
                            <Input
                                id="organizationName"
                                name="organizationName"
                                placeholder="Organization Name"
                                {...register('organizationName', {
                                    required: 'Organization name is required',
                                })}
                            />
                            {!errors.organizationName ? (
                                <FormHelperText>Enter the full organization name without acronyms</FormHelperText>
                            ) : (
                                <FormErrorMessage>{errors.organizationName.message}</FormErrorMessage>
                            )}
                        </FormControl>
                        
                        <FormControl mb="4" isInvalid={errors.contactName}>
                            <FormLabel>Contact Name</FormLabel>
                            <Input
                                id="contactName"
                                name="contactName"
                                placeholder="Contact Name"
                                {...register('contactName', {
                                    required: 'Contact name is required',
                                })}
                            />
                            {!errors.contactName ? (
                                <FormHelperText>&nbsp;</FormHelperText>
                            ) : (
                                <FormErrorMessage>{errors.contactName.message}</FormErrorMessage>
                            )}
                        </FormControl>
                        
                        <FormControl mb="4" isInvalid={errors.contactTitle}>
                            <FormLabel>Contact Title</FormLabel>
                            <Input
                                id="contactTitle"
                                name="contactTitle"
                                placeholder="Contact Title"
                                {...register('contactTitle')}
                            />
                            <FormHelperText>&nbsp;</FormHelperText>
                        </FormControl>
                        
                        <FormControl mb="4" isInvalid={errors.contactEmail}>
                            <FormLabel>Contact Email</FormLabel>
                            <Input
                                id="contactEmail"
                                name="contactEmail"
                                type="email"
                                placeholder="Email"
                                isReadOnly={correctionsMode && isEditOrAdd === 'edit'}
                                {...register('contactEmail', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                        message: 'Invalid email address',
                                    },
                                })}
                            />
                            {!errors.contactEmail ? (
                                <FormHelperText>
                                    {correctionsMode && isEditOrAdd === 'edit'
                                        ? 'Email cannot be changed. Delete this contact and add a new one if needed.'
                                        : '\u00A0'
                                    }
                                </FormHelperText>
                            ) : (
                                <FormErrorMessage>{errors.contactEmail.message}</FormErrorMessage>
                            )}
                        </FormControl>
                        
                        <FormControl mb="4" isInvalid={errors.contactPhone}>
                            <FormLabel>Contact Phone</FormLabel>
                            <Input
                                id="contactPhone"
                                name="contactPhone"
                                type="tel"
                                placeholder="Phone Number"
                                {...register('contactPhone', {
                                    required: 'Phone number is required',
                                })}
                            />
                            {!errors.contactPhone ? (
                                <FormHelperText>&nbsp;</FormHelperText>
                            ) : (
                                <FormErrorMessage>{errors.contactPhone.message}</FormErrorMessage>
                            )}  
                        </FormControl>
                    </form>
                </ModalBody>
                <ModalFooter>
                    <Button mr="4" onClick={handleModalClose}>
                        Cancel
                    </Button>
                    <Button type="submit" form="contact-form" colorScheme="blue">
                        Done
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

ContactEditModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    isEditOrAdd: PropTypes.oneOf(['edit', 'add']).isRequired,
    formConstraint: PropTypes.oneOf(['current', 'other', 'both']),
    contact: PropTypes.shape({
        id: PropTypes.string.isRequired,
        organizationName: PropTypes.string,
        organizationType: PropTypes.string,
        contactName: PropTypes.string,
        contactTitle: PropTypes.string,
        contactEmail: PropTypes.string,
        contactPhone: PropTypes.string,
    }).isRequired,
    removeContact: PropTypes.func.isRequired,
    handleContactChange: PropTypes.func.isRequired,
    correctionsMode: PropTypes.bool,
};
