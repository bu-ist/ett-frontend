import { Card, CardHeader, Heading, CardBody, CardFooter, Text, Icon, Stack, Badge } from "@chakra-ui/react";
import { HiMinusCircle } from "react-icons/hi";

import InviteUsersModal from "./inviteUsersModal";

export default function AuthorizedCard({ entity }) {

    const authInds = entity.users.filter(user => user.role === 'RE_AUTH_IND');
    const authIndsNames = authInds.map(member => member.fullname);

    return (
        <Card>
            <CardHeader>
                <Heading as="h3" size="lg" color="gray.600">Authorized Individuals</Heading>
            </CardHeader>
            <CardBody>
                <Text>
                    Lorem ipsum minim anim id do nisi aliqua. Consequat cillum sint qui ad aliqua proident nostrud. Cillum ullamco consectetur mollit eu labore amet ullamco mollit dolor veniam adipisicing veniam nulla ex. Quis irure minim id commodo dolore anim nulla aliqua reprehenderit pariatur. 
                </Text>
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
