import { Card, CardHeader, Heading, CardBody, Text, HStack, Box, StackDivider, Button } from "@chakra-ui/react";
import { AiOutlineClose } from 'react-icons/ai'; 

// Display card to show entity information, with the Entity Adminstrator's information and information on any existing Authorized Individuals.

export default function EntityInfoCard({ inviteInfo }) {
    // If there are users in the inviteInfo, get the email of the user whose role is 'RE_ADMIN'.
    const adminUser = inviteInfo?.users?.find(user => user.role === 'RE_ADMIN') || '';
    const { entity: { entity_name } } = inviteInfo;

    return (
        <Card my="4">
            <CardHeader>
                <Heading as="h3" size="md">Invitation from {entity_name} </Heading>
            </CardHeader>
            <CardBody>
                <HStack align="top" spacing={16} divider={<StackDivider borderColor="gray.200" />}>
                    <Box>
                        <Heading as="h4" size="sm">Entity Administrator</Heading>
                        <Text>{adminUser.fullname}</Text>
                        <Text>{adminUser.title}</Text>
                        <Text>{adminUser.email}</Text>
                        <Text>{adminUser.phone_number}</Text>
                    </Box>
                    <Box>
                        <Heading as="h4" size="sm">Authorized Individuals</Heading>
                        <Text>No registered Authorized Individuals, you will be the first.</Text>
                    </Box>
                    <Box>
                        <Heading as="h4" size="sm">Options</Heading>
                        <Text>Optionally reject the entity if there is a problem with the invitation</Text>
                        <Button
                            my="4"
                            leftIcon={<AiOutlineClose/>} 
                            onClick={() => alert('Not yet implemented')}
                        >
                            Reject Entity
                        </Button>
                    </Box>
                </HStack>
            </CardBody>
        </Card>
    )
}
