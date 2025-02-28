import { Heading, Card, CardHeader, Text, CardBody, HStack, Box, StackDivider, Divider } from "@chakra-ui/react";

export default function AuthIndDetails({ userInfo }) {

    // Get the entity administrator as the user in the entity users array with a role of "RE_ADMIN".
    const entityAdmin = userInfo.entity.users.find(user => user.role === 'RE_ADMIN');

    // Check if userInfo.delegate exists and is not empty
    const hasDelegate = userInfo.delegate && Object.keys(userInfo.delegate).length > 0;

    return (
        <Card my="2em">
            <CardBody>
                    <HStack align="top" spacing={16} divider={<StackDivider borderColor="gray.200" />}>
                        
                    <Box>
                        <Heading as="h3" size="md">{userInfo.fullname}</Heading>
                        {userInfo.title && <Text>{userInfo.title}</Text>}
                        {userInfo.email && <Text>{userInfo.email}</Text>}
                        {userInfo.phone_number && <Text>{userInfo.phone_number}</Text>}
                    </Box>
                    {hasDelegate && 
                        <Box>
                            <Heading as="h4" size="sm">Delegated Contact</Heading>
                            <Text>{userInfo.delegate.fullname}</Text>
                            <Text>{userInfo.delegate.email}</Text>
                            <Text>{userInfo.delegate.phone_number}</Text>
                        </Box>
                    }
                </HStack>
            </CardBody>
        </Card>
    );
}
