import { useDisclosure, Button, Modal, ModalOverlay, ModalHeader, ModalContent, ModalCloseButton, ModalBody, ModalFooter } from "@chakra-ui/react";


export default function RescindModal() {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <Button onClick={onOpen}>Rescind</Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Rescind Consent</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                       Not yet implemented.
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button onClick={() => alert("not yet implemented")} variant="ghost">
                            Rescind
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
