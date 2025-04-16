import { useEffect, useState, useContext } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Cookies from 'js-cookie';

import { Box, Button, Center, Heading, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, 
    ModalHeader, ModalOverlay, Stack, Radio, RadioGroup, Spinner, useDisclosure, 
    FormControl, FormLabel, FormErrorMessage, NumberInput, NumberInputField, 
    NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, HStack, Text } from "@chakra-ui/react";
import {
    AutoComplete,
    AutoCompleteInput,
    AutoCompleteItem,
    AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";

import { ConfigContext } from '../../lib/configContext';
import { sendExhibitRequestAPI } from '../../lib/auth-ind/sendExhibitRequestAPI';
import { searchConsentersAPI } from '../../lib/auth-ind/searchConsentersAPI';
import ExhibitSuccessModalBody from "./consentersAutocomplete/exhibitSuccessModalBody";

export default function ExhibitFormRequest({ entityId }) {
    const { appConfig } = useContext(ConfigContext);
    const { apiStage, authorizedIndividual: { apiHost } } = appConfig;
    const { isOpen, onOpen, onClose } = useDisclosure();

    // State for autocomplete
    const [options, setOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [apiState, setApiState] = useState('idle');

    // Setup react-hook-form
    const { handleSubmit, control, watch, setValue, reset, formState: { errors } } = useForm({
        defaultValues: {
            consenter: null,
            constraint: 'both',
            searchInput: '',
            lookbackType: 'unlimited',
            lookbackYears: 1
        }
    });

    // Watch values
    const searchValue = watch('searchInput');
    const selectedConsenter = watch('consenter');
    const lookbackType = watch('lookbackType');

    // Update search input display when consenter is selected
    useEffect(() => {
        if (selectedConsenter) {
            // Small delay to ensure proper state update
            setTimeout(() => {
                setValue('searchInput', `${selectedConsenter.fullname} (${selectedConsenter.email})`);
            }, 0);
        }
    }, [selectedConsenter, setValue]);

    async function fetchConsenters(query) {
        const accessToken = Cookies.get('EttAccessJwt');
        const result = await searchConsentersAPI(apiHost, apiStage, accessToken, query);

        if (result.payload.ok) {
            setOptions(result.payload.consenters);
        } else {
            setOptions([]);
        }
    }

    // Use useEffect to handle autocomplete search
    useEffect(() => {
        if (searchValue) {
            setIsLoading(true);
            const timer = setTimeout(async () => {
                try {
                    await fetchConsenters(searchValue);
                } finally {
                    setIsLoading(false);
                }
            }, 300);

            return () => clearTimeout(timer);
        }
    }, [searchValue]);

    async function onSubmit(data) {
        setApiState('loading');

        const accessToken = Cookies.get('EttAccessJwt');
        // Process the lookback period - either "unlimited" or a number
        const lookbackPeriod = data.lookbackType === 'unlimited' ? 'unlimited' : data.lookbackYears;
        
        const sendResult = await sendExhibitRequestAPI(
            apiHost, 
            apiStage, 
            accessToken, 
            data.consenter?.email,
            entityId, 
            data.constraint,
            lookbackPeriod
        );

        if (sendResult.payload.ok) {
            setApiState('success');
        } else {
            setApiState('error');
        }

        onOpen();
    }

    function handleModalClose() {
        // Reset API state
        setApiState('idle');
        
        // First clear the form values
        setValue('consenter', null);
        setValue('searchInput', '');
        setValue('constraint', 'both');
        setValue('lookbackType', 'unlimited');
        setValue('lookbackYears', 1);
        
        // Then reset the form state
        reset({
            consenter: null,
            constraint: 'both',
            searchInput: '',
            lookbackType: 'unlimited',
            lookbackYears: 1
        });
        
        // Clear autocomplete options
        setOptions([]);
        
        // Close the modal
        onClose();
    }

    const emptyState = <Center>{searchValue ? 'No results found' : 'Start typing to search'}</Center>;

    return (
        <Box>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Heading as="h3" my="4" size="sm">Select the consenting person</Heading>
                <FormControl isInvalid={errors.consenter}>
                    <FormLabel>Search for a consenter</FormLabel>
                    <Controller
                        name="consenter"
                        control={control}
                        rules={{ required: 'Please select a consenter' }}
                        render={({ field: { onChange, value } }) => (
                            <AutoComplete
                                openOnFocus
                                isLoading={isLoading}
                                onChange={(val, item) => {
                                    const newConsenter = {
                                        email: val,
                                        fullname: item.label
                                    };
                                    onChange(newConsenter);
                                    // Immediately update the search input
                                    setValue('searchInput', `${item.label} (${val})`);
                                }}
                                value={selectedConsenter?.email || ''}
                                emptyState={emptyState}
                            >
                                <Controller
                                    name="searchInput"
                                    control={control}
                                    render={({ field: { onChange, value, ref } }) => (
                                        <AutoCompleteInput
                                            onChange={onChange}
                                            value={value}
                                            ref={ref}
                                            placeholder="Search for a consenter"
                                            loadingIcon={<Spinner />}
                                            onFocus={() => {
                                                if (selectedConsenter) {
                                                    setValue('searchInput', '');
                                                }
                                            }}
                                            // Prevent browser autofill
                                            autoComplete="off"
                                            aria-autocomplete="list"
                                            role="combobox"
                                            aria-expanded="true"
                                            // Use a consistent name but still prevent autofill
                                            name="search-input-no-autofill"
                                        />
                                    )}
                                />
                                <AutoCompleteList>
                                    {options.map((consenter) => (
                                        <AutoCompleteItem 
                                            key={consenter.email} 
                                            value={consenter.email} 
                                            label={consenter.fullname}
                                        >
                                            {consenter.fullname} {consenter.email}
                                        </AutoCompleteItem>
                                    ))}
                                </AutoCompleteList>
                            </AutoComplete>
                        )}
                    />
                    <FormErrorMessage>{errors.consenter?.message}</FormErrorMessage>
                </FormControl>
                <Heading as="h3" my="4" size="sm">Select type of contact information</Heading>
                <FormControl isInvalid={errors.constraint}>
                    <Controller
                        name="constraint"
                        control={control}
                        rules={{ required: 'Please select a constraint type' }}
                        render={({ field }) => (
                            <RadioGroup {...field}>
                                <Stack mb="8">
                                    <Radio value="current">Current Employer(s) only</Radio>
                                    <Radio value="other">Prior Employer(s) and other Affiliates</Radio>
                                    <Radio value="both">All</Radio>
                                </Stack>
                            </RadioGroup>
                        )}
                    />
                    <FormErrorMessage>{errors.constraint?.message}</FormErrorMessage>
                </FormControl>

                <Heading as="h3" my="4" size="sm">Specify lookback period</Heading>
                <Text mb="2" fontSize="sm" fontStyle="italic">How many years back should the consenting person limit affiliates to?</Text>
                <FormControl>
                    <Controller
                        name="lookbackType"
                        control={control}
                        rules={{ required: 'Please select a lookback period type' }}
                        render={({ field }) => (
                            <RadioGroup {...field}>
                                <Stack mb="4">
                                    <Radio value="unlimited">Unlimited lookback period</Radio>
                                    <Radio value="specific">Specific number of years</Radio>
                                </Stack>
                            </RadioGroup>
                        )}
                    />
                </FormControl>

                {lookbackType === 'specific' && (
                    <FormControl isInvalid={errors.lookbackYears} ml="6">
                        <HStack spacing="4" align="flex-start">
                            <FormLabel htmlFor="lookbackYears" pt="2">Number of years:</FormLabel>
                            <Controller
                                name="lookbackYears"
                                control={control}
                                rules={{
                                    required: 'Please enter number of years',
                                    min: { value: 1, message: 'Minimum 1 year' },
                                    max: { value: 50, message: 'Maximum 50 years' }
                                }}
                                render={({ field: { ref, ...restField } }) => (
                                    <NumberInput
                                        {...restField}
                                        min={1}
                                        max={50}
                                        width="100px"
                                        onChange={(value) => {
                                            // Ensure we're setting a number
                                            setValue('lookbackYears', parseInt(value) || '');
                                        }}
                                    >
                                        <NumberInputField ref={ref} />
                                        <NumberInputStepper>
                                            <NumberIncrementStepper />
                                            <NumberDecrementStepper />
                                        </NumberInputStepper>
                                    </NumberInput>
                                )}
                            />
                        </HStack>
                        <FormErrorMessage>{errors.lookbackYears?.message}</FormErrorMessage>
                    </FormControl>
                )}

                <Button type="submit" my="2em" isLoading={apiState === 'loading'}>
                    {apiState === 'idle' && 
                        <>Send{selectedConsenter ? ` to ${selectedConsenter.email}` : '' }</>
                    }
                    {apiState === 'error' && 'Error'}
                    {apiState === 'success' && 'Sent'}
                </Button>
            </form>

            <Modal isOpen={isOpen} onClose={handleModalClose} size="lg">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        {apiState === 'error' && 'Error'}
                        {apiState === 'success' && 'Request Sent'}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {apiState === 'error' && 'There was an error sending the request.'}
                        {apiState === 'success' && <ExhibitSuccessModalBody selectedConsenter={selectedConsenter?.email} />}
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={handleModalClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
}
