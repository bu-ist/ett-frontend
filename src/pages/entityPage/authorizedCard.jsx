import { Card, CardHeader, Heading, CardBody, CardFooter, Text, Icon, Stack, Badge, Box } from "@chakra-ui/react";
import { HiMinusCircle, HiCheckCircle } from "react-icons/hi";

import InviteUsersModal from "./inviteUsersModal";

import { formatTimestamp } from '../../lib/formatting/formatTimestamp';

export default function AuthorizedCard({ entity, updatePendingInvitations }) {

    const authInds = entity.users.filter(user => user.role === 'RE_AUTH_IND');
    const authIndsNames = authInds.map(member => member.fullname);

    const pendingInvitationsList = entity.pendingInvitations.map((invitation, index) => {
        const sentDate = formatTimestamp( invitation.sent_timestamp );

        return (
            <Stack mb="2" key={index} direction="row">
                <Icon as={HiMinusCircle} color="yellow.300" boxSize="6" />
                <Text>
                    { (invitation.status === 'invited-in-page') && `Invitation sent just now to ${invitation.email}` }
                    { ('code' in invitation) && `Invitation code starting with ${invitation.code.substring(0,6)} sent on ${sentDate}` }
                </Text>
                <Badge color="gray.600">pending</Badge>
            </Stack>
        );
    });

    const authIndsList = authInds.map((person, index) => {
        return (
            <Stack mb="2" key={index} direction="row">
                <Icon as={HiCheckCircle} color="green.300" boxSize="6" />
                <Text>{person.fullname}, <i>{person.title}</i> - {person.email} </Text>
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
                {entity.users.length <= 1 && <Heading as="h4" size="sm" mt="4">Invitations</Heading>}
                {(entity.pendingInvitations.length == 0 && entity.users.length == 0 ) &&
                    <Stack mt="4" direction="row"><Icon as={HiMinusCircle} color="gray.400" boxSize="6" /><Text>No pending invitations</Text></Stack>
                }
                {entity.pendingInvitations.length > 0 &&
                    <Box mt="2">
                        {pendingInvitationsList}
                    </Box>
                }
                <Heading as="h4" size="sm" mt="4" mb="2">Registrations</Heading>
                {entity.users.length == 0 && 
                    <Stack mt="4" direction="row"><Icon as={HiMinusCircle} color="gray.400" boxSize="6" /><Text>No Authorized Individuals currently registered</Text></Stack>
                }
                {entity.users.length > 0 && 
                    <>
                        {authIndsList}
                    </>
                }

            </CardBody>
            <CardFooter>
            {(entity.users.length == 0 && entity.pendingInvitations.length != 2 ) && 
                <InviteUsersModal numUsers={entity.users.length} entity={entity} updatePendingInvitations={updatePendingInvitations} />
            }
            </CardFooter>
        </Card>
    );
}
