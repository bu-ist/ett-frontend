import { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';

import { Box, FormControl, Button, FormLabel, Input, Spinner, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormErrorMessage, FormHelperText, Alert, AlertIcon, Stack, Text, ModalFooter, AlertTitle, AlertDescription } from "@chakra-ui/react";

import { emailRegex } from '../../lib/formatting/emailRegex';
import { sendDisclosureRequestAPI } from '../../lib/auth-ind/sendDisclosureRequestAPI';
import { sendAdminDisclosureRequestAPI } from '../../lib/entity/sendAdminDisclosureRequestAPI';

import { ConfigContext } from '../../lib/configContext';

// Configuration for different roles. The disclosure request can be performed by either an authorized individual (RE_AUTH_IND) or an entity admin (RE_ADMIN).
// Each role has its own API function.
const ROLE_CONFIG = {
    RE_AUTH_IND: {
        apiFunction: sendDisclosureRequestAPI
    },
    RE_ADMIN: {
        apiFunction: sendAdminDisclosureRequestAPI
    }
};

export default function DisclosureRequestForm({ entityId, role }) {
    // UI State
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [apiState, setApiState] = useState('idle');
    const [apiError, setApiError] = useState(null);
    const [submittedEmail, setSubmittedEmail] = useState('');

    // Get the appConfig from the ConfigContext.
    const { appConfig } = useContext( ConfigContext );

    const {
        handleSubmit,
        register,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            consenterEmail: ''
        }
    });

    // Handle form submission
    async function onSubmit(values) {
        const { consenterEmail } = values;
        setApiState('loading');
        setSubmittedEmail(consenterEmail);
        
        // Get the correct role configuration
        const roleConfig = ROLE_CONFIG[role];
        if (!roleConfig) {
            console.error(`Invalid role: ${role}`);
            setApiState('error');
            setApiError('Invalid role configuration');
            onOpen();
            return;
        }

        const accessToken = Cookies.get('EttAccessJwt');
        
        // Send the disclosure request using the appropriate API function for the given role.
        const sendResult = await roleConfig.apiFunction(appConfig, accessToken, consenterEmail, entityId);
        
        if (sendResult.payload?.ok) {
            setApiState('success');
        } else {
            setApiState('error');
            setApiError(sendResult.message || 'An error occurred while sending the disclosure request');
        }

        onOpen();
    }

    // Handle modal close
    function handleModalClose() {
        // Reset form and state when modal is closed
        if (apiState === 'success') {
            reset();
            setSubmittedEmail('');
        }
        setApiState('idle');
        setApiError(null);
        onClose();
    }

    return (
        <Box my={"2em"}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl mb="4" isInvalid={errors.consenterEmail}>
                    <FormLabel>Email of the Consenting Person</FormLabel>
                    <Input
                        id="consenterEmail"
                        name="consenterEmail"
                        type="email"
                        placeholder="email@example.com"
                        {...register('consenterEmail', {
                            required: 'Email is required',
                            pattern: {
                                value: emailRegex,
                                message: 'Invalid email address'
                            }
                        })}
                    />
                    {!errors.consenterEmail ? (
                        <FormHelperText>Enter the email address of the consenting person for whom disclosures are being requested</FormHelperText>
                    ) : (
                        <FormErrorMessage>{errors.consenterEmail.message}</FormErrorMessage>
                    )}
                </FormControl>

                <Button colorScheme='blue' my="2em" type="submit" isDisabled={apiState !== 'idle'}>
                    {apiState === 'idle' && 'Send'}
                    {apiState === 'loading' && <Spinner />}
                    {apiState === 'success' && 'Sent'}
                    {apiState === 'error' && 'Error'}
                </Button>
            </form>

            <Modal size="lg" isOpen={isOpen} onClose={handleModalClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        {apiState === 'error' ? 'Error Sending Request' : 'Request Sent'}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Stack spacing={3}>
                            {apiState === 'success' && submittedEmail && (
                                <>
                                    <Alert status='success'>
                                        <AlertIcon />
                                        Requests sent successfully for {submittedEmail}
                                    </Alert>
                                    <Text my="8">
                                        Each listed affiliate will receive an email with instructions for completing the disclosure request.
                                        ETT does not track the request further than this.
                                    </Text>
                                </>
                            )}
                            {apiState === 'error' && (
                                <>
                                    <Alert status="error">
                                        <AlertIcon />
                                        <Box>
                                            <AlertTitle>Error</AlertTitle>
                                            <AlertDescription>
                                                {apiError || 'There was an error sending the request. Please try again.'}
                                            </AlertDescription>
                                        </Box>
                                    </Alert>
                                    <Text my="8">
                                        Please check the email address you provided and ensure it is valid. If the problem persists, please contact support.
                                    </Text>
                                </>
                            )}
                        </Stack>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={handleModalClose}>
                            {apiState === 'success' ? 'Done' : 'Close'}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
}

DisclosureRequestForm.propTypes = {
    entityId: PropTypes.string.isRequired,
    role: PropTypes.oneOf(['RE_AUTH_IND', 'RE_ADMIN']).isRequired
};
