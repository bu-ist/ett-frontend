import { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';

import { Box, FormControl, Button, FormLabel, Input, Spinner, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormErrorMessage, FormHelperText, Alert, AlertIcon, Stack, Text, ModalFooter } from "@chakra-ui/react";

import { sendDisclosureRequestAPI } from '../../lib/auth-ind/sendDisclosureRequestAPI';
import { emailRegex } from '../../lib/formatting/emailRegex';

import { ConfigContext } from '../../lib/configContext';

export default function DisclosureRequestForm({ entityId }) {
    const { isOpen, onOpen, onClose } = useDisclosure();

    // Get the appConfig from the ConfigContext.
    const { appConfig } = useContext( ConfigContext );

    const [apiState, setApiState] = useState('idle');
    const [submittedEmails, setSubmittedEmails] = useState(null);

    const {
        handleSubmit,
        register,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            consenterEmail: '',
            affiliateEmail: ''
        }
    });

    // Handle form submission
    async function onSubmit(values) {
        const { consenterEmail, affiliateEmail } = values;
        setApiState('loading');
        setSubmittedEmails(values);

        const { apiStage, authorizedIndividual: { apiHost } } = appConfig;
        const accessToken = Cookies.get('EttAccessJwt');
        
        const sendResult = await sendDisclosureRequestAPI(apiHost, apiStage, accessToken, consenterEmail, affiliateEmail, entityId);
        
        if (sendResult.payload.ok) {
            setApiState('success');
        } else {
            setApiState('error');
        }

        onOpen();
    }

    // Handle modal close
    function handleModalClose() {
        // Reset form and state when modal is closed
        if (apiState === 'success') {
            reset();
            setSubmittedEmails(null);
        }
        setApiState('idle');
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
                        <FormHelperText>Enter the email address of the Consenting Person</FormHelperText>
                    ) : (
                        <FormErrorMessage>{errors.consenterEmail.message}</FormErrorMessage>
                    )}
                </FormControl>

                <FormControl mb="4" isInvalid={errors.affiliateEmail}>
                    <FormLabel>Email of the Affiliate to send the disclosure request to</FormLabel>
                    <Input
                        id="affiliateEmail"
                        name="affiliateEmail"
                        type="email"
                        placeholder="email@example.com"
                        {...register('affiliateEmail', {
                            required: 'Email is required',
                            pattern: {
                                value: emailRegex,
                                message: 'Invalid email address'
                            }
                        })}
                    />
                    {!errors.affiliateEmail ? (
                        <FormHelperText>Enter the email address of the affiliate who will receive the disclosure request</FormHelperText>
                    ) : (
                        <FormErrorMessage>{errors.affiliateEmail.message}</FormErrorMessage>
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
                            {apiState === 'success' && submittedEmails && (
                                <>
                                    <Alert status='success'>
                                        <AlertIcon />
                                        Request sent successfully to {submittedEmails.affiliateEmail}
                                    </Alert>
                                    <Text my="8">
                                        The affiliate will receive an email with instructions for completing the disclosure request.
                                        You will receive a notification when the affiliate has responded. ETT does not track the
                                        request further than this.
                                    </Text>
                                </>
                            )}
                            {apiState === 'error' && (
                                <>
                                    <Alert status='error'>
                                        <AlertIcon />
                                        There was an error sending the request. Please try again or contact support if the problem persists.
                                    </Alert>
                                    <Text my="8">
                                        Please check the email addresses you provided and ensure they are valid. If the problem persists, please contact support.
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
    entityId: PropTypes.string.isRequired
};
