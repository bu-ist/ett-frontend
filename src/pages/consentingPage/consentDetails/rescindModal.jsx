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
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor libero voluptas, iusto deserunt nesciunt velit quod consequuntur eius, cupiditate ipsam, id labore quae deleniti quam perferendis neque. Nostrum, nam modi!
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button onClick={() => alert("okay really rescind now")} variant="ghost">
                            Rescind
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
