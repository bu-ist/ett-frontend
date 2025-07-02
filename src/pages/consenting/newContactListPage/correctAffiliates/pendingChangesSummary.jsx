import PropTypes from 'prop-types';
import {
    Text,
    VStack,
    HStack,
    Card,
    CardBody,
    Box,
    Badge,
    Stack
} from '@chakra-ui/react';
import { HiPencil, HiPlus, HiX } from 'react-icons/hi';

export default function PendingChangesSummary({ changes, title }) {
    const hasChanges = changes.updates.length > 0 || 
                      changes.appends.length > 0 || 
                      changes.deletes.length > 0;

    if (!hasChanges) return null;

    // Default title can be overridden by props
    const displayTitle = title || "You have made the following changes to the contacts:";

    return (
        <>
            <Text fontWeight="semibold" color="gray.600">
                {displayTitle}
            </Text>
            <Card variant="outline" bg="gray.50">
                <CardBody>
                    <VStack align="stretch" spacing={3}>
                        <HStack justify="space-between">
                            <Text fontWeight="medium">Changes Summary</Text>
                            <HStack spacing={2}>
                                {changes.updates.length > 0 && (
                                    <Badge colorScheme="blue">
                                        {changes.updates.length} Updates
                                    </Badge>
                                )}
                                {changes.appends.length > 0 && (
                                    <Badge colorScheme="green">
                                        {changes.appends.length} New
                                    </Badge>
                                )}
                                {changes.deletes.length > 0 && (
                                    <Badge colorScheme="red">
                                        {changes.deletes.length} Removals
                                    </Badge>
                                )}
                            </HStack>
                        </HStack>

                        {changes.updates.length > 0 && (
                            <Box>
                                <HStack color="blue.600" mb={2}>
                                    <HiPencil />
                                    <Text fontWeight="medium">Updated Contacts</Text>
                                </HStack>
                                <Stack spacing={1} pl={6}>
                                    {changes.updates.map((update) => (
                                        <HStack key={update.email} fontSize="sm" spacing={1}>
                                            <Text fontWeight="medium">{update.email}</Text>
                                            <Text color="gray.500">-</Text>
                                            <Text>{update.org}</Text>
                                        </HStack>
                                    ))}
                                </Stack>
                            </Box>
                        )}

                        {changes.appends.length > 0 && (
                            <Box>
                                <HStack color="green.600" mb={2}>
                                    <HiPlus />
                                    <Text fontWeight="medium">New Contacts</Text>
                                </HStack>
                                <Stack spacing={1} pl={6}>
                                    {changes.appends.map((append, index) => (
                                        <HStack key={index} fontSize="sm" spacing={1}>
                                            <Text fontWeight="medium">{append.email}</Text>
                                            <Text color="gray.500">-</Text>
                                            <Text>{append.org}</Text>
                                        </HStack>
                                    ))}
                                </Stack>
                            </Box>
                        )}

                        {changes.deletes.length > 0 && (
                            <Box>
                                <HStack color="red.600" mb={2}>
                                    <HiX />
                                    <Text fontWeight="medium">Removed Contacts</Text>
                                </HStack>
                                <Stack spacing={1} pl={6}>
                                    {changes.deletes.map((email, index) => (
                                        <Text key={index} fontSize="sm">
                                            {email}
                                        </Text>
                                    ))}
                                </Stack>
                            </Box>
                        )}
                    </VStack>
                </CardBody>
            </Card>
        </>
    );
}

PendingChangesSummary.propTypes = {
    changes: PropTypes.shape({
        updates: PropTypes.arrayOf(PropTypes.shape({
            email: PropTypes.string.isRequired,
            org: PropTypes.string.isRequired
        })).isRequired,
        appends: PropTypes.arrayOf(PropTypes.shape({
            email: PropTypes.string.isRequired,
            org: PropTypes.string.isRequired
        })).isRequired,
        deletes: PropTypes.arrayOf(PropTypes.string).isRequired
    }).isRequired,
    title: PropTypes.string
};
