import { useEffect, useState, useContext } from 'react';
import Cookies from 'js-cookie';

import { Box, Button, Center, Heading, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, Radio, RadioGroup, Spinner, useDisclosure } from "@chakra-ui/react";
import {
    AutoComplete,
    AutoCompleteInput,
    AutoCompleteItem,
    AutoCompleteList,
  } from "@choc-ui/chakra-autocomplete";

import { ConfigContext } from '../../lib/configContext';

import { sendExhibitRequestAPI } from '../../lib/auth-ind/sendExhibitRequestAPI';
import { searchConsentersAPI } from '../../lib/auth-ind/searchConsentersAPI';

import ExhibitSuccessModalBody from "./consentersAutocomplete/exhibitSuccessModalBody";

export default function ConsentersAutocomplete({ entityId }) {
    const { appConfig } = useContext( ConfigContext );

    // Destructure useful values from the appConfig.
    const { apiStage, authorizedIndividual: { apiHost } } = appConfig;

    const { isOpen, onOpen, onClose } = useDisclosure();

    const [selectedConsenter, setSelectedConsenter] = useState(null);
    
    const [apiState, setApiState] = useState('idle');
    
    const [value, setValue] = useState(null);
    const [options, setOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // State for the type radio group.
    const [constraint, setConstraint] = useState('both');

    async function handleSendButton() {
        // Send the request to the API
        console.log('selectedConsenter send', selectedConsenter);
        setApiState('loading');

        const accessToken = Cookies.get('EttAccessJwt');
        const sendResult = await sendExhibitRequestAPI(apiHost, apiStage, accessToken, selectedConsenter, entityId, constraint);

        console.log('sendResult', sendResult);

        if (sendResult.payload.ok) {
            setApiState('success');
        } else {
            setApiState('error');
        }

        onOpen();
    }
    
    function handleModalClose() {
        // Reset the state and close the modal
        setApiState('idle');
        setSelectedConsenter(null);
        setValue(null);
        // This doesn't fully work yet as the autocomplete doesn't reset the value.
        setOptions([]);
        onClose();
    }

    async function fetchConsenters(query) {
        const accessToken = Cookies.get('EttAccessJwt');
        const result = await searchConsentersAPI(apiHost, apiStage, accessToken, query);

        if (result.payload.ok) {
            setOptions(result.payload.consenters);
        } else {
            setOptions([]);
        }
    }

    function onChangeInputHandler(event) {
        const { target: { value } } = event;
        setValue(value);
    };

    // Use a useEffect to call the API when the value changes.
    useEffect(() => {
        if (value) {
            setIsLoading(true);
            // Use a timeout to debounce the search API call.
            const timer = setTimeout(async () => {
                try {
                    await fetchConsenters(value);
                } finally {
                    setIsLoading(false);
                }
            }, 300);
    
            // Cleanup function to clear the timeout
            return () => clearTimeout(timer);
        }
    }, [value, setOptions, setIsLoading]);

    const emptyState = <Center>{value ? 'No results found' : 'Start typing to search'}</Center>;

    return (
        <Box>
            <Heading as="h3" my="4" size="sm">Select type of contact information</Heading>
            <RadioGroup onChange={setConstraint} value={constraint}>
                <Stack mb="8">
                    <Radio value="current">Current Employer(s) only</Radio>
                    <Radio value="other">Prior Employer(s) and other Affiliates</Radio>
                    <Radio value="both">All</Radio>
                </Stack>
            </RadioGroup>
            <Heading as="h3" my="4" size="sm">Select the consenting person</Heading>
            <AutoComplete
                openOnFocus
                isLoading={isLoading}
                onChange={setSelectedConsenter}
                emptyState={emptyState}
            >
                <AutoCompleteInput
                    onChange={onChangeInputHandler} 
                    placeholder="Search for a consenter"
                    loadingIcon={<Spinner />}
                />
                <AutoCompleteList>
                    {options.map((consenter) => {
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
                    <>Send{selectedConsenter ? ` to ${selectedConsenter}` : '' }</>
                }
                {apiState === 'loading' && <Spinner />}
                {apiState === 'error' && 'Error'}
                {apiState === 'success' && 'Sent'}
            </Button>
            <Modal isOpen={isOpen} onClose={handleModalClose} size="lg" >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        {apiState === 'error' && 'Error'}
                        {apiState === 'success' && 'Request Sent'}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {apiState === 'error' && 'There was an error sending the request.'}
                        {apiState === 'success' && <ExhibitSuccessModalBody selectedConsenter={selectedConsenter} />}
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
}
