import { useContext } from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';

import { Icon, Text, Button, Card, CardBody, SimpleGrid, CardFooter, Heading, Divider, Stack, HStack, Box, useDisclosure } from '@chakra-ui/react';
import { HiCheckCircle, HiMinusCircle, HiPencil } from 'react-icons/hi';

import { ConfigContext } from '../../lib/configContext';

import { signOut } from '../../lib/signOut';

import RescindModal from './consentDetails/rescindModal';
import RenewModal from './consentDetails/renewModal';
import EmailConsentModal from './consentDetails/emailConsentModal';
import EditConsentDetailsModal from './consentDetails/editConsentDetailsModal';

export default function ConsentDetails({ consentData, setConsentData, consenterInfo }) {
    const { appConfig } = useContext(ConfigContext);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const { consenter, fullName, consentStatus } = consentData;
    const { email } = consenterInfo;

    const activeConsent = consentStatus === 'active';

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
                                <Text>{activeConsent ? `Consent granted on ${consenter.consented_timestamp}` : "Consent not active"}</Text>
                                {activeConsent && consenter?.renewed_timestamp && <Text>Renewed on {consenter.renewed_timestamp.reverse()[0]}</Text>}
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
                    {!activeConsent && (
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
                        <Card>
                            <CardBody>Renew this Consent Form for 10 years</CardBody>
                            <CardFooter>
                                <RenewModal setConsentData={setConsentData} consentData={consentData} />
                            </CardFooter>
                        </Card>
                        <Card>
                            <CardBody>Email a copy of this Consent form to {email}</CardBody>
                            <CardFooter>
                                <EmailConsentModal email={email} variant="button" />
                            </CardFooter>
                        </Card>
                        <Card>
                            <CardBody>Rescind this Consent Form</CardBody>
                            <CardFooter>
                                <RescindModal email={email} />
                            </CardFooter>
                        </Card>
                    </SimpleGrid>
                </>
            )}
            <Button my="2em" onClick={handleSignOut}>Sign Out</Button>

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
        consenter: PropTypes.shape({
            consented_timestamp: PropTypes.string,
            renewed_timestamp: PropTypes.arrayOf(PropTypes.string),
        }).isRequired,
        fullName: PropTypes.string.isRequired,
        consentStatus: PropTypes.string.isRequired,
    }).isRequired,
    setConsentData: PropTypes.func.isRequired,
    consenterInfo: PropTypes.shape({
        email: PropTypes.string.isRequired
    }).isRequired
};
