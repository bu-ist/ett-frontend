import { Button, ButtonGroup, Divider, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from "@chakra-ui/react";
import { HiOutlinePencil } from "react-icons/hi";

export default function AmendButtonModal({ entityInfo }) {
    // UI State
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <Button
                leftIcon={<HiOutlinePencil/>}
                onClick={onOpen}
            >
                Amend
            </Button>
            <Modal size="xl" isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Amend Registration for {entityInfo.entity_name}</ModalHeader>
                    <ModalBody>
                        <Text>
                            You can amend the registration for {entityInfo.entity_name} by changing the representatives.
                        </Text>
                        <Divider my="4"/>
                        <Text>
                            This feature is not yet implemented.
                        </Text>  
                    </ModalBody>
                    <ModalFooter>
                        <ButtonGroup spacing="4">
                            <Button onClick={onClose}>Cancel</Button>
                            <Button onClick={() => alert('Not yet implemented')} colorScheme="orange">Proceed</Button>
                        </ButtonGroup>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
