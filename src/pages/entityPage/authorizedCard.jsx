import { Card, CardHeader, Heading, CardBody, CardFooter, Text, Icon, Stack, Badge, Box } from "@chakra-ui/react";
import { HiMinusCircle } from "react-icons/hi";

import InviteUsersModal from "./inviteUsersModal";

export default function AuthorizedCard({ entity, updatePendingInvitations }) {

    const authInds = entity.users.filter(user => user.role === 'RE_AUTH_IND');
    const authIndsNames = authInds.map(member => member.fullname);

    const pendingInvitationsList = entity.pendingInvitations.map((invitation, index) => {
        const sentDate = new Date(invitation.sent_timestamp).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });

        return (
            <Stack mb="2" key={index} direction="row">
                <Icon as={HiMinusCircle} color="yellow.400" boxSize="6" />
                <Text>
                    { (invitation.status === 'invited-in-page') && `Invitation sent just now to ${invitation.email}` }
                    { ('code' in invitation) && `Invitation code starting ${invitation.code.substring(0,6)} sent on ${sentDate}` }
                </Text>
                <Badge color="gray.600">pending</Badge>
            </Stack>
        );
    });

    return (
        <Card>
            <CardHeader>
                <Heading as="h3" size="lg" color="gray.600">Authorized Individuals</Heading>
            </CardHeader>
            <CardBody>
                <Text>
                    Lorem ipsum minim anim id do nisi aliqua. Consequat cillum sint qui ad aliqua proident nostrud. Cillum ullamco consectetur mollit eu labore amet ullamco mollit dolor veniam adipisicing veniam nulla ex. Quis irure minim id commodo dolore anim nulla aliqua reprehenderit pariatur. 
                </Text>
                {(entity.pendingInvitations.length == 0 && entity.users.length == 0 ) &&
                    <Stack mt="4" direction="row"><Icon as={HiMinusCircle} color="gray.400" boxSize="6" /><Text>No pending invitations</Text></Stack>
                }
                {entity.pendingInvitations.length > 0 &&
                    <Box mt="2">
                        {pendingInvitationsList}
                    </Box>
                }
                {entity.users.length == 0 && 
                    <Stack mt="4" direction="row"><Icon as={HiMinusCircle} color="gray.400" boxSize="6" /><Text>No Authorized Individuals currently registered</Text></Stack>
                }
                {entity.users.length == 1 && 
                    <>
                        <Text>{authIndsNames[0]}</Text>
                        <Stack mt="2" direction="row"><Badge>pending</Badge><Text as="i" fontSize="sm">Second invitation not yet accepted</Text></Stack>
                    </>
                }
                {entity.users.length == 2 && authIndsNames.map((fullname, index) => (
                    <Text key={index}>{fullname}</Text>
                ))}
            </CardBody>
            <CardFooter>
            {(entity.users.length == 0 && entity.pendingInvitations.length != 2 ) && 
                <InviteUsersModal numUsers={entity.users.length} entity={entity} updatePendingInvitations={updatePendingInvitations} />
            }
            </CardFooter>
        </Card>
    );
}
