import { useState, useContext } from 'react';
import Cookies from 'js-cookie';
import { Heading, Text, Input, Button, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Icon, Stack } from "@chakra-ui/react";
import { HiCheckCircle, HiMinusCircle } from 'react-icons/hi';
import { RiMailLine } from "react-icons/ri";

import { sysAdminInviteUserAPI  } from "../../lib/sysadmin/sysAdminInviteUserAPI";

import { ConfigContext } from "../../lib/configContext";

export default function SendInvitationPage() {

    // Get the appConfig from the ConfigContext.
    const { appConfig } = useContext( ConfigContext );

    const [email, setEmail] = useState('');

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [apiState, setApiState] = useState('idle');
    const [apiError, setApiError] = useState(null);

    async function sendInvitation(event) {
        event.preventDefault();

        // Set a loading state while the API call is in progress.
        setApiState('loading');
    
        const accessToken = Cookies.get('EttAccessJwt');
        const role = 'RE_ADMIN';
    
        // Should probably add some validation of the email address here.

        try {
            // Call the sysAdminInviteUserAPI function with the access token, email, and role.
            const inviteResult = await sysAdminInviteUserAPI(appConfig, accessToken, email, role);
    
            // Set the UI state based on the result of the API call.
            if (inviteResult.payload.ok) {
                setApiState('success');
                onOpen();
            } else {
                setApiState('error');
                onOpen();
                // Should add more robust error handling here.
                setApiError(inviteResult.message);
                console.error(inviteResult);
            }
        } catch (error) {
            setApiState('error');
            onOpen();
            // Handle any unexpected errors.
            console.error(error);
        }
    }

    function handleClose() {
        onClose();
        if (apiState == 'success') {
            setEmail('');
        }
        setApiState('idle');
    }

    return (
        <div>
            <Heading as="h1" size="lg" my="1em">Send an Invitation</Heading>
            <Text mb={2}>
                To send an invitation to a new ASP user, enter their email address below:
            </Text>
            <Input 
                placeholder="Email Address"
                value={email}
                onChange={event => setEmail(event.target.value)}
            />
            <Button isDisabled={apiState !== 'idle'} onClick={sendInvitation} mt="1em">
                {apiState == 'idle' && <><RiMailLine style={{ marginRight: '0.5em' }} /> Send Invitation</>}
                {apiState == 'loading' && 'Sending...'}
                {apiState == 'success' && 'Sent'}
                {apiState == 'error' && 'Error'}
            </Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        Invitation {apiState == 'error' && 'Not'} Sent
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Stack direction="row" spacing="1em">
                            <Icon 
                                as={apiState == 'success' ? HiCheckCircle : HiMinusCircle}
                                color={apiState == 'success' ? "green.500" : "red.500"}
                                boxSize="3.5em"
                            />
                            {apiState == 'success' &&
                                <Text>
                                    An invitation has been sent to: {email}
                                </Text>
                            }
                            {apiState == 'error' &&
                                <Text>
                                    {apiError ? apiError : 'There was an error sending the invitation. Please try again.'}                                    
                                </Text>
                            }
                        </Stack>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={handleClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}
