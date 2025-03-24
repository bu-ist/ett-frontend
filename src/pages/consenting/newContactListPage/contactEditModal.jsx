import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Stack, FormControl, FormLabel, FormErrorMessage, FormHelperText, Input, RadioGroup, Radio } from "@chakra-ui/react";
import { useForm } from "react-hook-form";

export default function ContactEditModal({ isOpen, onClose, isEditOrAdd, formConstraint, contact, removeContact, handleContactChange }) {
    // Initialize form with contact data
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm({
        defaultValues: {
            organizationName: contact.organizationName || "",
            organizationType: contact.organizationType, // organizationType should be set by the parent, and immutable.
            contactName: contact.contactName || "",
            contactTitle: contact.contactTitle || "",
            contactEmail: contact.contactEmail || "",
            contactPhone: contact.contactPhone || "",
        }
    });

    // Define label for organization type
    const orgTypeLabel = {
        EMPLOYER: 'Employer',
        ACADEMIC: 'Academic / Professional Organization',
        OTHER: 'Other Organization',
    };

    // Add a mapping for the employer constraint messages.
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
                    {contact.organizationType === 'EMPLOYER' 
                        ? constraintTypeLabel[formConstraint]
                        : orgTypeLabel[contact.organizationType]
                    } Contact
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <form id="contact-form" onSubmit={handleSubmit(onSubmit)}>
                        <FormControl mb="4" isInvalid={errors.organizationName}>
                            <FormLabel>Organization</FormLabel>
                            <Input
                                id="organizationName"
                                name="organizationName"
                                placeholder="Organization Name"
                                {...register('organizationName', {
                                    required: 'Organization name is required',
                                })}
                            />
                            {!errors.organizationName ? (
                                <FormHelperText>Enter the full organization name</FormHelperText>
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
                                {...register('contactEmail', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                        message: 'Invalid email address',
                                    },
                                })}
                            />
                            {!errors.contactEmail ? (
                                <FormHelperText>&nbsp;</FormHelperText>
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
                    <Button type="submit" form="contact-form">
                        Done
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
