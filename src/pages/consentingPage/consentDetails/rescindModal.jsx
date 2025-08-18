import { useState, useContext } from 'react';
import Cookies from 'js-cookie';
import { useDisclosure, Button, Modal, ModalOverlay, ModalHeader, ModalContent, ModalCloseButton, ModalBody, ModalFooter, Code, Text, VStack, Alert, AlertIcon, AlertTitle, AlertDescription, ButtonGroup } from "@chakra-ui/react";

import { rescindConsentAPI } from '../../../lib/consenting/rescindConsentAPI';
import { signOut } from '../../../lib/signOut';

import { ConfigContext } from '../../../lib/configContext';

export default function RescindModal( { email }) {
    const { appConfig } = useContext(ConfigContext);

    // UI State
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [apiState, setApiState] = useState('idle');
    const [apiError, setApiError] = useState(null);

    async function processRescind() {
        console.log('Rescinding consent for email ', email);

        // Get the access token from the cookies.
        const accessToken = Cookies.get('EttAccessJwt');

        setApiState('loading');

        // Send the rescind request to the API.
        const rescindResult = await rescindConsentAPI(appConfig, accessToken, email);
        console.log(JSON.stringify(rescindResult));

        if (rescindResult.payload?.ok) {
            console.log('Rescind successful');
            setApiState('success');
        } else {
            setApiState('error');
            setApiError(rescindResult.message);
        }
    }

    function handleClose() {
        onClose();

        // If we successfully rescinded consent, log the user out.
        if (apiState === 'success') {
            Cookies.remove('EttAccessJwt');
            Cookies.remove('EttIdJwt');

            // Sign out results in an immediate redirect to the logout page, so nothing else will
            const { cognitoDomain, consentingPerson: { cognitoID } } = appConfig;
            signOut(cognitoDomain, cognitoID);
        }
    }

    return (
        <>
            <Button onClick={onOpen}>Rescind</Button>
            <Modal size="lg" isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Rescind Consent</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text mb="4">
                            Click &quot;Rescind&quot; to terminate the consent of <Code>{email}</Code> on a going forward basis, 
                            subject to the applicable exception. Access to your Consent Form will no longer be available for use 
                            by ETT Registered Entities to request disclosures not already made at the time of your rescission. 
                            You will be logged out. 
                        </Text>
                        {apiState === 'success' &&
                            <VStack mb="4">
                                <Alert status='success'>
                                    <AlertIcon />
                                    <Text>Consent rescinded successfully.</Text>
                                </Alert>
                            </VStack>
                        }
                        {apiState === 'error' &&
                            <VStack mb="4">
                                <Alert status='error'>
                                    <AlertIcon />
                                    <AlertTitle>Error rescinding consent</AlertTitle>
                                    <AlertDescription>{apiError ? apiError : 'Unknown Error, API not responsive'}</AlertDescription>
                                </Alert>
                            </VStack>
                        }
                    </ModalBody>
                    <ModalFooter>
                        {apiState !== 'success' && apiState !== 'error' &&
                            <ButtonGroup spacing="4">
                                <Button onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button 
                                    onClick={processRescind}
                                    isLoading={apiState === 'loading'}
                                >
                                    Rescind
                                </Button>
                            </ButtonGroup>
                        }
                        {apiState === 'success' &&
                            <Button onClick={handleClose}>Goodbye</Button>
                        }
                        {apiState === 'error' &&
                            <Button onClick={handleClose}>Sorry, try reloading</Button>
                        }
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
