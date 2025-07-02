import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure, ButtonGroup, FormControl, FormErrorMessage, FormHelperText, FormLabel, Input, Link } from "@chakra-ui/react";
import { Link as ReactRouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';

import { HiOutlineChevronLeft } from "react-icons/hi";
import { AiOutlineClose } from 'react-icons/ai';

import ContactSummaryCard from './singleEntityModal/contactSummaryCard'

export default function SingleEntityModal({ contacts, setSingleEntityFormsSigned, isOpen, onOpen, onClose, handleContactChange }) {
    // Navigation state
    const [currentIndex, setCurrentIndex] = useState(0);

    // Setup the digital signature form
    const { handleSubmit, register, formState: { errors }, reset, setValue, getValues } = useForm({
        defaultValues: {
            signature: '',
        }
    });

    // Update form value when currentContact changes
    useEffect(() => {
        const currentContact = contacts[currentIndex];
        if (currentContact) {
            setValue('signature', currentContact.consenter_signature || '');
        }
    }, [currentIndex, contacts, setValue]);

    // Save the current signature to the contact
    const saveCurrentSignature = () => {
        const values = getValues();
        if (values.signature) {
            handleContactChange(currentContact.id, {
                ...currentContact,
                consenter_signature: values.signature
            });
        }
    };

    // Navigation handlers
    function handleNext(values) {
        // Store the signature for the current contact
        handleContactChange(currentContact.id, {
            ...currentContact,
            consenter_signature: values.signature
        });

        if (currentIndex < contacts.length - 1) {
            const nextContact = contacts[currentIndex + 1];
            setCurrentIndex(currentIndex + 1);
            
            // Only reset the signature if the next contact hasn't been signed yet
            if (!nextContact.consenter_signature) {
                reset({ signature: '' });
            }
        } else {
            // If this is the last contact, mark all forms as signed
            setSingleEntityFormsSigned(true);
            handleClose();
        }
    }

    function handleBack() {
        if (currentIndex > 0) {
            // Save the current signature before navigating back
            saveCurrentSignature();
            
            // Navigate to previous contact
            setCurrentIndex(currentIndex - 1);
            // Do not reset when going back - the useEffect will set the correct signature
        }
    }

    // Reset index when modal closes
    function handleClose() {
        // Save any unsaved signature before closing
        saveCurrentSignature();
        
        // Reset and close
        setCurrentIndex(0);
        reset({ signature: '' });
        onClose();
    }

    const currentContact = contacts[currentIndex];

    return (
        <>
            <Modal size="4xl" isOpen={isOpen} onClose={handleClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Single-Entity Exhibit Form</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {currentContact && (
                            <>
                                <Text fontSize="lg" fontWeight="bold" mb="4">
                                    Form {currentIndex + 1} of {contacts.length}
                                </Text>
                                <Text mb="4" fontWeight="semibold">
                                    This <u>&quot;Single-Entity Exhibit Form&quot;</u> is incorporated into my Consent Form, <Link as={ReactRouterLink} to="/consenting" textDecoration="underline">at link</Link>.  
                                    <u>I agree that my ETT Registration Form and Consent Form will remain in effect to 
                                    authorize the Disclosure Form that the following entity completes and provides in response 
                                    to the Disclosure Request sent with this Form. </u> The definitions in the Consent Form also apply 
                                    to this Single Entity Exhibit Form.  The following entity is one of my Consent Recipients (Affiliates) 
                                    referenced in and covered by my Consent Form:
                                </Text>
                                <ContactSummaryCard contact={currentContact} />
                                <Text mb="4">
                                    I agree that this electronic Single-Entity Exhibit Form and my electronic (digital) signature, and any copy will have the 
                                    same effect as originals for all purposes. <b>I have had the time to consider and consult anyone I wish on whether to provide 
                                    this Single Entity Exhibit Form.  I am at least 18 years old and it is my knowing and voluntary decision to sign and deliver 
                                    this Single Entity Exhibit Form.</b>
                                </Text>
                                <form onSubmit={handleSubmit(handleNext)}>
                                    <FormControl mt="8" isInvalid={errors.signature}>
                                        <FormLabel>Please type your full name (First Middle Last) to digitally sign this full Exhibit Form: </FormLabel>
                                        <Input
                                            id="signature"
                                            name="signature"
                                            placeholder="Type your name as your digital signature"
                                            {...register('signature', {
                                                required: 'Signature is required',
                                            })}
                                            type="text"
                                        />
                                        {!errors.signature ? (
                                            <FormHelperText>&nbsp;</FormHelperText>
                                        ) : (
                                            <FormErrorMessage>{errors.signature.message}</FormErrorMessage>
                                        )}
                                    </FormControl>
                                </form>
                                <Text my="4">
                                    Click the Next button to create, review, date, and digitally sign a Single-Entity Exhibit Form for each of your listed Consent Recipients. 
                                    You will not be able to submit any of your Exhibit Forms until you digitally sign all of them. 
                                </Text>
                            </>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <ButtonGroup spacing="4">
                            <Button 
                                mr="12"
                                leftIcon={<AiOutlineClose />}
                                onClick={handleClose}
                            >
                                Cancel
                            </Button>
                            <Button 
                                leftIcon={<HiOutlineChevronLeft />}
                                onClick={handleBack}
                                isDisabled={currentIndex === 0}
                            >
                                Back
                            </Button>
                            <Button 
                                onClick={handleSubmit(handleNext)}
                                isDisabled={currentIndex === contacts.length - 1 && Object.keys(errors).length > 0}
                            >
                                {currentIndex === contacts.length - 1 ? 'Submit' : 'Next'}
                            </Button>
                        </ButtonGroup>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

SingleEntityModal.propTypes = {
    contacts: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        organizationName: PropTypes.string.isRequired,
        organizationType: PropTypes.string.isRequired,
        contactName: PropTypes.string.isRequired,
        contactTitle: PropTypes.string,
        contactEmail: PropTypes.string.isRequired,
        contactPhone: PropTypes.string.isRequired,
        consenter_signature: PropTypes.string,
    })).isRequired,
    setSingleEntityFormsSigned: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onOpen: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    handleContactChange: PropTypes.func.isRequired,
};
