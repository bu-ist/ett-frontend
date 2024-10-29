import { Box, Avatar, } from "@chakra-ui/react";

export default function UserAvatar({user}) {
    return (
        <Box pt={7} pr={7}>
            {user !== null && 
                
                <Avatar
                    as="button"
                    backgroundColor="gray.300"
                    name={user.fullname}
                />
            }
        </Box>
    )
}
