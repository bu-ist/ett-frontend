import { useState } from 'react';
import { Box, Container, Flex, Heading, Spacer } from '@chakra-ui/react';
import { Link, Outlet } from 'react-router-dom';

import { UserContext } from '../lib/userContext';

import UserAvatar from "../components/userAvatar";
import NavBreadcrumb from '../components/navBreadcrumb';
import SiteFooter from "../components/siteFooter";

export default function RootLayout() {

    const [user, setUser] = useState(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            <Container maxWidth="5xl">
                <Box backgroundColor="gray.50">
                    <Flex minWidth='max-content' alignItems='center' gap='2'>
                        <Heading as="h1" size="2xl" mt="30px">
                            <Link to="/"> Ethical Transparency Tool</Link>
                        </Heading>
                        <Spacer />
                        <UserAvatar user={user} />
                    </Flex>
                    <NavBreadcrumb />
                </Box>
                <div>
                    <Outlet />
                </div>
                <SiteFooter />
            </Container>
        </UserContext.Provider>
    );
}
