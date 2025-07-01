import PropTypes from 'prop-types';
import {
    Text,
    VStack,
    HStack,
    Card,
    CardBody,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Box,
    Badge
} from '@chakra-ui/react';

export default function PendingChangesSummary({ changes }) {
    const hasChanges = changes.updates.length > 0 || 
                      changes.appends.length > 0 || 
                      changes.deletes.length > 0;

    if (!hasChanges) return null;

    return (
        <>
            <Text fontWeight="semibold" color="gray.600">
                You have made the following changes to the contacts:
            </Text>
            <Card variant="outline" bg="gray.50">
                <CardBody>
                    <VStack align="stretch" spacing={2}>
                        <HStack justify="space-between">
                            <Text fontWeight="medium">Pending Changes Summary</Text>
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

                        <Accordion allowMultiple size="sm">
                            {changes.updates.length > 0 && (
                                <AccordionItem>
                                    <AccordionButton>
                                        <Box flex="1" textAlign="left">
                                            Updates
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                    <AccordionPanel>
                                        {changes.updates.map((update) => (
                                            <Text key={update.email} fontSize="sm">
                                                {update.email} - {update.org}
                                            </Text>
                                        ))}
                                    </AccordionPanel>
                                </AccordionItem>
                            )}
                            {changes.appends.length > 0 && (
                                <AccordionItem>
                                    <AccordionButton>
                                        <Box flex="1" textAlign="left">
                                            New Contacts
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                    <AccordionPanel>
                                        {changes.appends.map((append, index) => (
                                            <Text key={index} fontSize="sm">
                                                {append.email} - {append.org}
                                            </Text>
                                        ))}
                                    </AccordionPanel>
                                </AccordionItem>
                            )}
                            {changes.deletes.length > 0 && (
                                <AccordionItem>
                                    <AccordionButton>
                                        <Box flex="1" textAlign="left">
                                            Removals
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                    <AccordionPanel>
                                        {changes.deletes.map((email, index) => (
                                            <Text key={index} fontSize="sm">
                                                {email}
                                            </Text>
                                        ))}
                                    </AccordionPanel>
                                </AccordionItem>
                            )}
                        </Accordion>
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
    }).isRequired
};
