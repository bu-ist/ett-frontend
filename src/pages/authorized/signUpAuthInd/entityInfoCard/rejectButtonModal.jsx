import { useState, useContext } from 'react';
import { Button, ButtonGroup, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from "@chakra-ui/react";
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

    async function handleRejectClick(event) {
        event.preventDefault();
        setApiState('loading');

        // Extract the invitation code from the inviteInfo object.
        const { invitation: { code }} = inviteInfo;

        try {
            // Call the terminateEntityAPI function with the invitation code.
            const response = await terminateEntityAPI( appConfig, code );
            if (response.ok) {
                setApiState('success');
            } else {
                setApiState('error');
            }
        } catch (error) {
            console.error(error);
            setApiState('error');
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
            <Modal size="xl" isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Reject Invitation from {inviteInfo.entity.entity_name}</ModalHeader>
                    <ModalBody>
                        {apiState === 'idle' &&
                            <Text>
                                Rejecting the invitation will remove all information associated with the invitation code and the
                                incomplete Registered Entity. This cannot be undone. Are you sure you want to reject the invitation?
                            </Text>
                        }
                        {apiState === 'success' &&
                            <Text>
                                The invitation has been rejected.
                            </Text>
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
                            <Button
                                isLoading={apiState === 'loading'}
                                onClick={handleRejectClick}
                                colorScheme="red"
                            >
                                {apiState === 'idle' && 'Reject'}
                                {apiState === 'error' && 'Error'}
                                {apiState === 'success' && 'Goodbye'}
                            </Button>
                        </ButtonGroup>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
