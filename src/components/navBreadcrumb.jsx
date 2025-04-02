import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react';
import { useLocation, Link } from 'react-router-dom';
import { HiChevronDoubleRight } from 'react-icons/hi';

const NavBreadcrumb = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter(Boolean);

    // Assign names to the paths for the breadcrumb; this could possibly be in the router file.
    const navNames = {
        'consenting': 'Consenting Person', // Consenting Person
        'register': 'Register',
        'consent-form': 'Consent Form',
        'add-exhibit-form': 'Add Exhibit Form',
        'auth-ind': 'Authorized Individual', // Authorized Individual
        'sign-up': 'Registration',
        'entity': 'Administrative Support', // Entity Admin
        'acknowledge': 'Register Entity',
        'amend': 'Amend Registration',
        'sysadmin': 'System Admin', // System Admin
        'send-invitation': 'Send Invitation',
        'logout': 'Logout', // Other
        'about': 'About',
        'privacy': 'Privacy Policy',
        'terms': 'Terms of Use',
    };


    return (
        <Breadcrumb separator={<HiChevronDoubleRight color="gray" />}>
            {pathnames.length > 0 && (
                <BreadcrumbItem>
                    <BreadcrumbLink as={Link} to='/'>Home</BreadcrumbLink>
                </BreadcrumbItem>
            )}
        {pathnames.map((path, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
            const isCurrentPage = index === pathnames.length - 1;

            return (
            <BreadcrumbItem isCurrentPage={isCurrentPage} key={index}>
                <BreadcrumbLink as={Link} to={routeTo}>
                    {navNames[path]}
                </BreadcrumbLink>
            </BreadcrumbItem>
            );
        })}
        </Breadcrumb>
    );
};

export default NavBreadcrumb;
