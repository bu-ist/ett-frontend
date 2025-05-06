import { useState } from 'react';
import { useDisclosure, Button, Modal, ModalOverlay, ModalHeader, ModalContent, ModalCloseButton, ModalBody, ModalFooter, Spinner, Text, Alert, AlertIcon } from '@chakra-ui/react';
import PropTypes from 'prop-types';

export default function EmailConsentModal({ email }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [apiState, setApiState] = useState('idle');

    // Handler for sending email - to be implemented when API is ready
    function handleEmailConsent() {
        if (apiState === 'success') {
            setApiState('idle');
            onClose();
            return;
        }

        // Temporarily just show success state since API isn't implemented
        setApiState('loading');
        setTimeout(() => setApiState('success'), 1000);
    }

    function handleClose() {
        setApiState('idle');
        onClose();
    }

    return (
        <>
            <Button onClick={onOpen}>Email</Button>
            <Modal isOpen={isOpen} onClose={handleClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Email Consent Form</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {(apiState === 'idle' || apiState === 'loading') && 
                            <Text>
                                Send a copy of your consent form to {email}?
                            </Text>
                        }
                        {apiState === 'success' && 
                            <Alert status='success'>
                                <AlertIcon />
                                <Text>
                                    Consent form has been emailed to {email}
                                </Text>
                            </Alert>
                        }
                        {apiState === 'error' && 
                            <Alert status='error'>
                                <AlertIcon />
                                <Text>
                                    There was an error sending the email. Please try again.
                                </Text>
                            </Alert>
                        }
                    </ModalBody>
                    <ModalFooter>
                        {apiState === 'idle' &&
                            <Button colorScheme="blue" mr={3} onClick={handleClose}>
                                Cancel
                            </Button>
                        }
                        <Button onClick={handleEmailConsent}>
                            {apiState === 'idle' && 'Send Email'}
                            {apiState === 'loading' && <Spinner />}
                            {apiState === 'error' && 'Error'}
                            {apiState === 'success' && 'OK'}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

EmailConsentModal.propTypes = {
    email: PropTypes.string.isRequired
};