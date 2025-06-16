import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import { useState, useContext } from 'react';
import { nanoid } from 'nanoid';

import { ConfigContext } from '../../../lib/configContext';
import { correctExhibitForm } from '../../../lib/consenting/correctExhibitFormAPI';

import ContactEditModal from './contactEditModal';

import {
    Text,
    VStack,
    HStack,
    Card,
    CardBody,
    Button,
    Heading,
    useDisclosure,
    useToast
} from '@chakra-ui/react';

import { HiOutlinePencil, HiOutlinePlusSm } from 'react-icons/hi';
import { AiOutlineClose } from 'react-icons/ai';


export default function CorrectAffiliates({
    correctableAffiliates, 
    consentData, 
    formConstraint, 
    entityId
}) {
    const { appConfig } = useContext(ConfigContext);
    const toast = useToast();
    const [submitState, setSubmitState] = useState('idle'); // idle, submitting, success, error

    const [pendingChanges, setPendingChanges] = useState({
        updates: [],
        appends: [],
        deletes: []
    });
    
    // For the ContactEditModal
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [editMode, setEditMode] = useState('edit');
    const [currentContact, setCurrentContact] = useState({});

    // If there are no correctable affiliates, return null to render nothing.
    if (!correctableAffiliates || correctableAffiliates.length === 0) {
        return null;
    }

    const handleEdit = (email) => {
        // Find existing contact in updates, or create new one with ID
        const existingUpdate = pendingChanges.updates.find(update => update.contactEmail === email);
        setCurrentContact(existingUpdate || { 
            id: nanoid(),
            contactEmail: email 
        });
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
        setCurrentContact({
            id: nanoid()
        });
        setSelectedEmail(null);
        setEditMode('add');
        onOpen();
    };

    const handleContactChange = (id, contact) => {
        if (editMode === 'edit') {
            setPendingChanges(prev => ({
                ...prev,
                updates: [
                    ...prev.updates.filter(u => u.contactEmail !== selectedEmail),
                    {
                        id,
                        affiliateType: contact.organizationType,
                        org: contact.organizationName,
                        email: contact.contactEmail,
                        fullname: contact.contactName,
                        title: contact.contactTitle,
                        phone_number: contact.contactPhone
                    }
                ]
            }));
        } else {
            setPendingChanges(prev => ({
                ...prev,
                appends: [
                    ...prev.appends,
                    {
                        id,
                        affiliateType: contact.organizationType,
                        org: contact.organizationName,
                        email: contact.contactEmail,
                        fullname: contact.contactName,
                        title: contact.contactTitle,
                        phone_number: contact.contactPhone
                    }
                ]
            }));
        }
        onClose();
    };

    const handleSubmit = async () => {
        const accessToken = Cookies.get('EttAccessJwt');
        if (!accessToken) {
            toast({
                title: "Not signed in",
                description: "You must be signed in to submit corrections",
                status: "error",
                duration: 5000,
            });
            return;
        }

        setSubmitState('submitting');
        try {
            await correctExhibitForm(
                appConfig,
                accessToken,
                consentData.consenter.email,
                {
                    entity_id: entityId,
                    ...pendingChanges
                }
            );
            
            setSubmitState('success');
            toast({
                title: "Changes submitted successfully",
                status: "success",
                duration: 5000,
            });
            
            // Reset the pending changes
            setPendingChanges({
                updates: [],
                appends: [],
                deletes: []
            });

        } catch (error) {
            setSubmitState('error');
            toast({
                title: "Error submitting changes",
                description: error.message,
                status: "error",
                duration: 5000,
            });
        }
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

                        <HStack spacing={4} justify="flex-end">
                            <Button
                                colorScheme="blue"
                                onClick={handleSubmit}
                                isLoading={submitState === 'submitting'}
                                loadingText="Submitting..."
                                isDisabled={
                                    submitState === 'submitting' || 
                                    (pendingChanges.updates.length === 0 && 
                                     pendingChanges.appends.length === 0 && 
                                     pendingChanges.deletes.length === 0)
                                }
                            >
                                Submit Changes
                            </Button>
                        </HStack>
                    </VStack>
                </CardBody>
            </Card>

            <ContactEditModal 
                isOpen={isOpen}
                onClose={onClose}
                isEditOrAdd={editMode}
                formConstraint={formConstraint}
                contact={currentContact}
                handleContactChange={(id, updatedContact) => handleContactChange(id, updatedContact)}
                removeContact={() => {
                    handleDelete(selectedEmail);
                    onClose();
                }}
            />
        </VStack>
    );
}

CorrectAffiliates.propTypes = {
    correctableAffiliates: PropTypes.arrayOf(
        PropTypes.string
    ).isRequired,
    consentData: PropTypes.shape({
        consenter: PropTypes.shape({
            email: PropTypes.string.isRequired
        }).isRequired,
        entities: PropTypes.arrayOf(PropTypes.shape({
            entity_id: PropTypes.string.isRequired,
            entity_name: PropTypes.string.isRequired,
        }))
    }).isRequired,
    formConstraint: PropTypes.string.isRequired,
    entityId: PropTypes.string.isRequired,
};
