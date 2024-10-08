import { Card, CardHeader, CardBody, Heading, Text } from "@chakra-ui/react";

export default function InvitationFromCard({ entity, entityAdmin }) {
    return (
        <Card mb="1em" variant="filled">
        <CardHeader>
            <Heading as="h4" size="sm">Invitation from {entity.entity_name}</Heading>
        </CardHeader>
        <CardBody>
            {entityAdmin != {} &&
                <>
                    <Heading as="h5" size="xs">Entity Administrator</Heading>
                    <Text>{entityAdmin.fullname}</Text>
                    <Text>{entityAdmin.title}</Text>
                    <Text>{entityAdmin.email}</Text>
                    <Text>{entityAdmin.phone_number}</Text>
                </>
            }
        </CardBody>
    </Card>
    );
}