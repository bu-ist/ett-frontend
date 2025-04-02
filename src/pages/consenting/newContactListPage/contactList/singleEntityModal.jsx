import { useState } from 'react';
import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure, ButtonGroup } from "@chakra-ui/react";

import { HiOutlineChevronLeft } from "react-icons/hi";
import { AiOutlineClose } from 'react-icons/ai';

import ContactSummaryCard from './singleEntityModal/contactSummaryCard'

export default function SingleEntityModal({ contacts, setSingleEntityFormsSigned }) {
    // UI State
    const { isOpen, onOpen, onClose } = useDisclosure();
    
    // Navigation state
    const [currentIndex, setCurrentIndex] = useState(0);

    // Navigation handlers
    const handleNext = () => {
        if (currentIndex < contacts.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handleBack = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    // Reset index when modal closes
    const handleClose = () => {
        setCurrentIndex(0);
        onClose();
    };

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
                                onClick={handleNext}
                                isDisabled={currentIndex === contacts.length - 1}
                            >
                                Next
                            </Button>
                        </ButtonGroup>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
