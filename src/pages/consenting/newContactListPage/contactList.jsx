import { useState, useContext } from 'react';
import { nanoid } from 'nanoid';
import { useForm } from 'react-hook-form';
import { Link as ReactRouterLink } from 'react-router-dom';
import Cookies from 'js-cookie';
import PropTypes from 'prop-types';
import { Alert, AlertIcon, Box, Button, ButtonGroup, Card, CardBody, CardFooter, Divider, Flex, FormControl, FormErrorMessage, FormLabel, FormHelperText, Heading, Input, Spacer, Spinner, Stack, Text, UnorderedList, ListItem, useDisclosure } from "@chakra-ui/react";
import { HiOutlinePlusSm } from "react-icons/hi";

import { ConfigContext } from '../../../lib/configContext';

import { sendExhibitFormAPI } from '../../../lib/consenting/sendExhibitFormAPI';

import ContactEditModal from './contactEditModal';
import ContactDisplayCard from './contactDisplayCard';
import EntityAutocomplete from './entityAutocomplete'; //not sure if we are using this
import SingleEntityModal from './contactList/singleEntityModal';

import { OtherFormPrefaceText, CurrentFormPrefaceText, BothFormPrefaceText } from './contactList/formPrefaceText';
import FormInstructionsText from './contactList/formInstructionsText';

import { 
    BothEmployersText, 
    BothOtherOrgsText,
    AcademicText, 
    PriorEmployerText,
    PriorOtherOrgsText,
    CurrentEmployerText
} from "./contactList/textDescriptors";

import SaveButton from './contactList/saveButton';

// Contains the full contact list form and form state.
export default function ContactList({ consentData, formConstraint, entityId }) {
    const { appConfig } = useContext(ConfigContext);

    // State for the form submission result.
    const [submitResult, setSubmitResult] = useState('idle');

    // Check for existing saved form data from the consentData, 
    const matchingSavedForm = consentData.consenter.exhibit_forms.find((form) => (
        form.entity_id === entityId && form.constraint === formConstraint
    ));

    // Set a state to tell if we are working with existing saved form data.
    const [isSavedForm, setIsSavedForm] = useState(!!matchingSavedForm);

    // Set the initial contacts state based on the saved form data.
    // Otherwise, set the initial contacts state to an empty array.
    const initialAffiliates = matchingSavedForm?.affiliates || [];

    // Map the initial affiliates to the format expected by the contact list.
    const initialContacts = initialAffiliates.map((affiliate) => ({
        id: affiliate.id || nanoid(), // Use the existing ID or generate a new one
        organizationName: affiliate.org || '',
        organizationType: affiliate.affiliateType === 'EMPLOYER_PRIOR' ? 'EMPLOYER' : affiliate.affiliateType || '',
        contactName: affiliate.fullname || '',
        contactTitle: affiliate.title || '',
        contactEmail: affiliate.email || '',
        contactPhone: affiliate.phone_number || '',
        consenter_signature: affiliate.consenter_signature || ''  // Include any saved signatures
    }));

    // State for the contact list form data.
    const [contacts, setContacts] = useState(initialContacts);

    
    // Current contact being edited
    const [currentContact, setCurrentContact] = useState(null);
    
    // Edit or Add mode for the modal
    const [isEditOrAdd, setIsEditOrAdd] = useState('add');
    
    // Modal state
    // Should rename to be more specific to the contact edit modal
    const { isOpen, onOpen, onClose } = useDisclosure();

    // Setup the digital signature form
    const { handleSubmit, register, formState: { errors }, reset } = useForm({
        defaultValues: {
            signature: '',
        }
    });

    // State for the single entity modal
    const { isOpen: isSingleEntityModalOpen, onOpen: onSingleEntityModalOpen, onClose: onSingleEntityModalClose } = useDisclosure();

    function handleNext(values) {
        // Validate the signature form
        if (errors.signature) {
            return; // Don't proceed if there are signature errors
        }
        
        // Store the signature value
        setFormSignature(values.signature);
        
        // If signature is valid, open the single entity modal
        onSingleEntityModalOpen();
    }

    // State for whether or not the user has signed the single entity forms.
    const [singleEntityFormsSigned, setSingleEntityFormsSigned] = useState(false);

    // State to store the signature once collected
    const [formSignature, setFormSignature] = useState('');

    // Get then name of the matching entity from the consent data.
    const entityName = consentData.entities.find((entity) => entity.entity_id === entityId)?.entity_name;

    // Handle contact update from modal
    const handleContactUpdate = (id, updatedContact) => {
        const updatedContacts = contacts.map((contact) => 
            contact.id === id ? { ...contact, ...updatedContact } : contact
        );
        setContacts(updatedContacts);
    };

    // Add a new blank contact card to the form state data and open the editing modal.
    function handleAddContact(orgType) {
        // Signal that the modal is for adding a new contact.
        setIsEditOrAdd('add');

        // Generate a new ID for the new contact.
        const newId = nanoid();

        // Create a new blank contact
        const newContact = {
            id: newId,
            organizationName: '',
            organizationType: orgType,
            contactName: '',
            contactTitle: '',
            contactEmail: '',
            contactPhone: '',
            consenter_signature: ''  // Field for individual contact signature
        };

        // Add the new blank contact to the form state.
        setContacts([...contacts, newContact]);

        // Set the current contact for the modal
        setCurrentContact(newContact);
        onOpen();
    }

    // Handle editing an existing contact by setting the modal to edit mode and opening it.
    function handleEditContact(id) {
        // Signal that the modal is for editing an existing contact.
        setIsEditOrAdd('edit');
        const contactToEdit = contacts.find(contact => contact.id === id);
        setCurrentContact(contactToEdit);
        onOpen();
    }

    function removeContact(id) {
        const updatedContacts = contacts.filter((contact) => contact.id !== id);
        setContacts(updatedContacts);
    }

    // Close modal handler that updates component state to reflect modal is closed
    function handleModalClose() {
        onClose();
        setCurrentContact(null);
    }

    // Handle submission of final exhibit form data.
    async function handleFinalSubmit() {

        const accessToken = Cookies.get('EttAccessJwt');
        const idToken = Cookies.get('EttIdJwt');
        const email = JSON.parse(atob(idToken.split('.')[1])).email;

        // Create a copy of contacts to avoid mutating the original state
        let contactsToSubmit = [...contacts];
        
        // If formConstraint is "other", then the organizationType must change from EMPLOYER to EMPLOYER_PRIOR
        if (formConstraint === 'other') {
            contactsToSubmit = contactsToSubmit.map(contact => 
                contact.organizationType === 'EMPLOYER' 
                    ? { ...contact, organizationType: 'EMPLOYER_PRIOR' }
                    : contact
            );
        }

        // Create the submission data with the main form signature
        const submissionData = {
            contacts: contactsToSubmit,
            signature: formSignature  // This will be placed in exhibit_data.signature by the API
        };

        // Send the contact list to the API.
        setSubmitResult('loading');
        const response = await sendExhibitFormAPI(appConfig, accessToken, submissionData, entityId, email, formConstraint);

        console.log('send exhibit form response', response);
        
        setSubmitResult(response.payload.ok ? 'success' : 'error');
    };

    // The formConstraint is either 'current', 'other', or 'both'.
    const constraintMessages = {
        'current': 'Current Employer(s) only',
        'other': 'Prior Employer(s) and other Affiliates',
        'both': 'All Employer(s) and Affiliates, including Prior Employers'
    };

    const employerContacts = contacts.filter(contact => contact.organizationType === 'EMPLOYER');
    const academicContacts = contacts.filter(contact => contact.organizationType === 'ACADEMIC');
    const otherContacts = contacts.filter(contact => contact.organizationType === 'OTHER');

    // Special case of primary employer for 'current' mode.
    const primaryEmployer = contacts.find(contact => contact.organizationType === 'EMPLOYER_PRIMARY');

    // Make an array with both primary and secondary employers for 'current' mode.
    const employerContactsForDisplay = primaryEmployer ? [primaryEmployer, ...employerContacts] : employerContacts;

    return (
        <Box>
            <Heading as="h2" mb="4" size="lg">New Exhibit Form for {consentData.fullName}</Heading>
            <Text mb="4">
                {`This is a request for ${constraintMessages[formConstraint]}.`}
            </Text>
            <Box my="8">
                {isSavedForm && (
                    <Alert mb="6" status="info">
                        <AlertIcon />
                        Form data has been pre-filled from a previous saved form. Please review and update as necessary.
                    </Alert>
                )}
                <Heading my="4" as={"h3"} size={"lg"}>Requesting Registered Entity</Heading>
                {/* Commented out, not sure if this is what ultimately to be used.
                <Text mb="4">Irure esse ex ipsum elit tempor id esse in cillum id officia ipsum. Culpa labore consectetur esse excepteur incididunt ex eu aliqua laboris esse esse occaecat elit.</Text>
                <FormLabel>Select the Receiving Institution</FormLabel>
                <EntityAutocomplete entities={consentData.entities} entity={entity} setEntity={setEntity} />
                */}
                <Text mb="4" fontSize="2xl">
                    {entityName}
                </Text>
                <Divider my="4" />
                {formConstraint === 'other' && <OtherFormPrefaceText /> }
                {formConstraint === 'current' && <CurrentFormPrefaceText /> }
                {formConstraint === 'both' && <BothFormPrefaceText />}
                <Divider my="4" />
                <Heading as="h4" size="lg" my="4" color="blue.600">
                    {formConstraint === 'current' && 'Current Employer(s) and Appointing Organizations'}
                    {formConstraint === 'other' && 'Prior Employer(s)'}
                    {formConstraint === 'both' && 'Current and Prior Employer(s)'}
                </Heading>
                {formConstraint === 'both' && <BothEmployersText />}
                {formConstraint === 'other' && <PriorEmployerText />}
                {formConstraint === 'current' && <CurrentEmployerText />}
                {employerContactsForDisplay.map((contact) => (
                    <ContactDisplayCard
                        key={contact.id}
                        contact={contact}
                        handleEditContact={handleEditContact}
                        removeContact={removeContact}
                        isDisabled={submitResult !== 'idle' || singleEntityFormsSigned }
                    />
                ))}
                {formConstraint === 'current' ? (
                    <ButtonGroup mt="4" spacing={4}>
                        {/* Special case for primary employer in 'current' mode */}
                        <Button
                            leftIcon={<HiOutlinePlusSm />}
                            onClick={() => handleAddContact("EMPLOYER_PRIMARY")}
                            isDisabled={submitResult !== 'idle' || primaryEmployer || singleEntityFormsSigned}
                        >
                            Add Primary Employer
                        </Button>
                        <Button
                            leftIcon={<HiOutlinePlusSm />}
                            onClick={() => handleAddContact("EMPLOYER")}
                            isDisabled={submitResult !== 'idle' || singleEntityFormsSigned }
                        >
                            Add Other Employer
                        </Button>
                    </ButtonGroup>
                ) : (
                    <Button mt="4"
                        leftIcon={<HiOutlinePlusSm />}
                        onClick={() => handleAddContact("EMPLOYER")}
                        isDisabled={submitResult !== 'idle' || singleEntityFormsSigned }
                    >
                    Add Employer
                </Button>
                )}
                <Divider my="8" />
                

                {/* Academic and other orgs are not included in 'current' mode, so only conditionally render them. */}
                {formConstraint !== 'current' && (
                    <>
                        <Heading as="h4" size="lg" my="4" color="blue.600">Current and Prior Academic / Professional Societies</Heading>
                        {(formConstraint === 'both' || formConstraint === 'other') && <AcademicText />}
                        {academicContacts.map((contact) => (
                            <ContactDisplayCard
                                key={contact.id}
                                contact={contact}
                                handleEditContact={handleEditContact}
                                removeContact={removeContact}
                                isDisabled={submitResult !== 'idle' || singleEntityFormsSigned }
                            />
                        ))}
                        <Button mt="4"
                            leftIcon={<HiOutlinePlusSm />}
                            onClick={() => handleAddContact("ACADEMIC")}
                            isDisabled={submitResult !== 'idle' || singleEntityFormsSigned }
                        >
                            Add Academic
                        </Button>
                        <Divider my="8" />
                        <Heading as="h4" size="lg" my="4" color="blue.600">
                            Other Organizations Where You {formConstraint === 'both' ? 'Currently or Formerly Had' : 'Formerly Had'} Appointments
                        </Heading>
                        {formConstraint === 'both' && <BothOtherOrgsText />}
                        {formConstraint === 'other' && <PriorOtherOrgsText />}
                        {otherContacts.map((contact) => (
                            <ContactDisplayCard
                                key={contact.id}
                                contact={contact}
                                handleEditContact={handleEditContact}
                                removeContact={removeContact}
                                isDisabled={submitResult !== 'idle' || singleEntityFormsSigned }
                            />
                        ))}
                        <Button mt="4"
                            leftIcon={<HiOutlinePlusSm />}
                            onClick={() => handleAddContact("OTHER")}
                            isDisabled={submitResult !== 'idle' || singleEntityFormsSigned }
                        >
                            Add Other
                        </Button>
                    </>
                )}
                {currentContact && (
                    <ContactEditModal
                        isOpen={isOpen}
                        onClose={handleModalClose}
                        isEditOrAdd={isEditOrAdd}
                        formConstraint={formConstraint}
                        contact={currentContact}
                        removeContact={removeContact}
                        handleContactChange={handleContactUpdate}
                    />
                )}
                <Divider my="8" />
                <FormInstructionsText entityName={entityName} />
                <Divider my="8" />
                <form onSubmit={handleSubmit(handleNext)}>
                    <FormControl mt="8">
                        <FormLabel>Please type your full name (First Middle Last) to digitally sign this full Exhibit Form: </FormLabel>
                        <Input
                            id="signature"
                            name="signature"
                            placeholder="Type your name as your digital signature"
                            {...register('signature', {
                                required: 'Signature is required',
                            })}
                            type="text"
                            isDisabled={submitResult !== 'idle' || singleEntityFormsSigned}
                        />
                        {!errors.signature ? (
                            <FormHelperText>&nbsp;</FormHelperText>
                        ) : (
                            <FormErrorMessage>{errors.signature.message}</FormErrorMessage>
                        )}
                        {/* This extra error message shouldn't be necessary, but for some reason the one above is not rendering */}
                        {errors.signature && <Text color="red.500" mt="2">{errors.signature.message}</Text>}
                    </FormControl>
                    <Flex mt="4">
                        <Card width="40%">
                            <CardBody>
                                <Text>Click the Next button to create, review, date, and sign a Full Exhibit Form.
                                    You will not be able to submit your Full Exhibit Form until you digitally sign it.
                                </Text>
                            </CardBody>
                            <CardFooter>
                                <Button
                                    type='submit'
                                    size="lg"
                                    colorScheme='blue'
                                    isDisabled={submitResult !== 'idle' || singleEntityFormsSigned || contacts.length === 0}
                                >
                                    Next
                                </Button>
                            </CardFooter>
                        </Card>
                        <Spacer />
                        <Card width="40%">
                            <CardBody>
                                Optionally, click the Save button to file your entries temporarily to the ETT system if you 
                                wish to return later to complete your work. NOTE: Any such work saved for the first time will 
                                not be retained by our system any longer than 1 week (7 days). You can save again any number 
                                of times within this 7 day window, but doing so will not extend the initial 7 day limit.
                            </CardBody>
                            <CardFooter>
                                <SaveButton 
                                    contacts={contacts} 
                                    formConstraint={formConstraint} 
                                    entityId={entityId}
                                    singleEntityFormsSigned={singleEntityFormsSigned}
                                />
                            </CardFooter>
                        </Card>
                    </Flex>

                    {/* add a save button here */}
                </form>
                <Divider my="8" />
                    <SingleEntityModal 
                        contacts={contacts} 
                        setSingleEntityFormsSigned={setSingleEntityFormsSigned} 
                        isOpen={isSingleEntityModalOpen}
                        onOpen={onSingleEntityModalOpen}
                        onClose={onSingleEntityModalClose}
                        handleContactChange={handleContactUpdate}
                    />
                {singleEntityFormsSigned && (
                    <>
                        <Alert mb="6" status="success">
                            <AlertIcon />
                            You have digitally signed your Full Exhibit Form and each of your Single-Entity Exhibit Forms. Next, submit the form.
                        </Alert>
                        <Text>
                            NOTE: When you click &quot;Submit&quot;:
                        </Text>
                        <UnorderedList fontSize="xl" fontWeight="semibold" my="4" spacing="2">
                            <ListItem>
                                Your ETT Registration Form and Consent Form will not expire and you will not be able to rescind them or 
                                your Full or Single Entity Exhibit Forms in connection with the Privilege or Honor, Employment or Role 
                                for which the listed Registered Entity is considering you at this time.  Your Consent Recipients will be 
                                relying on these forms to make disclosures to the Registered Entity.  Contact the Registered Entity directly 
                                if you want to withdraw from their consideration.
                            </ListItem>
                            <ListItem>
                                You may still rescind your ETT Registration Form and Consent Form to prevent their other use in the future
                            </ListItem>
                        </UnorderedList>
                        <Button mt="4" 
                            isDisabled={submitResult !== 'idle' || !singleEntityFormsSigned || contacts.length === 0}
                            size="lg"
                            colorScheme="blue"
                            onClick={handleFinalSubmit}
                        >
                            {submitResult === 'idle' && 'Submit'}
                            {submitResult === 'loading' && <Spinner />}
                            {submitResult === 'success' && 'Submitted'}
                            {submitResult === 'error' && 'Error'}
                        </Button>
                    </>
                )}
            </Box>
            {submitResult === 'success' && 
                <>
                    <Text>Form submitted successfully, you will receive an emailed copy.</Text>
                    <Button as={ReactRouterLink} to="/consenting" my="2em"> Return to Dashboard</Button>
                </>
            }
            {submitResult === 'error' && 
                <Text>There was an error submitting the form.</Text>
            }
        </Box>
    );
}

ContactList.propTypes = {
    consentData: PropTypes.shape({
        consenter: PropTypes.shape({
            exhibit_forms: PropTypes.arrayOf(PropTypes.shape({
                entity_id: PropTypes.string,
                constraint: PropTypes.string,
                affiliates: PropTypes.array,
            })),
        }),
        entities: PropTypes.arrayOf(PropTypes.shape({
            entity_id: PropTypes.string.isRequired,
            entity_name: PropTypes.string.isRequired,
        })),
        fullName: PropTypes.string,
    }).isRequired,
    formConstraint: PropTypes.string.isRequired,
    entityId: PropTypes.string.isRequired,
};
