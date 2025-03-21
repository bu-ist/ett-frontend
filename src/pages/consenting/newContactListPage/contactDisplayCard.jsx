import { Card, CardHeader, CardBody, Heading, Text, CardFooter, Button, Badge, HStack, Box, Divider } from "@chakra-ui/react";

import { AiOutlineClose } from 'react-icons/ai';
import { HiOutlinePencil } from "react-icons/hi";

export default function ContactDisplayCard({ contact, removeContact, handleEditContact, isDisabled = false }) {
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
            <CardFooter>
                <Button 
                    size="sm" 
                    mr="4" 
                    leftIcon={<HiOutlinePencil />}
                    onClick={() => { handleEditContact(contact.id) }}
                    isDisabled={isDisabled}
                >
                    Edit
                </Button>
                <Button 
                    size="sm" 
                    leftIcon={<AiOutlineClose />}
                    onClick={() => removeContact(contact.id)}
                    isDisabled={isDisabled}
                >
                    Remove
                </Button>
            </CardFooter>
        </Card>
    );
}
