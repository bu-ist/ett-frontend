import { Card, CardBody, CardHeader, Code, FormControl, Heading, Text } from "@chakra-ui/react";

export default function SignUpAuthIndForm({entityInfo}) {

    const  { entity, invitation, users }  = entityInfo;

    // Find the user with a role property of 'RE_ADMIN', which is the administator of the entity.
    const entityAdmin = users.find(user => user.role === 'RE_ADMIN');

    return (
        <>
            <Heading as="h3" mb="1em" size="md">Register Account</Heading>
            <Card variant="filled">
                <CardHeader>
                    <Heading as="h4" size="sm">{entity.entity_name}</Heading>
                </CardHeader>
                <CardBody>
                    <Heading as="h5" size="xs">Entity Administrator</Heading>
                    <Text>{entityAdmin.fullname}</Text>
                    <Text>{entityAdmin.title}</Text>
                    <Text>{entityAdmin.email}</Text>
                    <Text>{entityAdmin.phone_number}</Text>
                </CardBody>
            </Card>
            <FormControl></FormControl>
        </>
    );
}
