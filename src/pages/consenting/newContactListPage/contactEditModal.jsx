import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Stack, FormLabel, Input, RadioGroup, Radio } from "@chakra-ui/react";

export default function ContactEditModal( {isOpen, onClose, isEditOrAdd, contact, removeContact, handleContactChange, handleOrgTypeRadioChange} ) {
    function handleCancel() {
        removeContact(contact.id);
        onClose();
    }
    
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="4xl"
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    {isEditOrAdd == 'add' && 'Add'} {isEditOrAdd == 'edit' && 'Edit'} Contact
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormLabel>Organiziation</FormLabel>
                    <Input
                        type="text"
                        name="organizationName"
                        value={contact.organizationName}
                        onChange={(e) => handleContactChange(contact.id, e)}
                    />
                    <FormLabel>Organization Type</FormLabel>
                    <RadioGroup
                        my="2"
                        name="organizationType"
                        value={contact.organizationType}
                        onChange={(value) => handleOrgTypeRadioChange(contact.id, value)}
                    >
                        <Stack spacing="1.5em" direction="row">
                            <Radio value="EMPLOYER">Employer</Radio>
                            <Radio value="ACADEMIC">Academic</Radio>
                            <Radio value="OTHER">Other</Radio>
                        </Stack>
                    </RadioGroup>
                    <FormLabel>Contact Name</FormLabel>
                    <Input
                        type="text"
                        name="contactName"
                        value={contact.contactName}
                        onChange={(e) => handleContactChange(contact.id, e)}
                    />
                    <FormLabel>Contact Title</FormLabel>
                    <Input
                        type="text"
                        name="contactTitle"
                        value={contact.contactTitle}
                        onChange={(e) => handleContactChange(contact.id, e)}
                    />
                    <FormLabel>Contact Email</FormLabel>
                    <Input
                        type="email"
                        name="contactEmail"
                        value={contact.contactEmail}
                        onChange={(e) => handleContactChange(contact.id, e)}
                    />
                    <FormLabel>Contact Phone</FormLabel>
                    <Input
                        type="tel"
                        name="contactPhone"
                        value={contact.contactPhone}
                        onChange={(e) => handleContactChange(contact.id, e)}
                    />
                </ModalBody>
                <ModalFooter>
                    { isEditOrAdd != "edit" && <Button mr="4" onClick={handleCancel}>Cancel</Button>}
                    <Button onClick={onClose}>Done</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
