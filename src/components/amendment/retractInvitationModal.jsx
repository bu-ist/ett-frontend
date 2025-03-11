import { useState, useContext } from 'react';
import Cookies from 'js-cookie';
import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalFooter, ModalOverlay, useDisclosure, Text, VStack, Alert, AlertIcon, ButtonGroup, AlertTitle, AlertDescription, Code } from '@chakra-ui/react';

import { AiOutlineClose } from 'react-icons/ai';

import { ConfigContext } from "../../lib/configContext";

import { retractInvitationAI } from '../../lib/amendment/retractInvitationAI';

export default function RetractInvitationModal({ inviteCode, fetchData }) {
    const { appConfig } = useContext(ConfigContext);

    // UI State
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [apiState, setApiState] = useState('idle');

    const [apiError, setApiError] = useState(null);

    async function processInviteRetraction() {

        console.log('Retracting invite code ', inviteCode);

        // Get the access token from the cookies.
        const accessToken = Cookies.get('EttAccessJwt');

        setApiState('loading');

        // Send the retraction request to the API.
        const retractionResult = await retractInvitationAI(appConfig, accessToken, inviteCode);
        console.log(JSON.stringify(retractionResult));

        if (retractionResult.payload?.ok) {
            console.log('Invitation Retraction successful');

            setApiState('success');
        } else {
            setApiState('error');
            setApiError(retractionResult.message);
        }
    }

    function handleClose() {
        onClose();
        
        // To reflect the changes in the UI, trigger a re-fetch of the entity data.
        if (apiState === 'success' || apiState === 'error') {
            fetchData();
        }
        setApiState('idle');
    }

    return (
        <>
            <Button leftIcon={<AiOutlineClose />} onClick={onOpen}>Retract Invitation</Button>
            <Modal size="xl" isOpen={isOpen} onClose={handleClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Retract Invitation</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text mb="4">
                            Are you sure you want to retract the invitation with code <Code>{inviteCode}</Code>?
                        </Text>
                        <Text mb="4">
                            You will have 30 days to send a new invitation.
                        </Text>
                        
                        {apiState === 'success' &&
                            <VStack mb="4">
                                <Alert status='success'>
                                    <AlertIcon />
                                    Invitation Retraction Successful
                                </Alert>
                            </VStack>
                        }
                        {apiState === 'error' &&
                            <VStack mb="4">
                                <Alert status="error">
                                    <AlertIcon />
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>{apiError ? apiError : 'Unknown Error, API not responsive'}</AlertDescription>
                                </Alert>
                            </VStack>
                        }
                    </ModalBody>
                    <ModalFooter>
                        {apiState !== 'success' && apiState !== 'error' &&
                            <ButtonGroup spacing="4">
                                <Button onClick={handleClose}>Cancel</Button>
                                <Button
                                    leftIcon={<AiOutlineClose />}
                                    onClick={processInviteRetraction}
                                    isLoading={apiState === 'loading'}
                                >
                                    Retract Invitation
                                </Button>
                            </ButtonGroup>
                        }
                        {apiState === 'success' &&
                            <Button onClick={handleClose}>Done</Button>
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
