import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import { useState, useContext } from 'react';
import { nanoid } from 'nanoid';
import { Link as RouterLink } from 'react-router-dom';

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
    useToast,
    Badge,
    Divider,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Box,
    Link,
    Center,
} from '@chakra-ui/react';

import PendingChangesSummary from './correctAffiliates/pendingChangesSummary';

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
    const [errorMessage, setErrorMessage] = useState('');
    const [submittedChanges, setSubmittedChanges] = useState({
        updates: [],
        appends: [],
        deletes: []
    });

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
        // Find existing contact in updates
        const existingUpdate = pendingChanges.updates.find(update => update.email === email);
        
        let newContact;
        if (existingUpdate) {
            // If the contact has already been edited, map the field names from update format to form format
            newContact = {
                id: existingUpdate.id,
                contactEmail: existingUpdate.email,
                organizationType: existingUpdate.affiliateType,
                organizationName: existingUpdate.org,
                contactName: existingUpdate.fullname,
                contactTitle: existingUpdate.title,
                contactPhone: existingUpdate.phone_number
            };
        } else {
            // If this is the first edit, just set the email
            newContact = { 
                id: nanoid(),
                contactEmail: email
            };
        }
        
        setCurrentContact(newContact);
        setSelectedEmail(email);
        setEditMode('edit');
        onOpen();
    };

    const handleDelete = (email) => {
        // Only add to deletes if email is valid
        if (email) {
            setPendingChanges(prev => ({
                ...prev,
                deletes: [...prev.deletes, email]
            }));
        }
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
                    ...prev.updates.filter(u => u.email !== selectedEmail),
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
            const response = await correctExhibitForm(
                appConfig,
                accessToken,
                consentData.consenter.email,
                {
                    entity_id: entityId,
                    ...pendingChanges
                }
            );
            
            // Check for API-level errors in the response
            if (response?.payload?.error) {
                setSubmitState('error');
                setErrorMessage(response.message || "An error occurred while submitting changes");
                return;
            }
            
            // Save a copy of changes before clearing them
            setSubmittedChanges({ ...pendingChanges });
            
            setSubmitState('success');
            
            // Reset the pending changes
            setPendingChanges({
                updates: [],
                appends: [],
                deletes: []
            });

        } catch (error) {
            setSubmitState('error');
            setErrorMessage(error.message || "An unexpected error occurred");
        }
    };

    // Render based on submit state
    if (submitState === 'success') {
        return (
            <VStack spacing={4} align="stretch" w="100%">
                <Card>
                    <CardBody>
                        <VStack spacing={6} align="stretch">
                            <Alert status="success" variant="left-accent" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center" borderRadius="md" py={6}>
                                <AlertIcon boxSize="40px" mr={0} />
                                <AlertTitle mt={4} mb={1} fontSize="lg">
                                    Exhibit Form Corrections Submitted
                                </AlertTitle>
                                <AlertDescription maxWidth="sm">
                                    Your corrections to the exhibit form have been submitted successfully. The changes will be processed and applied to the exhibit form.
                                </AlertDescription>
                            </Alert>
                            
                            <Box>
                                <Heading size="sm" mb={2}>Summary of Changes</Heading>
                                <PendingChangesSummary 
                                    changes={submittedChanges} 
                                    title="The following changes have been submitted:"
                                />
                            </Box>
                            
                            <Divider />
                            
                            <Center>
                                <Link as={RouterLink} to="/consenting">
                                    <Button colorScheme="blue" size="lg">
                                        Return to Dashboard
                                    </Button>
                                </Link>
                            </Center>
                        </VStack>
                    </CardBody>
                </Card>
            </VStack>
        );
    }

    if (submitState === 'error') {
        return (
            <VStack spacing={4} align="stretch" w="100%">
                <Card>
                    <CardBody>
                        <VStack spacing={6} align="stretch">
                            <Alert status="error" variant="subtle" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center" borderRadius="md" py={6}>
                                <AlertIcon boxSize="40px" mr={0} />
                                <AlertTitle mt={4} mb={1} fontSize="lg">
                                    Error Submitting Corrections
                                </AlertTitle>
                                <AlertDescription maxWidth="sm">
                                    {errorMessage || "There was an error submitting your corrections. Please try again or contact support if the issue persists."}
                                </AlertDescription>
                            </Alert>
                            
                            <Divider />
                            
                            <HStack spacing={4} justify="center">
                                <Button 
                                    onClick={() => setSubmitState('idle')} 
                                    colorScheme="blue"
                                >
                                    Try Again
                                </Button>
                                <Link as={RouterLink} to="/consenting">
                                    <Button variant="outline">
                                        Return to Dashboard
                                    </Button>
                                </Link>
                            </HStack>
                        </VStack>
                    </CardBody>
                </Card>
            </VStack>
        );
    }

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
                        
                        {correctableAffiliates.map((email, index) => {
                            const isDeleted = pendingChanges.deletes.includes(email);
                            const isUpdated = pendingChanges.updates.some(u => u.email === email);
                            
                            return (
                                <Card key={index} variant="outline" bg={isDeleted ? "gray.100" : "white"}>
                                    <CardBody>
                                        <HStack justify="space-between" align="center">
                                            <VStack align="start" spacing={1}>
                                                <Text>{email}</Text>
                                                {isUpdated && (
                                                    <Badge colorScheme="blue" fontSize="xs">
                                                        Updated
                                                    </Badge>
                                                )}
                                                {isDeleted && (
                                                    <Badge colorScheme="red" fontSize="xs">
                                                        Marked for Removal
                                                    </Badge>
                                                )}
                                            </VStack>
                                            <HStack>
                                                <Button
                                                    leftIcon={<HiOutlinePencil />}
                                                    aria-label="Edit contact"
                                                    size="sm"
                                                    onClick={() => handleEdit(email)}
                                                    isDisabled={isDeleted}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    leftIcon={<AiOutlineClose />}
                                                    aria-label="Remove contact"
                                                    size="sm"
                                                    colorScheme={isDeleted ? "gray" : "red"}
                                                    onClick={() => handleDelete(email)}
                                                    isDisabled={isDeleted}
                                                >
                                                    Remove
                                                </Button>
                                            </HStack>
                                        </HStack>
                                    </CardBody>
                                </Card>
                            );
                        })}
                        
                        <Button
                            leftIcon={<HiOutlinePlusSm />}
                            onClick={handleAdd}
                            alignSelf="flex-start"
                        >
                            Add New Contact
                        </Button>

                        <Divider my="4" />

                        <PendingChangesSummary changes={pendingChanges} />

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
                    // Only call handleDelete if we're editing an existing contact (not adding a new one)
                    if (editMode === 'edit' && selectedEmail) {
                        handleDelete(selectedEmail);
                    }
                    onClose();
                }}
                correctionsMode={true}
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
    formConstraint: PropTypes.oneOf(['current', 'other', 'both']).isRequired,
    entityId: PropTypes.string.isRequired,
};
