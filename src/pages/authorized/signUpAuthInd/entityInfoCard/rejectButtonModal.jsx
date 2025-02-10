import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, ButtonGroup, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from "@chakra-ui/react";
import { AiOutlineClose } from 'react-icons/ai';

import { terminateEntityAPI } from '../../../../lib/entity/terminateEntityAPI';

import { ConfigContext } from '../../../../lib/configContext';

export default function RejectButtonModal({ inviteInfo }) {
    // Get the appConfig from the ConfigContext.
    // It should already be loaded because this transaction is only avaliable after the privacy policy has been accepted.
    const { appConfig } = useContext( ConfigContext );
    
    // UI State
    const { isOpen, onOpen, onClose } = useDisclosure();
    
    // API call state
    const [apiState, setApiState] = useState('idle');

    const [terminateResult, setTerminateResult] = useState({});

    // Use navigate hook for redirection
    const navigate = useNavigate();

    async function handleRejectClick(event) {
        event.preventDefault();
        setApiState('loading');

        // Extract the invitation code from the inviteInfo object.
        const { invitation: { code }} = inviteInfo;

        try {
            // Call the terminateEntityAPI function with the invitation code.
            const response = await terminateEntityAPI( appConfig, code );
            if (response.message === 'Ok') {
                setTerminateResult(response.payload);
                setApiState('success');
            } else {
                setApiState('error');
            }
        } catch (error) {
            console.error(error);
            setApiState('error');
        }
    }

    // Handle the modal close event; if there was a successful rejection, redirect to the home page.
    function handleClose() {
        if (apiState === 'success') {
            navigate('/');
        } else {
            // Otherwise, just close the modal.
            onClose();
        }
    }

    return (
        <>
            <Button
                leftIcon={<AiOutlineClose/>} 
                onClick={onOpen}
            >
                Reject
            </Button>
            <Modal size="xl" isOpen={isOpen} onClose={handleClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Reject Invitation from {inviteInfo.entity.entity_name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>
                            Rejecting the invitation will remove all information associated with the invitation code and the
                            incomplete Registered Entity, including the accounts of anyone who has already registered. This cannot be undone. Are you sure you want to reject the invitation?
                        </Text>
                        {apiState === 'success' &&
                            <>
                                <Text mt="4" color="red.900">
                                    <b>The invitation has been rejected.</b>
                                </Text>
                                <Text mt="4">
                                    {terminateResult?.deletedUsers?.length} other user{terminateResult?.deletedUsers?.length > 1 ? 's' : ''} {terminateResult?.deletedUsers?.length > 1 ? 'were' : 'was'} deleted and notified.
                                </Text>
                                <Text mt="4">
                                    Your information has been erased from our system, you will be redirected to the home page.
                                </Text>
                            </>
                        }
                        {apiState === 'error' &&
                            <Text>
                                An error occurred while rejecting the invitation. Please try again.
                            </Text>
                        }
                    </ModalBody>
                    <ModalFooter>
                        <ButtonGroup spacing="4">
                            {apiState === 'idle' &&
                                <Button onClick={onClose}>Cancel</Button>
                            }
                            {apiState !== 'success' &&
                            <Button
                                isLoading={apiState === 'loading'}
                                onClick={handleRejectClick}
                                colorScheme="red"
                            >
                                {apiState === 'idle' && 'Reject'}
                                {apiState === 'error' && 'Error'}
                            </Button>
                            }
                            {apiState === 'success' &&
                                <Button colorScheme="red" onClick={handleClose}>Goodbye</Button>
                            }
                        </ButtonGroup>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
