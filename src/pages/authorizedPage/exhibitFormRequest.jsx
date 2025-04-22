import { useEffect, useState, useContext } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Cookies from 'js-cookie';

import { Box, Button, Center, Heading, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, 
    ModalHeader, ModalOverlay, Stack, Radio, RadioGroup, Spinner, useDisclosure, 
    FormControl, FormLabel, FormErrorMessage, NumberInput, NumberInputField, 
    NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, HStack, Text, Select, Input } from "@chakra-ui/react";
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

/**
 * ExhibitFormRequest Component
 * 
 * Renders a form that allows authorized individuals to request exhibit information
 * for a specific entity. The form includes:
 * - Consenter search and selection via autocomplete
 * - Contact information constraint selection
 * - Lookback period specification
 * 
 * The component handles:
 * - Real-time consenter search
 * - Form validation
 * - API submission
 * - Success/error feedback via modal
 * 
 * @param {Object} props
 * @param {string} props.entityId - The ID of the entity for which the exhibit is being requested
 * @returns {JSX.Element}
 */
export default function ExhibitFormRequest({ entityId }) {
    const { appConfig } = useContext(ConfigContext);
    const { apiStage, authorizedIndividual: { apiHost } } = appConfig;
    const { isOpen, onOpen, onClose } = useDisclosure();

    // State for autocomplete
    const [options, setOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [apiState, setApiState] = useState('idle');

    // Setup react-hook-form
    const { handleSubmit, control, watch, setValue, reset, formState: { errors }, register } = useForm({
        defaultValues: {
            consenter: null,
            constraint: 'both',
            searchInput: '',
            lookbackType: 'unlimited',
            lookbackYears: 1,
            employerPosition: '',
            employerOtherPosition: '',
            academicPosition: '',
            academicOtherPosition: '',
            otherOrgPosition: '',
            otherOrgOtherPosition: ''
        }
    });

    // Watch values for dynamic form behavior
    const searchValue = watch('searchInput');
    const selectedConsenter = watch('consenter');
    const lookbackType = watch('lookbackType');
    const employerPosition = watch('employerPosition');
    const academicPosition = watch('academicPosition');
    const otherOrgPosition = watch('otherOrgPosition');
    const constraint = watch('constraint');

    // Update search input display when consenter is selected
    useEffect(() => {
        if (selectedConsenter) {
            setValue('searchInput', `${selectedConsenter.fullname} (${selectedConsenter.email})`);
        } else {
            // Only clear the search input if it contains a formatted consenter string
            const currentSearchValue = watch('searchInput');
            if (currentSearchValue && currentSearchValue.includes(' (') && currentSearchValue.endsWith(')')) {
                setValue('searchInput', '');
            }
        }
    }, [selectedConsenter, setValue, watch]);

    /**
     * Fetches consenter information based on search query
     * Implements debounced search with error handling
     * 
     * @param {string} query - The search string to find consenters
     * @returns {Promise<void>}
     */
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

    /**
     * Handles form submission
     * Processes form data and sends exhibit request to the API
     * 
     * @param {FormValues} data - The form values to be submitted
     * @returns {Promise<void>}
     */
    async function onSubmit(data) {
        setApiState('loading');

        const accessToken = Cookies.get('EttAccessJwt');
        // Process the lookback period - either "unlimited" or a number
        const lookbackPeriod = data.lookbackType === 'unlimited' ? 'unlimited' : data.lookbackYears;
        
        // Process the positions into an array format matching the API expectation
        const positions = [];

        // Add employer position if selected
        if (data.employerPosition) {
            if (data.employerPosition === 'other') {
                positions.push({
                    id: 'custom-employer',
                    value: data.employerOtherPosition
                });
            } else {
                positions.push({
                    id: data.employerPosition
                });
            }
        }

        // Add academic position if selected
        if (data.academicPosition) {
            if (data.academicPosition === 'other') {
                positions.push({
                    id: 'custom-academic',
                    value: data.academicOtherPosition
                });
            } else {
                positions.push({
                    id: data.academicPosition
                });
            }
        }

        // Add other org position if selected
        if (data.otherOrgPosition) {
            if (data.otherOrgPosition === 'other') {
                positions.push({
                    id: 'custom-other',
                    value: data.otherOrgOtherPosition
                });
            } else {
                positions.push({
                    id: data.otherOrgPosition
                });
            }
        }

        const sendResult = await sendExhibitRequestAPI(
            apiHost, 
            apiStage, 
            accessToken, 
            data.consenter?.email,
            entityId, 
            data.constraint,
            lookbackPeriod,
            positions
        );

        if (sendResult.payload?.ok) {
            setApiState('success');
        } else {
            setApiState('error');
        }

        onOpen();
    }

    /**
     * Handles modal close and form reset
     * Resets all form fields, clears autocomplete options,
     * and resets API state to initial values
     * 
     * Note: Reset logic is consolidated into a single atomic operation
     * to prevent race conditions and ensure consistent state reset
     */
    function handleModalClose() {
        // Define all reset values in a single object
        const resetData = {
            consenter: null,
            constraint: 'both',
            searchInput: '',
            lookbackType: 'unlimited',
            lookbackYears: 1,
            employerPosition: '',
            employerOtherPosition: '',
            academicPosition: '',
            academicOtherPosition: '',
            otherOrgPosition: '',
            otherOrgOtherPosition: ''
        };

        // Reset everything in one atomic operation to prevent race conditions
        setApiState('idle');
        setOptions([]);
        reset(resetData, {
            keepDirty: false,
            keepErrors: false
        });
        
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
                                // Key prop forces complete re-render when consenter changes
                                // This ensures proper reset of internal component state
                                key={selectedConsenter?.email || 'empty'}
                                openOnFocus
                                isLoading={isLoading}
                                onChange={(val, item) => {
                                    if (item) {
                                        // When an item is selected from the dropdown
                                        const newConsenter = {
                                            email: val,
                                            fullname: item.label
                                        };
                                        onChange(newConsenter);
                                        setValue('searchInput', `${item.label} (${val})`);
                                    } else {
                                        // When typing in the search box
                                        setValue('searchInput', val);
                                        // Clear the selected consenter if we're actually searching
                                        if (selectedConsenter && val !== `${selectedConsenter.fullname} (${selectedConsenter.email})`) {
                                            onChange(null);
                                        }
                                    }
                                }}
                                // Use consistent display format (fullname + email) for both selected state
                                // and search state to maintain proper display across focus/blur events
                                value={selectedConsenter ? `${selectedConsenter.fullname} (${selectedConsenter.email})` : watch('searchInput') || ''}
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
                                            autoComplete="off"
                                            aria-autocomplete="list"
                                            role="combobox"
                                            aria-expanded="true"
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
                                            {consenter.fullname} ({consenter.email})
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
                <Heading as="h3" mt="8" mb="4" size="sm">Specify Positions of Affiliates</Heading>
                <Text mb="2" fontSize="sm" fontStyle="italic">
                    What are the positions of the affiliates that you are requesting?
                </Text>
                
                {/* Employer Positions - always shown regardless of constraint */}
                <Box mb="6">
                    <Text fontWeight="semibold" color="blue.600" mb="2">Employer Organizations</Text>
                    <FormControl isInvalid={errors.employerPosition}>
                        <Select 
                            placeholder="Select position"
                            {...register('employerPosition', { 
                                required: 'Please select a position',
                                onChange: (e) => {
                                    if (e.target.value !== 'other') {
                                        setValue('employerOtherPosition', '');
                                    }
                                }
                            })}
                        >
                            <option value="hr">HR Professional</option>
                            <option value="mg">Manager / Direct Report</option>
                            <option value="co">Colleague / Co-worker</option>
                            <option value="other">Other</option>
                        </Select>
                        <FormErrorMessage>{errors.employerPosition?.message}</FormErrorMessage>
                    </FormControl>

                    {employerPosition === 'other' && (
                        <FormControl mt="3" isInvalid={errors.employerOtherPosition}>
                            <Input
                                placeholder="Type the custom position name"
                                {...register('employerOtherPosition', {
                                    required: 'Please specify the position',
                                    validate: (value) => {
                                        if (employerPosition === 'other' && !value) {
                                            return 'Please specify the position';
                                        }
                                        return true;
                                    }
                                })}
                            />
                            <FormErrorMessage>{errors.employerOtherPosition?.message}</FormErrorMessage>
                        </FormControl>
                    )}
                </Box>

                {/* Academic and Other Organization fields are only shown if the constraint is not 'current' */}
                {constraint !== 'current' && (
                    <>
                        {/* Academic Positions */}
                        <Box mb="6">
                            <Text fontWeight="semibold" color="blue.600" mb="2">Academic Organizations</Text>
                            <FormControl isInvalid={errors.academicPosition}>
                                <Select 
                                    placeholder="Select position"
                                    {...register('academicPosition', { 
                                        required: 'Please select a position',
                                        onChange: (e) => {
                                            if (e.target.value !== 'other') {
                                                setValue('academicOtherPosition', '');
                                            }
                                        }
                                    })}
                                >
                                    <option value="ao">Academic Officer</option>
                                    <option value="vp">Vice Provost / Associate Provost for Academic Affairs</option>
                                    <option value="df">Dean of Faculty / Associate Dean</option>
                                    <option value="dc">Department Chair / Head</option>
                                    <option value="fc">Faculty Affairs Coordinator</option>
                                    <option value="ro">Institutional Research Officer</option>
                                    <option value="gs">Graduate Studies Coordinator</option>
                                    <option value="at">Affiliations or Titles Administrator</option>
                                    <option value="other">Other</option>
                                </Select>
                                <FormErrorMessage>{errors.academicPosition?.message}</FormErrorMessage>
                            </FormControl>

                            {academicPosition === 'other' && (
                                <FormControl mt="3" isInvalid={errors.academicOtherPosition}>
                                    <Input
                                        placeholder="Type the custom position name"
                                        {...register('academicOtherPosition', {
                                            required: 'Please specify the position',
                                            validate: (value) => {
                                                if (academicPosition === 'other' && !value) {
                                                    return 'Please specify the position';
                                                }
                                                return true;
                                            }
                                        })}
                                    />
                                    <FormErrorMessage>{errors.academicOtherPosition?.message}</FormErrorMessage>
                                </FormControl>
                            )}
                        </Box>

                        {/* Other Organization Positions */}
                        <Box mb="6">
                            <Text fontWeight="semibold" color="blue.600" mb="2">Other Organizations</Text>
                            <FormControl isInvalid={errors.otherOrgPosition}>
                                <Select 
                                    placeholder="Select position"
                                    {...register('otherOrgPosition', { 
                                        required: 'Please select a position',
                                        onChange: (e) => {
                                            if (e.target.value !== 'other') {
                                                setValue('otherOrgOtherPosition', '');
                                            }
                                        }
                                    })}
                                >
                                    <option value="pr">President / Vice President</option>
                                    <option value="ed">Executive Director</option>
                                    <option value="bm">Board Member / Chair</option>
                                    <option value="sb">Secretary of the Board</option>
                                    <option value="sc">Steering Committee Member</option>
                                    <option value="mc">Membership Chair / Officer</option>
                                    <option value="nc">Nominations Committee Member / Chair</option>
                                    <option value="cc">Fellowship Committee Chair</option>
                                    <option value="ac">Advisory Council Member</option>
                                    <option value="other">Other</option>
                                </Select>
                                <FormErrorMessage>{errors.otherOrgPosition?.message}</FormErrorMessage>
                            </FormControl>

                            {otherOrgPosition === 'other' && (
                                <FormControl mt="3" isInvalid={errors.otherOrgOtherPosition}>
                                    <Input
                                        placeholder="Type the custom position name"
                                        {...register('otherOrgOtherPosition', {
                                            required: 'Please specify the position',
                                            validate: (value) => {
                                                if (otherOrgPosition === 'other' && !value) {
                                                    return 'Please specify the position';
                                                }
                                                return true;
                                            }
                                        })}
                                    />
                                    <FormErrorMessage>{errors.otherOrgOtherPosition?.message}</FormErrorMessage>
                                </FormControl>
                            )}
                        </Box>
                    </>
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
