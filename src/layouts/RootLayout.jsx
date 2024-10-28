import { Container, Heading } from '@chakra-ui/react';
import { Link, Outlet } from 'react-router-dom';

import NavBreadcrumb from '../components/navBreadcrumb';
import SiteFooter from "../components/siteFooter";

export default function RootLayout() {
    return (
        <Container maxWidth="5xl">
            <Heading as="h1" size="2xl" mt="30px">
                <Link to="/"> Ethical Transparency Tool</Link>
            </Heading>
            <NavBreadcrumb />
            <div>
                <Outlet />
            </div>
            <SiteFooter />
        </Container>
    );
}
