import PropTypes from 'prop-types';
import { useState } from 'react';

import {
    Text,
    VStack,
    HStack,
    Card,
    CardBody,
    Button,
    Heading,
    useDisclosure
} from '@chakra-ui/react';

import { HiOutlinePencil, HiOutlinePlusSm } from 'react-icons/hi';
import { AiOutlineClose } from 'react-icons/ai';


export default function CorrectAffiliates({correctableAffiliates, consentData, formConstraint, entityId}) {
    const [pendingChanges, setPendingChanges] = useState({
        updates: [],
        appends: [],
        deletes: []
    });
    
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [editMode, setEditMode] = useState('edit'); // 'edit' or 'add'

    // If there are no correctable affiliates, return null to render nothing.
    if (!correctableAffiliates || correctableAffiliates.length === 0) {
        return null;
    }

    const handleEdit = (email) => {
        setSelectedEmail(email);
        setEditMode('edit');
        onOpen();
    };

    const handleDelete = (email) => {
        setPendingChanges(prev => ({
            ...prev,
            deletes: [...prev.deletes, email]
        }));
    };

    const handleAdd = () => {
        setSelectedEmail(null);
        setEditMode('add');
        onOpen();
    };

    return (
        <VStack spacing={4} align="stretch" w="100%">
            <Card>
                <CardBody>
                    <VStack spacing={4} align="stretch">
                        <Heading size="md" color="gray.600">
                            Existing Exhibit Form Contacts
                        </Heading>
                        <Text>
                            There is an existing exhibit form for this entity. You can correct the contacts below.
                        </Text>
                        
                        {correctableAffiliates.map((email, index) => (
                            <Card key={index} variant="outline" bg={pendingChanges.deletes.includes(email) ? "gray.100" : "white"}>
                                <CardBody>
                                    <HStack justify="space-between">
                                        <Text>{email}</Text>
                                        <HStack>
                                            <Button
                                                leftIcon={<HiOutlinePencil />}
                                                aria-label="Edit contact"
                                                size="sm"
                                                onClick={() => handleEdit(email)}
                                                isDisabled={pendingChanges.deletes.includes(email)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                leftIcon={<AiOutlineClose />}
                                                aria-label="Remove contact"
                                                size="sm"
                                                colorScheme={pendingChanges.deletes.includes(email) ? "gray" : "red"}
                                                onClick={() => handleDelete(email)}
                                                isDisabled={pendingChanges.deletes.includes(email)}
                                            >
                                                Remove
                                            </Button>
                                        </HStack>
                                    </HStack>
                                </CardBody>
                            </Card>
                        ))}
                        
                        <Button
                            leftIcon={<HiOutlinePlusSm />}
                            onClick={handleAdd}
                            alignSelf="flex-start"
                        >
                            Add New Contact
                        </Button>
                    </VStack>
                </CardBody>
            </Card>
        </VStack>
    );
}

CorrectAffiliates.propTypes = {
    correctableAffiliates: PropTypes.arrayOf(
        PropTypes.string
    ).isRequired,
    consentData: PropTypes.object.isRequired,
    formConstraint: PropTypes.string.isRequired,
    entityId: PropTypes.string.isRequired
};
