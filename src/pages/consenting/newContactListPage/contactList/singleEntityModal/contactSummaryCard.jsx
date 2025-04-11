import { Card, CardBody, Heading, Text, Badge, HStack, Box, Divider } from "@chakra-ui/react";

export default function ContactSummaryCard({ contact }) {
    return (
        <Card mb="4">
            <CardBody>
                <Heading as="h4" mb="4" size="sm">{contact.organizationName} <Badge ml="8">{contact.organizationType}</Badge></Heading>
                <HStack>
                    <Box width="sm">
                        <Text>{contact.contactName}</Text>
                        <Text>{contact.contactTitle}</Text>
                    </Box>
                    <Divider orientation="vertical" />
                    <Box>
                        <Text>{contact.contactEmail}</Text>
                        <Text>{contact.contactPhone}</Text>
                    </Box>
                </HStack>
            </CardBody>
        </Card>
    );
}
