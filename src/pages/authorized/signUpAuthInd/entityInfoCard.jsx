import { Card, CardHeader, Heading, CardBody, Text, HStack, Box, StackDivider, Button, ButtonGroup } from "@chakra-ui/react";
import { AiOutlineClose } from 'react-icons/ai';
import { HiOutlinePencil } from 'react-icons/hi';

import AmendModalButton from './entityInfoCard/amendButtonModal';
import RejectButtonModal from './entityInfoCard/rejectButtonModal';

// Display card to show entity information, with the Entity Adminstrator's information and information on any existing Authorized Individuals.

export default function EntityInfoCard({ inviteInfo }) {
    // If there are users in the inviteInfo, get the user whose role is 'RE_ADMIN'.
    const adminUser = inviteInfo?.users?.find(user => user.role === 'RE_ADMIN') || '';
    
    // If there is already another Authorized Individual, get the email of the user whose role is 'RE_AUTHORIZED'.
    const authUser = inviteInfo?.users?.find(user => user.role === 'RE_AUTH_IND') || '';

    const { entity: { entity_name } } = inviteInfo;

    return (
        <Card my="4">
            <CardHeader>
                <Heading as="h3" size="md">Invitation from {entity_name} </Heading>
            </CardHeader>
            <CardBody>
                <HStack align="top" spacing={14} divider={<StackDivider borderColor="gray.200" />}>
                    <Box>
                        <Heading as="h4" size="sm">Administrative Support Professional</Heading>
                        <Text>{adminUser.fullname}</Text>
                        <Text>{adminUser.title}</Text>
                        <Text>{adminUser.email}</Text>
                        <Text>{adminUser.phone_number}</Text>
                    </Box>
                    <Box>
                        <Heading as="h4" size="sm">Authorized Individuals</Heading>
                        {authUser ?  (
                            <>
                                <Text>{authUser.fullname}</Text>
                                <Text>{authUser.title}</Text>
                                <Text>{authUser.email}</Text>
                                <Text>{authUser.phone_number}</Text>
                            </>
                        ) : (
                            <Text>No registered Authorized Individuals, you will be the first.</Text>
                        )}
                    </Box>
                    <Box>
                        <Heading as="h4" size="sm">Options</Heading>
                        <Text>Optionally end the entity registration if it is premature or otherwise mistaken.</Text>
                        <ButtonGroup size="sm" mt="4" spacing="4">
                            {   
                                // Remove the amend button for now, we don't have the technology to support it, and may never.
                                //<AmendModalButton inviteInfo={inviteInfo} />
                            }
                            <RejectButtonModal inviteInfo={inviteInfo} />
                        </ButtonGroup>
                    </Box>
                </HStack>
            </CardBody>
        </Card>
    )
}
