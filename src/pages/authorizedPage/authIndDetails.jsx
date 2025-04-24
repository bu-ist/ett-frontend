import { 
    Heading, Card, Text, CardBody, HStack, Box, 
    StackDivider, Button, useDisclosure
} from "@chakra-ui/react";
import { HiPencil } from "react-icons/hi";
import PropTypes from 'prop-types';
import EditExistingAuthIndModal from './authIndDetails/editExistingAuthIndModal';

export default function AuthIndDetails({ userInfo, setUserInfo }) {
    const { isOpen, onOpen, onClose } = useDisclosure();

    // Check if userInfo.delegate exists and is not empty
    const hasDelegate = userInfo.delegate && Object.keys(userInfo.delegate).length > 0;

    const handleSaveSuccess = (updatedData) => {
        // Create a new user info object that preserves existing data
        // but updates with the new values from the API response
        const newUserInfo = {
            ...userInfo,
            fullname: updatedData.fullname,
            title: updatedData.title,
            email: updatedData.email,
            phone_number: updatedData.phone_number,
        };

        // Only include delegate if it exists in the updated data
        // This ensures delegate is removed if it was removed in the form
        if (updatedData.delegate) {
            newUserInfo.delegate = updatedData.delegate;
        } else {
            // Explicitly remove delegate if it's not in the updated data
            delete newUserInfo.delegate;
        }

        // Update the parent component's state
        setUserInfo(newUserInfo);
    };

    return (
        <Card my="2em">
            <CardBody>
                <HStack align="top" spacing={16} divider={<StackDivider borderColor="gray.200" />}>
                    <Box>
                        <HStack justify="space-between" w="100%" mb="4">
                            <Heading as="h3" size="md">{userInfo.fullname}</Heading>
                            <Button
                                leftIcon={<HiPencil />}
                                size="sm"
                                onClick={onOpen}
                            >
                                Edit
                            </Button>
                        </HStack>
                        {userInfo.title && <Text>{userInfo.title}</Text>}
                        {userInfo.email && <Text>{userInfo.email}</Text>}
                        {userInfo.phone_number && <Text>{userInfo.phone_number}</Text>}
                    </Box>
                    {hasDelegate && 
                        <Box>
                            <Heading as="h4" size="sm">Delegated Contact</Heading>
                            <Text>{userInfo.delegate.fullname}</Text>
                            <Text>{userInfo.delegate.email}</Text>
                            <Text>{userInfo.delegate.phone_number}</Text>
                        </Box>
                    }
                </HStack>

                <EditExistingAuthIndModal
                    isOpen={isOpen}
                    onClose={onClose}
                    userInfo={userInfo}
                    onSaveSuccess={handleSaveSuccess}
                />
            </CardBody>
        </Card>
    );
}

AuthIndDetails.propTypes = {
    userInfo: PropTypes.shape({
        fullname: PropTypes.string,
        title: PropTypes.string,
        email: PropTypes.string,
        phone_number: PropTypes.string,
        delegate: PropTypes.shape({
            fullname: PropTypes.string,
            email: PropTypes.string,
            phone_number: PropTypes.string,
            title: PropTypes.string
        })
    }).isRequired
};
