import { useState } from 'react';
import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure, Spinner, Alert, AlertIcon } from "@chakra-ui/react";
import { HiOutlineSave } from "react-icons/hi";

import { saveExhibitFormAPI } from '../../../../lib/consenting/saveExhibitFormAPI';
import { ConfigContext } from '../../../../lib/configContext';
import { useContext } from 'react';
import Cookies from 'js-cookie';

export default function SaveButton({ contacts, formConstraint, entityId, singleEntityFormsSigned }) {
    const { appConfig } = useContext(ConfigContext);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [apiState, setApiState] = useState('idle');
    const [saveResult, setSaveResult] = useState(null);

    const matchingSavedForm = saveResult?.consenter?.exhibit_forms.find( (form) => (
        form.entity_id === entityId && form.constraint === formConstraint
    ));

    async function handleSave() {
        setApiState('loading');
        
        try {
            const accessToken = Cookies.get('EttAccessJwt');
            const idToken = Cookies.get('EttIdJwt');
            const email = JSON.parse(atob(idToken.split('.')[1])).email;

            // Create a copy of contacts to avoid mutating the original state
            let contactsToSave = [...contacts];
            
            // If formConstraint is "other", then the organizationType must change from EMPLOYER to EMPLOYER_PRIOR
            if (formConstraint === 'other') {
                contactsToSave = contactsToSave.map(contact => 
                    contact.organizationType === 'EMPLOYER' 
                        ? { ...contact, organizationType: 'EMPLOYER_PRIOR' }
                        : contact
                );
            }

            const response = await saveExhibitFormAPI(appConfig, accessToken, contactsToSave, entityId, email, formConstraint);
            
            if (response.message === 'Ok') {
                setSaveResult(response.payload);
                setApiState('success');
            } else {
                setApiState('error');
            }
        } catch (error) {
            console.error('Error saving form:', error);
            setApiState('error');
        }
        
        onOpen();
    }

    function handleClose() {
        setApiState('idle');
        setSaveResult(null);
        onClose();
    }

    return (
        <>
            <Button
                leftIcon={<HiOutlineSave />}
                onClick={handleSave}
                isLoading={apiState === 'loading'}
                backgroundColor="#f2e7d3"
                _hover={{ bg: "orange.100" }}
                isDisabled={apiState === 'loading' || singleEntityFormsSigned || contacts.length === 0}
            >
                Save
            </Button>
            <Modal isOpen={isOpen} onClose={handleClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Save Status</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {apiState === 'success' && (
                            <>
                               <Alert status='success'>
                                    <AlertIcon />
                                    Form data saved successfully.
                                </Alert>
                                <Text mt="4">
                                    Your work will be retained until {new Date(new Date(matchingSavedForm.create_timestamp).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()} (7 days after the initial save). You can return to complete your form at any time during this period.
                                </Text>
                                {saveResult?.savedAt && (
                                    <Text mt="2" fontSize="sm" color="gray.500">
                                        Last saved: {new Date(saveResult.savedAt).toLocaleString()}
                                    </Text>
                                )}
                            </>
                        )}
                        {apiState === 'error' && (
                            <Text color="red.500">
                                There was an error saving your form. Please try again.
                            </Text>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={handleClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
