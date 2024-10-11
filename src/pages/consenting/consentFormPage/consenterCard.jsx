import { Card, CardBody, Stack, StackDivider, Box, Heading, Text } from "@chakra-ui/react";

export default function ConsenterCard({ consentData }) {
    return (
        <Card>
            <CardBody>
                <Stack divider={<StackDivider />} spacing="4">
                    <Box>
                        <Heading as="h3" size="xs" textTransform="uppercase">Full Name</Heading>
                        <Text>{consentData.fullName}</Text>
                    </Box>
                    <Box>
                        <Heading as="h3" size="xs" textTransform="uppercase">Phone</Heading>
                        <Text>{consentData.consenter.phone_number}</Text>
                    </Box>
                    <Box>
                        <Heading as="h3" size="xs" textTransform="uppercase">Email</Heading>
                        <Text>{consentData.consenter.email}</Text>
                    </Box>
                </Stack>
            </CardBody>
        </Card>
    );
}