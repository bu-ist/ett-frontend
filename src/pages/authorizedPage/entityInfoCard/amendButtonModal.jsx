import { Link as ReactRouterLink } from "react-router-dom";
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
                            Click proceed to continue to the amendment page.
                        </Text>  
                    </ModalBody>
                    <ModalFooter>
                        <ButtonGroup spacing="4">
                            <Button onClick={onClose}>Cancel</Button>
                            <Button as={ReactRouterLink} to="/auth-ind/amend" colorScheme="orange">Proceed</Button>
                        </ButtonGroup>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
