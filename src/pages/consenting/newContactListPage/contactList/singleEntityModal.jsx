import { useState, useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure, ButtonGroup, FormControl, FormErrorMessage, FormHelperText, FormLabel, Input } from "@chakra-ui/react";
import PropTypes from 'prop-types';

import { HiOutlineChevronLeft } from "react-icons/hi";
import { AiOutlineClose } from 'react-icons/ai';

import { UserContext } from '../../../../lib/userContext';

import ContactSummaryCard from './singleEntityModal/contactSummaryCard';
import EmailConsentModal from '../../../consentingPage/consentDetails/emailConsentModal';

export default function SingleEntityModal({ contacts, setSingleEntityFormsSigned, isOpen, onOpen, onClose, handleContactChange, formConstraint }) {
    // Navigation state
    const [currentIndex, setCurrentIndex] = useState(0);

    const { user } = useContext(UserContext);

    // Setup the digital signature form
    const { handleSubmit, register, formState: { errors }, reset, setValue, getValues } = useForm({
        defaultValues: {
            signature: '',
        }
    });

    // Update form value when currentContact changes
    useEffect(() => {
        const currentContact = contacts[currentIndex];
        if (currentContact) {
            setValue('signature', currentContact.consenter_signature || '');
        }
    }, [currentIndex, contacts, setValue]);

    // Save the current signature to the contact
    const saveCurrentSignature = () => {
        const values = getValues();
        if (values.signature) {
            handleContactChange(currentContact.id, {
                ...currentContact,
                consenter_signature: values.signature
            });
        }
    };

    // Navigation handlers
    function handleNext(values) {
        // Store the signature for the current contact
        handleContactChange(currentContact.id, {
            ...currentContact,
            consenter_signature: values.signature
        });

        if (currentIndex < contacts.length - 1) {
            const nextContact = contacts[currentIndex + 1];
            setCurrentIndex(currentIndex + 1);
            
            // Only reset the signature if the next contact hasn't been signed yet
            if (!nextContact.consenter_signature) {
                reset({ signature: '' });
            }
        } else {
            // If this is the last contact, mark all forms as signed
            setSingleEntityFormsSigned(true);
            handleClose();
        }
    }

    function handleBack() {
        if (currentIndex > 0) {
            // Save the current signature before navigating back
            saveCurrentSignature();
            
            // Navigate to previous contact
            setCurrentIndex(currentIndex - 1);
            // Do not reset when going back - the useEffect will set the correct signature
        }
    }

    // Reset index when modal closes
    function handleClose() {
        // Save any unsaved signature before closing
        saveCurrentSignature();
        
        // Reset and close
        setCurrentIndex(0);
        reset({ signature: '' });
        onClose();
    }

    const currentContact = contacts[currentIndex];
    const hasNext = currentIndex < contacts.length - 1;

    return (
        <>
            <Modal size="4xl" isOpen={isOpen} onClose={handleClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Single-Entity Exhibit Form{formConstraint === 'current' && ' — Current Employer or Appointing Organization'}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {currentContact && (
                            <>
                                <Text fontSize="lg" fontWeight="bold" mb="4">
                                    Form {currentIndex + 1} of {contacts.length}
                                </Text>
                                <Text mb="4" fontWeight="semibold">
                                    This {formConstraint === 'current' && 'Current Employer '}<u>&quot;Single-Entity Exhibit Form&quot;</u> is incorporated into my Consent Form,  <EmailConsentModal email={user.email} variant="link" />.  
                                    <u>I agree that my ETT Registration Form and Consent Form authorizes (and will remain in effect to 
                                    authorize) the following entity to complete the Disclosure Form about me and provide it in 
                                    response to the Disclosure Request sent with this Form. The following entity is also authorized 
                                    to disclose the information called for in the Disclosure Form about me in response to the 
                                    Disclosure Request, if preferred.</u> The definitions in the Consent Form also apply to this 
                                    Single Entity Exhibit Form. The following entity is one of my <u>Consent Recipients</u> 
                                    (Affiliates) {formConstraint === 'current' && 'that is my current employer or appointing organization and is '}
                                    referenced in and covered by my Consent Form:
                                </Text>
                                <ContactSummaryCard contact={currentContact} />
                                <Text mb="4">
                                    I agree that this electronic Single-Entity Exhibit Form and my electronic (digital) signature, and any copy will have the 
                                    same effect as originals for all purposes. <b>I have had the time to consider and consult anyone I wish on whether to provide 
                                    this Single Entity Exhibit Form.  I am at least 18 years old and it is my knowing and voluntary decision to sign and deliver 
                                    this Single Entity Exhibit Form.</b>
                                </Text>
                                <form onSubmit={handleSubmit(handleNext)}>
                                    <FormControl mt="8" isInvalid={errors.signature}>
                                        <FormLabel>Please type your full name (First Middle Last) to digitally sign this full Exhibit Form: </FormLabel>
                                        <Input
                                            id="signature"
                                            name="signature"
                                            placeholder="Type your name as your digital signature"
                                            {...register('signature', {
                                                required: 'Signature is required',
                                            })}
                                            type="text"
                                        />
                                        {!errors.signature ? (
                                            <FormHelperText>&nbsp;</FormHelperText>
                                        ) : (
                                            <FormErrorMessage>{errors.signature.message}</FormErrorMessage>
                                        )}
                                    </FormControl>
                                </form>
                                {formConstraint === 'current' ? (
                                    <Text my="4">
                                        { hasNext ?
                                            `Click the Next Button to create, review, date, and digitally sign this 
                                            Single-Entity Exhibit Form and move on to the next of your listed Consent Recipients 
                                            (Affiliate(s)—your current employer(s) and any other current appointing 
                                            organization(s)). You will not be able to submit any of your Current 
                                            Employer(s) Exhibit Forms until you digitally sign all of them.` :

                                            `Click the Submit Button to create, review, date, and digitally sign this last 
                                            Single-Entity Exhibit Form for your listed Consent Recipients (Affiliate(s)—your 
                                            current employer(s) and any other current appointing 
                                            organization(s)). You will not be able to submit any of your Current 
                                            Employer(s) Exhibit Forms until you digitally sign all of them.`
                                        }
                                    </Text>
                                ) : (
                                    <Text my="4">
                                        { hasNext ? 
                                            `Click the Next button to create, review, date, and digitally sign this  
                                            Single-Entity Exhibit Form and move on to the next of your listed Consent Recipients 
                                            (Affiliates). You will not be able to submit any of your Exhibit Forms 
                                            until you digitally sign all of them.` : 
                                            
                                            `Click the Submit button to create, review, date, and digitally sign this last 
                                            Single-Entity Exhibit Form for your listed Consent Recipients 
                                            (Affiliates). You will not be able to submit any of your Exhibit Forms 
                                            until you digitally sign all of them.` 
                                        }
                                    </Text>
                                )}
                            </>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <ButtonGroup spacing="4">
                            <Button 
                                mr="12"
                                leftIcon={<AiOutlineClose />}
                                onClick={handleClose}
                            >
                                Cancel
                            </Button>
                            <Button 
                                leftIcon={<HiOutlineChevronLeft />}
                                onClick={handleBack}
                                isDisabled={currentIndex === 0}
                            >
                                Back
                            </Button>
                            <Button 
                                onClick={handleSubmit(handleNext)}
                                isDisabled={!hasNext && Object.keys(errors).length > 0}
                            >
                                {hasNext ? 'Next' : 'Submit'}
                            </Button>
                        </ButtonGroup>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

SingleEntityModal.propTypes = {
    contacts: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        organizationName: PropTypes.string.isRequired,
        organizationType: PropTypes.string.isRequired,
        contactName: PropTypes.string.isRequired,
        contactTitle: PropTypes.string,
        contactEmail: PropTypes.string.isRequired,
        contactPhone: PropTypes.string.isRequired,
        consenter_signature: PropTypes.string,
    })).isRequired,
    setSingleEntityFormsSigned: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onOpen: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    handleContactChange: PropTypes.func.isRequired,
};
