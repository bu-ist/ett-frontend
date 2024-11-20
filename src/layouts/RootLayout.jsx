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
                <Box backgroundColor="gray.100" padding={3.5} mb={4}>
                    <Flex mt={4} minWidth='max-content' alignItems='center' gap='2'>
                        <Heading as="h1" size="2xl">
                            <Link to="/">Ethical Transparency Tool</Link>
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
