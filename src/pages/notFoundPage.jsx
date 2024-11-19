import { Card, CardBody, CardHeader, Heading, Icon, Text, CardFooter } from "@chakra-ui/react";
import { HiExclamation } from "react-icons/hi";

export default function NotFoundPage() {
    return (
        <Card align="center">
            <CardHeader>
                <Heading as="h2" color="gray.500">404 Not Found</Heading>
            </CardHeader>
            <CardBody>
                    <Icon as={HiExclamation} color="gray.500" w={32} h={32} />
            </CardBody>
            <CardFooter>
                    <Text>Sorry, the page you are looking was not found.</Text>
            </CardFooter>
        </Card>
    );
}