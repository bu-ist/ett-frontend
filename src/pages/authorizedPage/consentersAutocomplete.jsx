import { useState } from 'react';

import { Box, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Spinner, useDisclosure } from "@chakra-ui/react";
import {
    AutoComplete,
    AutoCompleteInput,
    AutoCompleteItem,
    AutoCompleteList,
  } from "@choc-ui/chakra-autocomplete";

export default function ConsentersAutocomplete({ consenterList }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    
    const [selectedConsenter, setSelectedConsenter] = useState('');
    const [apiState, setApiState] = useState('idle');

    async function handleSendButton() {
        // Send the request to the API
        console.log('selectedConsenter send', selectedConsenter);
        setApiState('loading');
        // API call here

        setApiState('success');

        onOpen();
    }
    
    function handleModalClose() {
        // Reset the state and close the modal
        setApiState('idle');
        setSelectedConsenter('');
        onClose();
    }

    return (
        <Box>
            <AutoComplete
                openOnFocus
                value={selectedConsenter}
                onChange={setSelectedConsenter}
            >
                <AutoCompleteInput placeholder="Search for a consenter" />
                <AutoCompleteList>
                    {consenterList.map((consenter) => {
                        return (
                            <AutoCompleteItem key={consenter.email} value={consenter.email} label={consenter.fullname}>
                                {consenter.fullname} {consenter.email}
                            </AutoCompleteItem>
                        );
                    })}
                </AutoCompleteList>
            </AutoComplete>
            <Button onClick={handleSendButton} my="2em">
                {apiState === 'idle' && 
                    <>Send{selectedConsenter !== '' ? ` to ${selectedConsenter}` : '' }</>
                }
                {apiState === 'loading' && <Spinner />}
                {apiState === 'error' && 'Error'}
                {apiState === 'success' && 'Sent'}
            </Button>
            <Modal isOpen={isOpen} onClose={handleModalClose} >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        {apiState === 'error' && 'Error'}
                        {apiState === 'success' && 'Request Sent'}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {apiState === 'error' && 'There was an error sending the request.'}
                        {apiState === 'success' && `Request sent successfully to ${selectedConsenter}.`}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
}
