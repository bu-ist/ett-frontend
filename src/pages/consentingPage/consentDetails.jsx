import { Icon, Tabs, TabList, TabPanels, Tab, TabPanel, Text, Box, Button, Card, CardBody, SimpleGrid, CardFooter } from '@chakra-ui/react';
import { HiCheckCircle } from 'react-icons/hi';

export default function ConsentDetails({ consentData, consenterInfo }) {

    const { consenter, fullName, activeConsent, entities } = consentData;
    const { email } = consenterInfo;

    return (
        <div>
            <p>{fullName}</p>
            <Tabs variant='enclosed-colored' mt='2em'>
                <TabList>
                    <Tab>Your Consent</Tab>
                    <Tab>Your Exhibit Forms</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <Text><Icon as={HiCheckCircle} color="green.500" /> Consent granted on {consenter.consented_timestamp}</Text>
                        <SimpleGrid spacing={4} mt="2em" templateColumns='repeat(auto-fill, minmax(200px, 1fr))'>
                            <Card>
                                <CardBody>Rescind this Consent Form</CardBody>
                                <CardFooter>
                                    <Button>Rescind</Button>
                                </CardFooter>
                            </Card>
                            <Card>
                                <CardBody>Renew this Consent Form for 10 years</CardBody>
                                <CardFooter>
                                    <Button>Renew</Button>
                                </CardFooter>
                            </Card>
                            <Card>
                                <CardBody>Make corrections to this Consent Form</CardBody>
                                <CardFooter>
                                    <Button>Correct</Button>
                                </CardFooter>
                            </Card>
                            <Card>
                                <CardBody>Email a copy of this Consent form to {email} </CardBody>
                                <CardFooter>
                                    <Button>Email</Button>
                                </CardFooter>
                            </Card>
                        </SimpleGrid>
                    </TabPanel>
                    <TabPanel>
                        <p>Exhibit forms</p>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </div>
    );
}
