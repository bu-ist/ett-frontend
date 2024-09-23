import Cookies from 'js-cookie';
import { useDisclosure, Button, Modal, ModalOverlay, ModalHeader, ModalContent, ModalCloseButton, ModalBody, ModalFooter } from "@chakra-ui/react";

import { renewConsentAPI } from "../../../lib/consenting/renewConsentAPI";

export default function RenewModal() {
    const { isOpen, onOpen, onClose } = useDisclosure();

    function handleRenew() {
        // This function should renew the consent.
        // It should send a request to the backend to renew the consent.
        // If the request is successful, it should close the modal? Or display a success message?
        // If the request is not successful, it should display an error message.

        // Need to declare an async function to handle the API call.
        // This function should get the access token from the cookies.
        async function renewConsent() {
            const accessToken = Cookies.get('EttAccessJwt');
            const idToken = Cookies.get('EttIdJwt');
            const email = JSON.parse(atob(idToken.split('.')[1])).email;

            const renewResult = await renewConsentAPI(accessToken, email);

            console.log(renewResult);

            // should update the consent data in the parent component, which means we need to pass the setter function to this component.

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
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor libero voluptas, iusto deserunt nesciunt velit quod consequuntur eius, cupiditate ipsam, id labore quae deleniti quam perferendis neque. Nostrum, nam modi!
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button onClick={handleRenew} variant="ghost">
                            Renew
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
