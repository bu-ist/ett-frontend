import { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';

import { Box, FormControl, Button, FormLabel, Input, Spinner, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormErrorMessage, FormHelperText } from "@chakra-ui/react";

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
                        {apiState === 'success' && submittedEmails && `Request sent successfully to ${submittedEmails.affiliateEmail}.`}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
}

DisclosureRequestForm.propTypes = {
    entityId: PropTypes.string.isRequired
};
