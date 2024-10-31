import { Card, CardHeader, Heading, CardBody, CardFooter, Text, Icon } from "@chakra-ui/react";
import { HiMinusCircle } from "react-icons/hi";

import InviteUsersModal from "./inviteUsersModal";

export default function AuthorizedCard({ entity }) {

    const authInds = entity.users.filter(user => user.role === 'RE_AUTH_IND');
    const authIndsNames = authInds.map(member => member.fullname);

    return (
        <Card>
            <CardHeader>
                <Heading as="h4" size="md">Authorized Individuals</Heading>
            </CardHeader>
            <CardBody>
                {entity.users.length == 0 && 
                    <Stack direction="row"><Icon as={HiMinusCircle} color="gray.400" boxSize="6" /><Text>No Authorized Individuals currently registered</Text></Stack>
                }
                {entity.users.length == 1 && 
                    <>
                        <Text>{authIndsNames[0]}</Text>
                        <Stack mt="2" direction="row"><Badge>pending</Badge><Text as="i" fontSize="sm">Second invitation not yet accepted</Text></Stack>
                    </>
                }
                {entity.users.length == 2 && authIndsNames.map((fullname, index) => (
                    <Text key={index}>{fullname}</Text>
                ))}
            </CardBody>
            <CardFooter>
            {entity.users.length == 0 && 
                <InviteUsersModal numUsers={entity.users.length} entity={entity} />
            }
            </CardFooter>
        </Card>
    );
}
