import { useState, useContext } from 'react';
import Cookies from 'js-cookie';
import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalFooter, ModalOverlay, useDisclosure, Text, VStack, Alert, AlertIcon, ButtonGroup, AlertTitle, AlertDescription, Code } from '@chakra-ui/react';

import { AiOutlineClose } from 'react-icons/ai';

import { ConfigContext } from "../../lib/configContext";

import { removeUserAI } from '../../lib/amendment/removeUserAI';

export default function RemoveUserModal({ entity, emailToRemove, emailOfRequestor, fetchData }) {
    const { appConfig } = useContext(ConfigContext);

    // UI State
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [apiState, setApiState] = useState('idle');

    const [apiError, setApiError] = useState(null);

    async function processUserRemoval() {

        console.log('Removing user with email ', emailToRemove);

        // Get the access token from the cookies.
        const accessToken = Cookies.get('EttAccessJwt');

        setApiState('loading');

        // Send the removal request to the API.
        const removalResult = await removeUserAI(appConfig, accessToken, entity.entity_id, emailToRemove, emailOfRequestor);
        console.log(JSON.stringify(removalResult));

        if (removalResult.payload?.ok) {
            console.log('User removal successful');

            setApiState('success');
        } else {
            setApiState('error');
            setApiError(removalResult.message);
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
            <Button leftIcon={<AiOutlineClose />} onClick={onOpen}>Remove</Button>
            <Modal size="xl" isOpen={isOpen} onClose={handleClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Remove User</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>Are you sure you want to remove the user with email <Code>{emailToRemove}</Code> from this entity?</Text>
                        <Text mb="4">
                            You will have 30 days to send a new invitation.
                        </Text>
                        {apiState === 'success' &&
                            <VStack mb="4">
                                <Alert status='success'>
                                    <AlertIcon />
                                    User removal successful.
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
                            <ButtonGroup>
                                <Button onClick={handleClose}>Cancel</Button>
                                <Button leftIcon={<AiOutlineClose />} onClick={processUserRemoval}>Remove User</Button>
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
