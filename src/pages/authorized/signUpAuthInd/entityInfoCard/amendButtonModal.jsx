import { Button, ButtonGroup, Divider, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from "@chakra-ui/react";
import { HiOutlinePencil } from "react-icons/hi";

export default function AmendModalButton({inviteInfo}) {
    // UI State
    const { isOpen, onOpen, onClose } = useDisclosure();

    console.log(inviteInfo);

    // Check if there is a user with the role of RE_AUTH_IND in the inviteInfo users array.
    const authIndUser = inviteInfo.users.find(user => user.role === 'RE_AUTH_IND');

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
                    <ModalHeader>Amend Invitation from {inviteInfo.entity.entity_name}</ModalHeader>
                    <ModalBody>
                        <Text>
                            If you wish to change the currently designated Administrative Support Professional or Authorized Individual,
                            you can amend the registration process here.
                        </Text>
                        <Divider my="4" />
                        <Text>
                            To change the Administrative Support Professional, click here:
                        </Text>
                        <Button mt="2" mb={authIndUser ? "2" : "8"} onClick={() => alert('Not yet implemented')}>Change Administrative Support Professional</Button>
                        
                        {authIndUser &&
                            <>
                                <Divider my="4" />
                                <Text>
                                    To change the Authorized Individual, click here:
                                </Text>
                                <Button my="2" onClick={() => alert('Not yet implemented')}>Change Authorized Individual</Button>
                            </>
                        }
                    </ModalBody>
                    <ModalFooter>
                        <ButtonGroup spacing="4">
                            <Button onClick={onClose}>Cancel</Button>
                            <Button disabled={true} onClick={() => alert('Not yet implemented')} colorScheme="orange">Amend</Button>
                        </ButtonGroup>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
