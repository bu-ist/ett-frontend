import { useState, useContext } from 'react';
import Cookies from 'js-cookie';
import { useDisclosure, Button, Modal, ModalOverlay, ModalHeader, ModalContent, ModalCloseButton, ModalBody, ModalFooter, Spinner, Text } from '@chakra-ui/react';
import PropTypes from 'prop-types';

import { ConfigContext } from "../../../lib/configContext";

import { renewConsentAPI } from "../../../lib/consenting/renewConsentAPI";

export default function RenewModal({setConsentData, consentData}) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { appConfig } = useContext( ConfigContext );

    const [apiState, setApiState] = useState('idle');

    // Helper function for extracting and formatting the last date in an array
    function getLastDateString(arr) {
        // Check if the array is valid and has at least one element.
        if (!Array.isArray(arr) || arr.length === 0) return '';
        // Get the last element of the array.
        const date = arr.at(-1);
        // Check if the last element is a valid date string.
        if (!date) return '';
        // Convert the date string to a Date object and format it.
        return new Date(date).toLocaleString();
    }

    // Handles renewing the consent expiration date.
    function handleRenew() {
        // Need to declare an async function to handle the API call.
        // This function should get the access token from the cookies.
        async function renewConsent() {
            // Use same button to acknowledge success and close modal.
            if (apiState == 'success') {
                setApiState('idle');
                onClose();
                return;
            }

            // Otherwise set UI state to loading and proceed with renewal.
            setApiState('loading');

            // Get the access token and email from the cookies.
            const accessToken = Cookies.get('EttAccessJwt');
            const idToken = Cookies.get('EttIdJwt');
            const email = JSON.parse(atob(idToken.split('.')[1])).email;

            // Call the renewConsentAPI function with the access token and email.
            const renewResult = await renewConsentAPI(appConfig, accessToken, email);

            // Set the UI state based on the result of the API call.
            if (renewResult.message == 'Ok') {
                setApiState('success');
                setConsentData(renewResult.payload);
            } else {
                setApiState('error');
                // Should add more robust error handling here.
                console.error(renewResult);
            }
        }
        renewConsent();
    }

    return (
        <>
            <Button onClick={onOpen}>Renew</Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Renew Consent</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {(apiState == 'idle' || apiState == 'loading') && 
                            <Text>
                                Renew this consent form for another 10 years?
                            </Text>
                        }
                        {apiState == 'success' && 
                            <Text>
                                Consent renewed successfully with timestamp: {getLastDateString(consentData.consenter.renewed_timestamp)}
                            </Text>
                        }
                        {apiState == 'error' && 
                            <Text>
                                There was an error renewing the consent. Please try again.
                            </Text>
                        }
                    </ModalBody>
                    <ModalFooter>
                        { apiState == 'idle' &&
                            <Button colorScheme="blue" mr={3} onClick={onClose}>
                                Cancel
                            </Button>
                        }
                        <Button onClick={handleRenew}>
                            {apiState == 'idle' && 'Renew'}
                            {apiState == 'loading' && <Spinner />}
                            {apiState == 'error' && 'Error'}
                            {apiState == 'success' && 'OK'}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

RenewModal.propTypes = {
    setConsentData: PropTypes.func.isRequired,
    consentData: PropTypes.shape({
        consenter: PropTypes.shape({
            renewed_timestamp: PropTypes.arrayOf(PropTypes.string)
        }).isRequired
    }).isRequired
};
