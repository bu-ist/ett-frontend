import { useState } from 'react';
import Cookies from 'js-cookie';
import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure, FormControl, Text, FormLabel, Input, Spinner } from '@chakra-ui/react';
import { RiMailLine } from "react-icons/ri";


import { inviteAuthIndFromEntityAPI } from '../../lib/entity/inviteAuthIndFromEntityAPI';

export default function InviteUsersModal({ numUsers, entity, updatePendingInvitations }) {
    // Form State
    const [emailsToInvite, setEmailsToInvite] = useState({
        email1: '',
        email2: '',
    });

    // UI State
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [apiState, setApiState] = useState('idle');

    // Handle form submission
    async function handleSubmit(e) {
        e.preventDefault();
        console.log('Inviting: ', emailsToInvite);

        // Get the access token and email from the cookies.
        const accessToken = Cookies.get('EttAccessJwt');
        const idToken = Cookies.get('EttIdJwt');
        const email = JSON.parse(atob(idToken.split('.')[1])).email;

        setApiState('loading');

        const inviteResult = await inviteAuthIndFromEntityAPI( accessToken, email, entity, emailsToInvite );
        console.log(JSON.stringify(inviteResult));

        if (inviteResult.payload.ok) {
            console.log('Invitation successful');
            setApiState('success');

            // Update the pending invitations in the main page state in order to show the new invitations in the UI.
            updatePendingInvitations(emailsToInvite.email1, emailsToInvite.email2);
        } else {
            setApiState('error');
        }
    }

    function handleClose() {
        onClose();
        setEmailsToInvite({
            email1: '',
            email2: '',
        });
    }

    return (
        <>
            <Button isDisabled={numUsers > 0} onClick={onOpen}>Add Authorized Individuals</Button>
            <Modal isOpen={isOpen} onClose={handleClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add Authorized Individuals</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text mb="1em">lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</Text>
                        <FormControl as="form" onSubmit={handleSubmit} >
                            <FormLabel>Email 1</FormLabel>
                            <Input
                                name="email1"
                                type="email"
                                value={emailsToInvite.email1}
                                onChange={(e) => setEmailsToInvite({ ...emailsToInvite, email1: e.target.value })}
                            />
                            <FormLabel>Email 2</FormLabel>
                            <Input
                                name="email2"
                                type="email"
                                value={emailsToInvite.email2}
                                onChange={(e) => setEmailsToInvite({ ...emailsToInvite, email2: e.target.value })}
                            />
                            <Button my="1em" type="submit">
                                {apiState == 'loading' && <Spinner />}
                                {apiState == 'idle' &&  <><RiMailLine style={{ marginRight: '0.5em' }} /> Send Invitations </>}
                                {apiState == 'error' && 'Error please try again'}
                                {apiState == 'success' && 'Invitations Sent'}
                            </Button>
                        </FormControl>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}