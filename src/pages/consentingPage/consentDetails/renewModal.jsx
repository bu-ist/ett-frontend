import { useState } from 'react';
import Cookies from 'js-cookie';
import { useDisclosure, Button, Modal, ModalOverlay, ModalHeader, ModalContent, ModalCloseButton, ModalBody, ModalFooter, Spinner, Text } from '@chakra-ui/react';

import { renewConsentAPI } from "../../../lib/consenting/renewConsentAPI";

export default function RenewModal({setConsentData, consentData}) {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [apiState, setApiState] = useState('idle');

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
            const renewResult = await renewConsentAPI(accessToken, email);

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
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor libero voluptas, iusto deserunt nesciunt velit quod consequuntur eius, cupiditate ipsam, id labore quae deleniti quam perferendis neque. Nostrum, nam modi!
                            </Text>
                        }
                        {apiState == 'success' && 
                            <Text>
                                Consent renewed successfully with timestamp: {consentData.consenter.renewed_timestamp.reverse()[0]}
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
