// This component is dereferenced right now because we are not using it in the application; there is a chance it may come back but probably not.

import { Button, ButtonGroup, Divider, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from "@chakra-ui/react";
import { AiOutlineClose } from 'react-icons/ai';

export default function TerminateButtonModal({ entityInfo }) {
    // UI State
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <Button
                leftIcon={<AiOutlineClose/>}
                onClick={onOpen}
            >
                Terminate
            </Button>
            <Modal size="xl" isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Terminate Registration for {entityInfo.entity_name}</ModalHeader>
                    <ModalBody>
                        <Text>
                            You can terminate the registration for {entityInfo.entity_name}.
                        </Text>
                        <Divider my="4"/>
                        <Text>
                            This feature is not yet implemented.
                        </Text>  
                    </ModalBody>
                    <ModalFooter>
                        <ButtonGroup spacing="4">
                            <Button onClick={onClose}>Cancel</Button>
                            <Button onClick={() => alert('Not yet implemented')} colorScheme="red">Terminate</Button>
                        </ButtonGroup>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
