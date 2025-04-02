import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure, ButtonGroup, FormControl, FormErrorMessage, FormHelperText, FormLabel, Input } from "@chakra-ui/react";

import { HiOutlineChevronLeft } from "react-icons/hi";
import { AiOutlineClose } from 'react-icons/ai';

import ContactSummaryCard from './singleEntityModal/contactSummaryCard'

export default function SingleEntityModal({ contacts, setSingleEntityFormsSigned }) {
    // UI State
    const { isOpen, onOpen, onClose } = useDisclosure();
    
    // Navigation state
    const [currentIndex, setCurrentIndex] = useState(0);

    // Setup the digital signature form
    const { handleSubmit, register, formState: { errors }, reset } = useForm({
        defaultValues: {
            signature: '',
        }
    });

    // Navigation handlers
    function handleNext(values) {
        if (currentIndex < contacts.length - 1) {
            setCurrentIndex(currentIndex + 1);
            reset(); // Reset the form for the next contact
        } else {
            // If this is the last contact, mark all forms as signed
            setSingleEntityFormsSigned(true);
            handleClose();
        }
    }

    function handleBack() {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            reset(); // Reset the form when going back
        }
    }

    // Reset index when modal closes
    function handleClose() {
        setCurrentIndex(0);
        reset();
        onClose();
    }

    const currentContact = contacts[currentIndex];

    return (
        <>
            <Button
                onClick={onOpen}
            >
                Sign Single-Entity Forms
            </Button>
            <Modal size="4xl" isOpen={isOpen} onClose={handleClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Contact Information</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {currentContact && (
                            <>
                                <Text fontSize="lg" fontWeight="bold" mb="4">
                                    Contact {currentIndex + 1} of {contacts.length}
                                </Text>
                                <ContactSummaryCard contact={currentContact} />
                                <form onSubmit={handleSubmit(handleNext)}>
                                    <FormControl mt="4">
                                        <FormLabel>Digital Signature</FormLabel>
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
                                            <FormHelperText>Type your name here as your digital signature.</FormHelperText>
                                        ) : (
                                            <FormErrorMessage>{errors.signature.message}</FormErrorMessage>
                                        )}
                                        {/* This extra error message shouldn't be necessary, but for some reason the one above is not rendering */}
                                        {errors.signature && <Text color="red.500" mt="2">{errors.signature.message}</Text>}
                                    </FormControl>
                                </form>
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
                                {currentIndex === contacts.length - 1 ? 'Finish' : 'Next'}
                            </Button>
                        </ButtonGroup>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
