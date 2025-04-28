import { useState, useContext } from 'react';
import Cookies from 'js-cookie';

import { Box, FormControl, Button, FormLabel, Input, Spinner, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody } from "@chakra-ui/react";

import { sendDisclosureRequestAPI } from '../../lib/auth-ind/sendDisclosureRequestAPI';

import { ConfigContext } from '../../lib/configContext';

export default function DisclosureRequestForm({ entityId }) {
    const { isOpen, onOpen, onClose } = useDisclosure();

    // Get the appConfig from the ConfigContext.
    const { appConfig } = useContext( ConfigContext );

    const [apiState, setApiState] = useState('idle');

    // Initialize state for each form input
    const [formData, setFormData] = useState({
        consenterEmail: '',
        affiliateEmail: ''
    });

    // Handle form input changes
    function handleChange(e) {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    // Handle form submission
    async function handleSubmit(e) {
        e.preventDefault();

        // Destructure useful values from the appConfig.
        const { apiStage, authorizedIndividual: { apiHost } } = appConfig;

        const { consenterEmail, affiliateEmail } = formData;

        setApiState('loading');

        const accessToken = Cookies.get('EttAccessJwt');
        const sendResult = await sendDisclosureRequestAPI( apiHost, apiStage, accessToken, consenterEmail, affiliateEmail, entityId);

        console.log( 'sendResult', sendResult);

        if (sendResult.payload.ok) {
            setApiState('success');
        } else {
            setApiState('error');
        }

        onOpen();
    }

    return (
        <Box my={"2em"}>
        <FormControl as="form" onSubmit={handleSubmit}>
            <FormLabel>Email of the Consenting Person</FormLabel>
            <Input
                name="consenterEmail"
                type="email"
                value={formData.consenterEmail}
                onChange={handleChange}
                placeholder="email@example.com"
            />
            <FormLabel mt="1em">Email of the Affiliate to send the disclosure request to </FormLabel>
            <Input
                name="affiliateEmail"
                type="email"
                value={formData.affiliateEmail}
                onChange={handleChange}
                placeholder="email@example.com"
            />
            <Button colorScheme='blue' my="2em" type="submit">
                {apiState === 'idle' && 'Send'}
                {apiState === 'loading' && <Spinner />}
                {apiState === 'success' && 'Sent'}
                {apiState === 'error' && 'Error'}
            </Button>
        </FormControl>
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    {apiState === 'error' && 'Error'}
                    {apiState === 'success' && 'Request Sent'}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {apiState === 'error' && 'There was an error sending the request'}
                    {apiState === 'success' && `Request sent successfully to ${formData.affiliateEmail}.`}
                </ModalBody>
            </ModalContent>
        </Modal>
    </Box>
    );
}
