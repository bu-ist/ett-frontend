import { Heading, Card, CardHeader, Text, CardBody, HStack, Box, StackDivider } from "@chakra-ui/react";

export default function AuthIndDetails({ userInfo }) {
    return (
        <Card my="2em">
            <CardHeader>
                <Heading as="h3" size="md">{userInfo.fullname}</Heading>
                {userInfo.title && <Text>{userInfo.title}</Text>
                }
            </CardHeader>
            <CardBody>
                <HStack 
                    divider={<StackDivider borderColor="gray.2oo" />}
                    spacing={10}
                >
                    <Box>
                        <Heading as="h4" size="sm">Entity</Heading>
                        <Text>
                            {userInfo.entity.entity_name}
                        </Text>
                    </Box>
                    <Box>
                        <Heading mt="2em" as="h4" size="sm">Administrator</Heading>
                        <Text>
                            {userInfo.entity.users[0].fullname}
                        </Text>
                    <Text>{userInfo.entity.users[0].email}</Text>
                    </Box>
                </HStack>
            </CardBody>
        </Card>
    );
}
