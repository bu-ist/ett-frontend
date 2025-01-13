import { useContext } from 'react';
import Cookies from 'js-cookie';
import { Box, Avatar, Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverCloseButton, PopoverHeader, PopoverBody, Text, PopoverFooter, Button, Flex } from "@chakra-ui/react";

import { ConfigContext } from '../lib/configContext';

import { signOut } from '../lib/signOut';
import { getRoleForScope } from '../lib/getRoleForScope';

export default function UserAvatar({user}) {
    const { appConfig } = useContext(ConfigContext);
 
    const accessToken = Cookies.get('EttAccessJwt');
    const decodedAccessToken = accessToken ? JSON.parse(atob(accessToken.split('.')[1])) : null;

    const sessionRole = decodedAccessToken ? getRoleForScope(decodedAccessToken.scope) : 'none';

    const roles = {
        'consenting': 'Consenting Person',
        'auth-ind': 'Authorized Individual',
        'entity': 'Administrative Support Professional',
        'sysadmin': 'System Admin',
    }

    // Match the session role to the correct cognitoID, and use that to sign out.
    function handleSignOut() {
        let cognitoID = '';

        if (sessionRole === 'consenting') {
            cognitoID = appConfig.consentingPerson.cognitoID;
        }

        if (sessionRole === 'auth-ind') {
            cognitoID = appConfig.authorizedIndividual.cognitoID;
        }

        if (sessionRole === 'entity') {
            cognitoID = appConfig.entityAdmin.cognitoID;
        }

        if (sessionRole === 'sysadmin') {
            cognitoID = appConfig.sysadmin.cognitoID;
        }

        signOut(appConfig.cognitoDomain, cognitoID);
    }

    return (
        <Box pr={7}>
            {user !== null && 
                <Popover placement="bottom-end">
                    <PopoverTrigger>
                        <Avatar
                            as="button"
                            backgroundColor="gray.400"
                            name={user.fullname}
                        />
                    </PopoverTrigger>
                    <PopoverContent>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverHeader>Signed in</PopoverHeader>
                        <PopoverBody>
                            <Text>{user.fullname}</Text>
                            <Text>{user.email}</Text>
                            <Text>{roles[sessionRole]}</Text>
                        </PopoverBody>
                        <PopoverFooter>
                            <Flex justifyContent="flex-end">
                                <Button onClick={handleSignOut} size="sm">Sign out</Button>
                            </Flex>
                        </PopoverFooter>
                    </PopoverContent>
                </Popover>
            }
        </Box>
    )
}
