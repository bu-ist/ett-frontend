import { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, Heading, CardBody, CardFooter, Text, Icon, Stack, Badge, Box, Divider } from "@chakra-ui/react";
import { HiMinusCircle, HiCheckCircle, HiArrowSmRight } from "react-icons/hi";

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
        // Check if the person has a delegate.
        const hasDelegate = person.delegate && Object.keys(person.delegate).length > 0;

        return (
            <Fragment key={person.email}>
                <Stack mb={hasDelegate ? "1" : "2"} direction="row">
                    <Icon as={HiCheckCircle} color="green.300" boxSize="6" />
                    <Text>{person.fullname}, <i>{person.title}</i> - {person.email} </Text>
                </Stack>
                {hasDelegate &&
                    <Stack mb="2" ml="4" direction="row">
                        <Icon as={HiArrowSmRight} color="gray.400" boxSize="6" />
                        <Text color="gray.600">Delegated Contact: {person.delegate.fullname}, {person.delegate.email}</Text>
                    </Stack>
                }
                {index === 0 &&
                    <Divider my="2" />
                }
            </Fragment>
        );
    });

    return (
        <Card variant="outline">
            <CardHeader>
                <Heading as="h3" size="lg" color="gray.600">Authorized Individuals</Heading>
            </CardHeader>
            <CardBody>
                {(entity.users.length < 2 ) &&
                    <Text>
                        Full Entity registration requires two Authorized Individuals.
                    </Text>
                }
                {(entity.users.length === 2 ) &&
                    <Text>
                        Lorem ipsum minim anim id do nisi aliqua. Consequat cillum sint qui ad aliqua proident nostrud. Cillum ullamco consectetur mollit eu labore amet ullamco mollit dolor veniam adipisicing veniam nulla ex. Quis irure minim id commodo dolore anim nulla aliqua reprehenderit pariatur. 
                    </Text>
                }
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

AuthorizedCard.propTypes = {
    entity: PropTypes.shape({
        users: PropTypes.arrayOf(PropTypes.shape({
            role: PropTypes.string.isRequired,
            fullname: PropTypes.string.isRequired,
            email: PropTypes.string.isRequired,
            title: PropTypes.string,
            delegate: PropTypes.shape({
                fullname: PropTypes.string.isRequired,
                email: PropTypes.string.isRequired
            })
        })).isRequired,
        pendingInvitations: PropTypes.arrayOf(PropTypes.shape({
            status: PropTypes.string,
            email: PropTypes.string,
            code: PropTypes.string,
            sent_timestamp: PropTypes.string
        })).isRequired
    }).isRequired,
    updatePendingInvitations: PropTypes.func.isRequired
};
