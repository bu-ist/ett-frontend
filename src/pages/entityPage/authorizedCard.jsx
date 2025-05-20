import { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, Heading, CardBody, CardFooter, Text, Icon, Stack, Badge, Box, Divider } from "@chakra-ui/react";
import { HiMinusCircle, HiCheckCircle, HiArrowSmRight } from "react-icons/hi";

import InviteUsersModal from "./inviteUsersModal";
import InviteReplacementAuthIndModal from "../../components/amendment/inviteReplacementAuthIndModal";

import { formatTimestamp } from '../../lib/formatting/formatTimestamp';

export default function AuthorizedCard({ entity, updatePendingInvitations }) {
    // Check if the entity is registered by checking if the entity has a defined property named registered_timestamp.
    const isEntityRegistered = entity && Object.prototype.hasOwnProperty.call(entity, 'registered_timestamp');
    
    const authInds = entity.users.filter(user => user.role === 'RE_AUTH_IND');

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
                {!isEntityRegistered && (
                    <Text fontSize="lg" fontWeight="semibold">
                        {entity.users.length === 0
                            ? "Full Entity registration requires two Authorized Individuals."
                            : "A second Authorized Individual is required to complete Entity registration."}
                    </Text>
                )}
                {isEntityRegistered && (
                    <Text>
                        The entity is fully registered. Authorized Individuals will receive notification emails when new disclosure forms are submitted.
                    </Text>
                )}

                <Heading as="h4" size="sm" mt="4" mb="2">Registrations</Heading>
                {entity.users.length === 0 ? (
                    <Stack mt="4" direction="row">
                        <Icon as={HiMinusCircle} color="gray.400" boxSize="6" />
                        <Text>No Authorized Individuals currently registered</Text>
                    </Stack>
                ) : (
                    <>
                        {authIndsList}
                    </>
                )}

                {/* Show Invitations section if there are pending invitations or if authorized individuals are needed */}
                {(entity.pendingInvitations.length > 0 || entity.users.length < 2) && (
                    <>
                        <Heading as="h4" size="sm" mt="4">Invitations</Heading>
                        {isEntityRegistered && entity.users.length < 2 && entity.pendingInvitations.length === 0 && (
                            <Text color="red.600" fontWeight="medium" mt="2" mb="4">
                                Warning: Entity registration will expire in 30 days if two Authorized Individuals are not maintained. Please send an invitation to maintain entity registration.
                            </Text>
                        )}
                        {entity.pendingInvitations.length === 0 ? (
                            <Stack mt="4" direction="row">
                                <Icon as={HiMinusCircle} color="gray.400" boxSize="6" />
                                <Text>No pending invitations</Text>
                            </Stack>
                        ) : (
                            <Box mt="2">
                                {pendingInvitationsList}
                            </Box>
                        )}
                    </>
                )}
            </CardBody>
            <CardFooter>
                {/* Show initial dual-invite modal when there are no users and no pending invitations */}
                {entity.users.length === 0 && entity.pendingInvitations.length === 0 && 
                    <InviteUsersModal 
                        numUsers={entity.users.length} 
                        entity={entity} 
                        updatePendingInvitations={updatePendingInvitations} 
                    />
                }
                {/* Show replacement modal when either:
                    1. One user and no pending invites (replacement needed) OR
                    2. No users but one pending invite (second invite needed) */}
                {((entity.users.length === 1 && entity.pendingInvitations.length === 0) ||
                  (entity.users.length === 0 && entity.pendingInvitations.length === 1)) &&
                    <InviteReplacementAuthIndModal 
                        entity={entity}
                        updatePendingInvitations={updatePendingInvitations}
                        isSecondInvite={entity.users.length === 0}
                    />
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
        })).isRequired,
        registered_timestamp: PropTypes.string
    }).isRequired,
    updatePendingInvitations: PropTypes.func.isRequired
};
