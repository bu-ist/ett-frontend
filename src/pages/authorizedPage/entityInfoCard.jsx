/* Warning: this is a duplicate of the entityInfoCard.jsx file in the signUpAuthInd directory.*/
/* Ideally this would be a shared component, look to refactor this in the future. */

import { Card, CardHeader, Heading, CardBody, Text, HStack, Box, StackDivider, ButtonGroup } from "@chakra-ui/react";
import { formatTimestamp } from '../../lib/formatting/formatTimestamp';

import AmendModalButton from './entityInfoCard/amendButtonModal';
import TerminateButtonModal from './entityInfoCard/terminateButtonModal';

// Display card to show entity information, with the Entity Adminstrator's information and information on any existing Authorized Individuals.

export default function EntityInfoCard({ entityInfo }) {
    // If there are users in the inviteInfo, get the user whose role is 'RE_ADMIN'.
    const adminUser = entityInfo?.users?.find(user => user.role === 'RE_ADMIN') || '';
    
    // If there is already another Authorized Individual, get the email of the user whose role is 'RE_AUTHORIZED'.
    const authUser = entityInfo?.users?.find(user => user.role === 'RE_AUTH_IND') || '';

    // Get any pending invitation to administative support professionals ( where role is 'RE_ADMIN' )
    const pendingAdminInvitation = entityInfo?.pendingInvitations?.find(invitation => invitation.role === 'RE_ADMIN') || '';

    // Get any pending invitation to authorized individuals ( where role is 'RE_AUTH_IND' )
    const pendingAuthInvitation = entityInfo?.pendingInvitations?.find(invitation => invitation.role === 'RE_AUTH_IND') || '';


    const { entity_name } = entityInfo;

    return (
        <Card my="4">
            <CardHeader>
                <Heading as="h3" size="md">{entity_name} </Heading>
            </CardHeader>
            <CardBody>
                <HStack align="top" spacing={14} divider={<StackDivider borderColor="gray.200" />}>
                    <Box>
                        <Heading as="h4" mb="2" size="sm">Administrative Support Professional</Heading>
                        {adminUser !== '' ? (
                            <>
                                <Text>{adminUser.fullname}</Text>
                                <Text>{adminUser.title}</Text>
                                <Text>{adminUser.email}</Text>
                                <Text>{adminUser.phone_number}</Text>
                            </>
                        ) : pendingAdminInvitation !== '' ? (
                            <Text>Invitation pending (sent {formatTimestamp(pendingAdminInvitation.sent_timestamp)})</Text>
                        ) : (
                            <Text>Currently vacant, click &quot;Amend&quot; to send new invitation.</Text>
                        )}
                    </Box>
                    <Box>
                        <Heading as="h4" mb="2" size="sm">Authorized Individuals</Heading>
                        {authUser ? (
                            <>
                                <Text>{authUser.fullname}</Text>
                                <Text>{authUser.title}</Text>
                                <Text>{authUser.email}</Text>
                                <Text>{authUser.phone_number}</Text>
                            </>
                        ) : pendingAuthInvitation !== '' ? (
                            <Text>Invitation pending (sent {formatTimestamp(pendingAuthInvitation.sent_timestamp)})</Text>
                        ) : (
                            <Text>Second Authorized Individual has not yet registered.</Text>
                        )}
                    </Box>
                    <Box>
                        <Heading as="h4" mb="2" size="sm">Options</Heading>
                        <Text>
                            Optionally amend the registration if you wish to change the entity name or representatives. 
                            {/* , or terminate if you want to end the registration. */}

                        </Text>
                        <ButtonGroup size="sm" mt="4" spacing="4">
                            <AmendModalButton entityInfo={entityInfo} />
                            {/*
                            <TerminateButtonModal entityInfo={entityInfo} />
                            */}
                        </ButtonGroup>
                    </Box>
                </HStack>
            </CardBody>
        </Card>
    )
}
