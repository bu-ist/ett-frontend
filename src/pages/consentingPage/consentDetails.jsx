import { useContext } from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';

import { Icon, Text, Button, Card, CardBody, SimpleGrid, CardFooter, Heading, Divider, Stack, HStack, Box, useDisclosure, Accordion, AccordionItem, AccordionButton, AccordionIcon, AccordionPanel } from '@chakra-ui/react';
import { HiCheckCircle, HiMinusCircle, HiPencil } from 'react-icons/hi';

import { ConfigContext } from '../../lib/configContext';

import { signOut } from '../../lib/signOut';

import RescindModal from './consentDetails/rescindModal';
import RenewModal from './consentDetails/renewModal';
import EmailConsentModal from './consentDetails/emailConsentModal';
import EditConsentDetailsModal from './consentDetails/editConsentDetailsModal';

import ConsentExpirationExceptionsText from '../../components/sharedTexts/consentExpirationExceptionsText';
export default function ConsentDetails({ consentData, setConsentData, consenterInfo }) {
    const { appConfig } = useContext(ConfigContext);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const { consenter, fullName, consentStatus } = consentData;
    const { email } = consenterInfo;

    const ConsentStatus = {
        ACTIVE: 'active',
        FORTHCOMING: 'forthcoming',
        RESCINDED: 'rescinded',
        EXPIRED: 'expired',
    }
    const activeConsent = consentStatus === ConsentStatus.ACTIVE;


    // Helper function for extracting and formatting the last date in an array
    function getLastDateString(arr) {
        // Check if the array is valid and has at least one element
        if (!Array.isArray(arr) || arr.length === 0) return '';
        // Get the last element of the array
        const date = arr.at(-1);
        // Check if the last element is a valid date string
        if (!date) return '';
        // Convert the date string to a Date object and format it
        return new Date(date).toLocaleString();
    }

    // Only show renewal if it is after the last consent grant.
    // This is to deal with the case were consent is granted and renewed, then rescinded, and then granted again; the back end doesn't remove the renewed timestamp.
    // In this case, the consented timestamp more recent than the renewed timestamp, so we don't want to show the renewal date.
    function shouldShowRenewal(consentedArr, renewedArr) {
        // Check if the arrays are valid and have at least one element
        if (!Array.isArray(consentedArr) || !Array.isArray(renewedArr)) return false;
        if (renewedArr.length === 0 || consentedArr.length === 0) return false;

        // Convert the last elements of both arrays to Date objects and compare them
        const lastConsent = new Date(consentedArr.at(-1));
        const lastRenewal = new Date(renewedArr.at(-1));

        // Check if the last renewal date is greater than the last consent date
        return lastRenewal > lastConsent;
    }

    const shouldShowConsent = () => 
        consentStatus === ConsentStatus.FORTHCOMING || 
        consentStatus === ConsentStatus.RESCINDED;

    const shouldShowRescind = () => 
        consentStatus === ConsentStatus.ACTIVE;

    const shouldShowRenew = () => 
        consentStatus === ConsentStatus.ACTIVE || 
        consentStatus === ConsentStatus.EXPIRED;

    const shouldShowEmailConsent = () => 
        consentStatus === ConsentStatus.ACTIVE;

    function handleSignOut() {
        const { cognitoDomain, consentingPerson: { cognitoID } } = appConfig;
        signOut(cognitoDomain, cognitoID);
    }

    const handleSaveSuccess = (updatedData) => {
        // Update consentData with new values
        const updatedConsentData = {
            ...consentData,
            fullName: `${updatedData.firstname} ${updatedData.middlename ? updatedData.middlename + ' ' : ''}${updatedData.lastname}`,
            consenter: {
                ...consentData.consenter,
                ...updatedData
            }
        };

        // Update the parent state
        setConsentData(updatedConsentData);
    };

    return (
        <div>
            <Card
                my="1em"
                direction={{ base: "column", sm: "row" }}
                overflow={"hidden"}
                variant={"outline"}
            >
                <Icon 
                    my="0.5em"
                    as={activeConsent ? HiCheckCircle : HiMinusCircle} 
                    color={activeConsent ? "green.500" : "yellow.300"} 
                    boxSize="32"
                />
                <Stack flex="1">
                    <CardBody>
                        <HStack justify="space-between">
                            <Box>
                                <Heading size="md">
                                    Consent for {fullName}
                                </Heading>
                                <Text>{email}</Text>
                                <Text>{consenter.phone_number}</Text>
                                <Text>
                                    {activeConsent
                                        ? `Consent granted on ${getLastDateString(consenter.consented_timestamp)}`
                                        : "Consent not active"
                                    }
                                </Text>
                                {activeConsent && shouldShowRenewal(consenter.consented_timestamp, consenter.renewed_timestamp) && (
                                    <Text>Renewed on {getLastDateString(consenter.renewed_timestamp)}</Text>
                                )}
                                {consentStatus === ConsentStatus.EXPIRED && (
                                    <Text>Consent has expired</Text>
                                )}
                            </Box>
                            <Box>
                                <Button
                                    leftIcon={<HiPencil />}
                                    size="sm"
                                    onClick={onOpen}
                                >
                                    Edit
                                </Button>
                            </Box>
                        </HStack>
                    </CardBody>
                    {shouldShowConsent() && (
                        <CardFooter>
                            <Button as={ReactRouterLink} to="/consenting/consent-form" >Grant Consent</Button>
                        </CardFooter>
                    )}
                </Stack>
            </Card>
            <Divider my="1em" />
            {activeConsent && (
                <>
                    <Heading as="h3" size="md">Consent Actions</Heading>
                    <SimpleGrid spacing={4} mt="2em" templateColumns='repeat(auto-fill, minmax(200px, 1fr))'>
                        {shouldShowRenew() && (
                            <Card>
                                <CardBody>Renew this Consent Form for 10 years</CardBody>
                                <CardFooter>
                                    <RenewModal setConsentData={setConsentData} consentData={consentData} />
                                </CardFooter>
                            </Card>
                        )}
                        {shouldShowEmailConsent() && (
                            <Card>
                                <CardBody>Email a copy of this Consent form to {email}</CardBody>
                                <CardFooter>
                                    <EmailConsentModal email={email} variant="button" />
                                </CardFooter>
                            </Card>
                        )}
                        {shouldShowRescind() && (                            
                            <Card>
                                <CardBody>Rescind this Consent Form</CardBody>
                                <CardFooter>
                                    <RescindModal email={email} />
                                </CardFooter>
                            </Card>
                        )}
                    </SimpleGrid>
                </>
            )}
            {!activeConsent && shouldShowRenew() && (
                <Card>
                    <CardBody>Renew this Consent Form for 10 years</CardBody>
                    <CardFooter>
                        <RenewModal setConsentData={setConsentData} consentData={consentData} />
                    </CardFooter>
                </Card>
            )}
            {activeConsent && (
                <Accordion mt="12" allowToggle>
                    <AccordionItem p="2" border="1px" borderColor="gray.400" borderRadius="md" backgroundColor="gray.50">
                        <h2>
                            <AccordionButton>
                                <Box as="span" flex='1' textAlign='left'>
                                    <Heading size="sm">Click here for information on Consent expiration exception</Heading>
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                            <ConsentExpirationExceptionsText link={false} />
                        </AccordionPanel>
                    </AccordionItem>
                </Accordion>
            )}
            <Button my="16" onClick={handleSignOut}>Sign Out</Button>

            <EditConsentDetailsModal 
                isOpen={isOpen}
                onClose={onClose}
                consenter={consenter}
                onSaveSuccess={handleSaveSuccess}
            />
        </div>
    );
}

ConsentDetails.propTypes = {
    consentData: PropTypes.shape({
        fullName: PropTypes.string.isRequired,
        consentStatus: PropTypes.string.isRequired,
        consenter: PropTypes.shape({
            phone_number: PropTypes.string,
            consented_timestamp: PropTypes.arrayOf(PropTypes.string),
            renewed_timestamp: PropTypes.arrayOf(PropTypes.string),
        }).isRequired,
    }).isRequired,
    setConsentData: PropTypes.func.isRequired,
    consenterInfo: PropTypes.shape({
        email: PropTypes.string.isRequired
    }).isRequired
};
