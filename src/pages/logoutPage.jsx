import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { Card, CardBody, CardHeader, Heading, Icon } from '@chakra-ui/react';
import { BsFileEarmarkLock2 } from "react-icons/bs";

export default function LogoutPage() {
    useEffect(() => {
        // Clear the cookies when the component mounts
        Cookies.remove('EttAccessJwt');
        Cookies.remove('EttIdJwt');
    }, []);

    return (
        <Card my={6} align="center">
            <CardHeader><Heading as="h2" color="gray.500" >Logged out</Heading></CardHeader>
            <CardBody>
                <Icon color="gray.500" as={BsFileEarmarkLock2} w={24} h={24} />
            </CardBody>
        </Card>
    );
}
