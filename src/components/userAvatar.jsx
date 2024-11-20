import { Box, Avatar, Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverCloseButton, PopoverHeader, PopoverBody, Text, PopoverFooter, Button, Flex } from "@chakra-ui/react";

import { signOut } from '../lib/signOut';

export default function UserAvatar({user}) {
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
                        </PopoverBody>
                        <PopoverFooter>
                            <Flex justifyContent="flex-end">
                                <Button onClick={signOut} size="sm">Sign out</Button>
                            </Flex>
                        </PopoverFooter>
                    </PopoverContent>
                </Popover>
            }
        </Box>
    )
}
