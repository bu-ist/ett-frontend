import { useState, useEffect } from 'react';
import { Box, Container, Flex, Heading, Spacer } from '@chakra-ui/react';
import { Link, Outlet } from 'react-router-dom';

import { ConfigContext } from '../lib/configContext';
import { UserContext } from '../lib/userContext';

import { parseAppConfig } from "../lib/parseAppConfig";

import UserAvatar from "../components/userAvatar";
import NavBreadcrumb from '../components/navBreadcrumb';
import SiteFooter from "../components/siteFooter";

export default function RootLayout() {

    const [appConfig, setAppConfig] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Fetch the app config from the server, and set it in the config context.
        const fetchConfig = async () => {
            try {
                const response = await fetch('/parameters', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                setAppConfig(parseAppConfig(data));
            } catch (error) {
                console.error('Failed to fetch config:', error);
            }
        };

        fetchConfig();
    }, []);

    return (
        <ConfigContext.Provider value={{ appConfig }}>
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
        </ConfigContext.Provider>
    );
}
