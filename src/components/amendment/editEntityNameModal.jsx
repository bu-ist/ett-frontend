import { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalFooter, ModalOverlay, useDisclosure, FormControl, Text, FormLabel, Input, Spinner, VStack, Alert, AlertIcon, FormHelperText, FormErrorMessage, ButtonGroup, Box, AlertTitle, AlertDescription } from '@chakra-ui/react';

import { AiOutlineClose } from 'react-icons/ai';

import { ConfigContext } from "../../lib/configContext";

import { amendEntityNameAI } from '../../lib/amendment/amendEntityNameAI';

export default function EditEntityNameModal({ entity, fetchData }) {
    const { appConfig } = useContext(ConfigContext);

    // UI State
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [apiState, setApiState] = useState('idle');

    const [apiError, setApiError] = useState(null);

    // Set the initial state of the form data using react-hook-form.
    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = useForm();

    async function processNameChange( formData ) {
        const { newName } = formData;

        console.log('Changing name to: ', newName);

        // Get the access token from the cookies.
        const accessToken = Cookies.get('EttAccessJwt');

        setApiState('loading');

        // Send the name change to the API.
        const nameChangeResult = await amendEntityNameAI(appConfig, accessToken, entity.entity_id, newName);
        console.log(JSON.stringify(nameChangeResult));

        if (nameChangeResult.payload?.ok) {
            console.log('Name change successful');

            // Update the entity name in the UI.
            //updateEntity({ ...entity, name: newName });

            setApiState('success');
        } else {
            setApiState('error');
            setApiError(nameChangeResult.message);
        }
    }

    function handleClose() {
        onClose();
        
        // To reflect the changes in the UI, trigger a re-fetch of the entity data.
        if (apiState === 'success') {
            fetchData();
        }
        setApiState('idle');
    }

    return (
        <>
            <Button onClick={onOpen}>Change Entity Name</Button>
            <Modal size="xl" isOpen={isOpen} onClose={handleClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Change Entity Name</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text mb="4">Current Name: {entity.entity_name}</Text>
                        <Text mb="4">
                            Enter a new name and click &quot;Change Name&quot; to amend the entity registration with the new name.
                        </Text>
                        <form onSubmit={handleSubmit(processNameChange)}>
                            <FormControl isInvalid={errors.newName}>
                                <FormLabel>New Entity Name</FormLabel>
                                <Input
                                    id="newName"
                                    type="text"
                                    isDisabled={apiState === 'success'}
                                    placeholder="New Entity Name"
                                    {...register('newName', { 
                                        required: 'Must supply a new name',
                                    })}
                                />
                               <Box minH="1.5rem">
                                    <FormErrorMessage>
                                        {errors.newName && errors.newName.message}
                                    </FormErrorMessage>
                                </Box>
                            </FormControl>
                        </form>
                        {apiState === 'success' &&
                            <VStack mb="4">
                                <Alert status='success'>
                                    <AlertIcon />
                                    Name Change Successful
                                </Alert>
                            </VStack>
                        }
                        {apiState === 'error' &&
                            <VStack mb="4">
                                <Alert status="error">
                                    <AlertIcon />
                                    <AlertTitle>Name Change Error</AlertTitle>
                                    <AlertDescription>{apiError ? apiError : 'Unknown Error, API not responsive'}</AlertDescription>
                                </Alert>
                            </VStack>
                        }
                    </ModalBody>
                    <ModalFooter>
                        {apiState !== 'success' && apiState !== 'error' &&
                            <ButtonGroup spacing="4">
                                <Button leftIcon={<AiOutlineClose />} onClick={handleClose}>Cancel</Button>
                                <Button
                                    onClick={handleSubmit(processNameChange)}
                                    isLoading={apiState === 'loading'}
                                >
                                    Change Name
                                </Button>
                            </ButtonGroup>
                        }
                        {apiState === 'success' &&
                            <Button onClick={handleClose}>Done</Button>
                        }
                        {apiState === 'error' &&
                            <Button onClick={handleClose}>Sorry, try reloading</Button>
                        }
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
