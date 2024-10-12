import { Link as ReactRouterLink } from 'react-router-dom';

import { Icon, Text, Button, Card, CardBody, SimpleGrid, CardFooter, Heading, Divider, Stack } from '@chakra-ui/react';
import { HiCheckCircle, HiMinusCircle } from 'react-icons/hi';

import { signOut } from '../../lib/signOut';

import RescindModal from './consentDetails/rescindModal';
import RenewModal from './consentDetails/renewModal';

export default function ConsentDetails({ consentData, setConsentData, consenterInfo }) {

    const { consenter, fullName, activeConsent, entities } = consentData;
    const { email } = consenterInfo;

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
                    color={activeConsent ? "green.500" : "red.500"} 
                    boxSize={"20"}
                />
                <Stack>
                    <CardBody>
                        <Heading size="md">
                            Consent for {fullName}
                        </Heading>
                        <Text>{activeConsent ? `Consent granted on ${consenter.consented_timestamp}` : "Consent not active"}</Text>
                        {activeConsent && consenter?.renewed_timestamp && <Text>Renewed on {consenter.renewed_timestamp.reverse()[0]}</Text>}
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
                            <CardBody>Rescind this Consent Form</CardBody>
                            <CardFooter>
                                <RescindModal />
                            </CardFooter>
                        </Card>
                        <Card>
                            <CardBody>Renew this Consent Form for 10 years</CardBody>
                            <CardFooter>
                                <RenewModal setConsentData={setConsentData} consentData={consentData} />
                            </CardFooter>
                        </Card>
                        <Card>
                            <CardBody>Email a copy of this Consent form to {email} </CardBody>
                            <CardFooter>
                                <Button>Email</Button>
                            </CardFooter>
                        </Card>
                    </SimpleGrid>
                    </>
                )}
                <Button my="2em" onClick={signOut}>Sign Out</Button>
        </div>
    );
}
