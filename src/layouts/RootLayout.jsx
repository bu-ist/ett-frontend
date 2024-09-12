import { Container, Heading } from '@chakra-ui/react';
import { Link, Outlet } from 'react-router-dom';

export default function RootLayout() {
    return (
        <Container maxWidth="5xl">
            <Heading my="30px">
                <Link to="/"> Ethical Transparency Tool</Link>
            </Heading>
            <div>
                <Outlet />
            </div>
        </Container>
    );
}
