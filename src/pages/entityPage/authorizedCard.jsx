import { Card, CardHeader, Heading, CardBody, CardFooter, Text } from "@chakra-ui/react";

import InviteUsersModal from "./inviteUsersModal";

export default function AuthorizedCard({ entity }) {

    const authInds = entity.users.filter(user => user.role === 'RE_AUTH_IND');

    return (
        <Card>
            <CardHeader>
                <Heading as="h4" size="md">Authorized Individuals</Heading>
            </CardHeader>
            <CardBody>
                {entity.users.length == 0 && <Text>None</Text>}
                {authInds.map((member, index) => (
                    <Text key={index}>{member.fullname}</Text>
                ))}
            </CardBody>
            <CardFooter>
                <InviteUsersModal numUsers={entity.users.length} entity={entity} />
            </CardFooter>
        </Card>
    );
}
