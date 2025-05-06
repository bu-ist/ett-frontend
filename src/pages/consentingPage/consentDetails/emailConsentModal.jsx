import { useState, useContext } from 'react';
import Cookies from 'js-cookie';
import { useDisclosure, Button, Modal, ModalOverlay, ModalHeader, ModalContent, ModalCloseButton, ModalBody, ModalFooter, Spinner, Text, Alert, AlertIcon, Link } from '@chakra-ui/react';
import PropTypes from 'prop-types';

import { ConfigContext } from "../../../lib/configContext";
import { emailConsentAPI } from "../../../lib/consenting/emailConsentAPI";

export default function EmailConsentModal({ email, variant = 'button' }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { appConfig } = useContext(ConfigContext);
    const [apiState, setApiState] = useState('idle');

    // Handler for sending email
    function handleEmailConsent() {
        // Use same button to acknowledge success and close modal
        if (apiState === 'success') {
            setApiState('idle');
            onClose();
            return;
        }

        // Need to declare an async function to handle the API call
        async function sendEmail() {
            setApiState('loading');

            // Get the access token from cookies
            const accessToken = Cookies.get('EttAccessJwt');

            // Call the emailConsentAPI function
            const emailResult = await emailConsentAPI(appConfig, accessToken, email);

            // Set the UI state based on the result
            if (emailResult.message === 'Ok') {
                setApiState('success');
            } else {
                setApiState('error');
                console.error(emailResult);
            }
        }
        sendEmail();
    }

    function handleClose() {
        setApiState('idle');
        onClose();
    }

    const trigger = variant === 'button' ? (
        <Button onClick={onOpen}>Email</Button>
    ) : (
        <Link textDecoration="underline" onClick={onOpen}>available here</Link>
    );

    return (
        <>
            {trigger}
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
                            <Button mr={3} onClick={handleClose}>
                                Cancel
                            </Button>
                        }
                        <Button colorScheme="blue" onClick={handleEmailConsent}>
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
    email: PropTypes.string.isRequired,
    variant: PropTypes.oneOf(['button', 'link'])
};