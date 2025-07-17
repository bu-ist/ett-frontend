import { Link as ReactRouterLink } from 'react-router-dom';
import { Text, Box, Divider, Heading, OrderedList, ListItem, UnorderedList, Link as ChakraLink, useDisclosure, Drawer, DrawerOverlay, DrawerHeader, DrawerBody, DrawerFooter, Button, DrawerContent, DrawerCloseButton, Accordion, AccordionItem, AccordionButton, AccordionIcon, AccordionPanel } from "@chakra-ui/react";
import PropTypes from 'prop-types';

import DefinitionPopover from "../../../components/sharedTexts/definitions/definitonPopover";

import { 
    EttDefinition,
    PrinciplesDefinition,
    PrivilegesDefinition,
    EmploymentRolesDefinition,
    ConsentRecipientDefinition,
    DisclosureFormDefinition,
    RegisteredEntityDefinition,
    SponsorsDefinition,
} from '../../../components/sharedTexts/definitions/definitions';

import ConsentExpirationExceptionsText from '../../../components/sharedTexts/consentExpirationExceptionsText';

export default function ConsentFormText({ disclosureFormUrl, registrationFormEntityUrl }) {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <Box
                my="2em"
                as="section"
                mt="6"
                p="6"
                borderWidth="0.3em"
                borderRadius="1em"
                borderColor="gray.400"
                bg="gray.50"
            >
                <Text color="gray.700" mb="4" >Click on underlined terms for definitions, or <Button textDecoration="underline" variant="link" onClick={onOpen}>click here to see a full list</Button>.</Text>
                <Heading as="h3" size="lg" mb="2">A. Fundamental Principles (Principles)</Heading>
                <Text>
                    The institutions and societies that are using the Ethical Transparency Tool
                    are committed to providing a climate and culture where all are welcome and able to thrive, for the sake of our 
                    community members and to advance our integrity, excellence, and earned public trust. While people found responsible for 
                    misconduct may learn lessons, change conduct, and regain trust, transparency is important.  Not knowing about findings 
                    of sexual, gender, and racial/ethnic misconduct, along with certain other types of misconduct, prevents us from achieving 
                    the climate and culture we value. 
                </Text>
                <Divider my="8" />
                <Heading as="h3" size="lg" mb="2">B. Give Your Consent</Heading>
                <Text mb="4">
                    This Consent Form is part of the 
                    {' '}
                    <DefinitionPopover termName="Ethical Transparency Tool">
                        <EttDefinition />
                    </DefinitionPopover>
                    , a tool to advance the 
                    {' '}
                    <DefinitionPopover termName="Principles">
                        <PrinciplesDefinition />
                    </DefinitionPopover>
                    .
                </Text>
                <Text mb="4">
                    As a condition to being considered for certain
                    {' '}
                    <DefinitionPopover termName="Privileges or Honors">
                        <PrivilegesDefinition />
                    </DefinitionPopover>
                    ,
                    {' '}
                    <DefinitionPopover termName="Employment or Roles">
                        <EmploymentRolesDefinition />
                    </DefinitionPopover>
                    , 
                    by any 
                    {' '}
                    <DefinitionPopover termName="ETT-Registered Entity">
                        <RegisteredEntityDefinition registrationFormEntityUrl={registrationFormEntityUrl} />
                    </DefinitionPopover>
                    {' '}
                    now or in the future, and by submitting this Consent Form, I give my consent to any 
                    {' '}
                    <DefinitionPopover termName="Consent Recipient(s)">
                        <ConsentRecipientDefinition />
                    </DefinitionPopover>
                    {' '}
                    to complete a 
                    {' '}
                    <DefinitionPopover termName="Disclosure Form">
                        <DisclosureFormDefinition disclosureFormUrl={disclosureFormUrl} />
                    </DefinitionPopover>
                    {' '}
                    about me and to provide it or its information to any 
                    {' '}
                    <DefinitionPopover termName="ETT-Registered Entit(ies)">
                        <RegisteredEntityDefinition registrationFormEntityUrl={registrationFormEntityUrl} />
                    </DefinitionPopover>
                    {' '}
                    that make(s) a request for disclosures during the life of this Consent Form.
                </Text>
                <Box
                    p="4"
                    borderWidth="0.2em"
                    borderRadius="0.9em"
                    borderColor="blue.700"
                    bg="gray.200"
                >
                    <Text mb="6">
                        <DefinitionPopover termName="Consent Recipient(s)">
                            <ConsentRecipientDefinition />
                        </DefinitionPopover>
                        {' '}
                        are my:  
                    </Text>
                    <OrderedList spacing="4">
                        <ListItem>
                            Current employers and former employers (the look-back period for former employers will be determined by 
                            each 
                            {' '}
                            <DefinitionPopover termName="ETT-Registered Entity">
                                <RegisteredEntityDefinition registrationFormEntityUrl={registrationFormEntityUrl} />
                            </DefinitionPopover>
                            {' '}
                            at the time it uses this Consent Form to request a disclosure)
                        </ListItem>
                        <ListItem>
                            Current and former academic, professional, and field-related honorary and membership societies and 
                            organizations (same look-back period as in #1);
                        </ListItem>
                        <ListItem>
                            Current and former entities and organizations where I have or had emeritus/emerita, visiting, or other teaching, 
                            research, or administrative appointments or that have given me an honor or award (same look-back period as in #1);
                        </ListItem>
                        <ListItem>
                            The entities and organizations where I have any of the above-listed kinds of affiliations in the future.
                        </ListItem>
                    </OrderedList>
                </Box>
                <Text mt="6">
                    To provide an up-to-date list, I will submit 
                    {' '}
                    <DefinitionPopover termName="Exhibit Forms">
                        <ConsentRecipientDefinition />
                    </DefinitionPopover>
                    {' '}
                    listing the name, title, and a contact for each of my 
                    Consent Recipients each time any 
                    {' '}
                    <DefinitionPopover termName="ETT-Registered Entity">
                        <RegisteredEntityDefinition registrationFormEntityUrl={registrationFormEntityUrl} />
                    </DefinitionPopover>
                    {' '}
                    makes a request for disclosures.  
                </Text>
                <Text mt="6">
                    This Consent Form, any 
                    {' '}
                    <DefinitionPopover termName="Exhibit Forms">
                        <ConsentRecipientDefinition />
                    </DefinitionPopover>
                    {' '}
                    and any completed 
                    {' '}
                    <DefinitionPopover termName="Disclosure Form">
                        <DisclosureFormDefinition disclosureFormUrl={disclosureFormUrl} />
                    </DefinitionPopover>
                    {' '}
                    about me may only be used in connection with 
                    {' '}
                    <DefinitionPopover termName="Privileges or Honors">
                        <PrivilegesDefinition />
                    </DefinitionPopover>
                    {' '}
                    and 
                    {' '}
                    <DefinitionPopover termName="Employment or Roles">
                        <EmploymentRolesDefinition />
                    </DefinitionPopover>
                    .  Other policies or laws may provide for additional disclosures 
                    (beyond those covered by the 
                    {' '}
                    <DefinitionPopover termName="Ethical Transparency Tool">
                        <EttDefinition />
                    </DefinitionPopover>
                    ).
                </Text>
                <Text mt="6" fontWeight="600">
                    To the maximum extent that law allows me to knowingly give a waiver/release: 
                </Text>
                <OrderedList spacing="4">
                    <ListItem>
                        I waive any non-disclosure, non-disparagement, confidentiality and other limitations that would otherwise apply 
                        to a completed 
                        {' '}
                        <DefinitionPopover termName="Disclosure Form">
                            <DisclosureFormDefinition />
                        </DefinitionPopover>
                        {' '}
                        about me which are imposed by—
                        <UnorderedList>
                            <ListItem>
                                any current or future agreement or 
                            </ListItem>
                            <ListItem>
                                any law or policy in effect when a completed 
                                {' '}
                                <DefinitionPopover termName="Disclosure Form">
                                    <DisclosureFormDefinition />
                                </DefinitionPopover>
                                {' '}
                                or its information is provided; and
                            </ListItem>
                        </UnorderedList>
                    </ListItem>
                    <ListItem>
                        I waive and release all claims and liabilities of every kind that are associated with this Consent Form, 
                        any 
                        {' '}
                        <DefinitionPopover termName="Exhibit Form(s)">
                            <ConsentRecipientDefinition />
                        </DefinitionPopover>
                        , or the disclosures and uses of disclosures to which I am consenting, against any: 
                        {' '}
                        <DefinitionPopover termName="Consent Recipient(s)">
                            <ConsentRecipientDefinition />
                        </DefinitionPopover>
                        ,
                        {' '}
                        <DefinitionPopover termName="ETT-Registered Entit(ies)">
                            <RegisteredEntityDefinition registrationFormEntityUrl={registrationFormEntityUrl} />
                        </DefinitionPopover> 
                        , and/or the 
                        {' '}
                        <DefinitionPopover termName="ETT Sponsors">
                            <SponsorsDefinition />
                        </DefinitionPopover>
                        {' '}
                        (and their respective prior, 
                        current, and future directors/trustees/managers, officers, partners/members/ stockholders, personnel, 
                        agents, contractors, and representatives), which are the released parties.  This waiver and release as applied to 
                        any one of the released parties also covers the misuse of this Consent Form, any 
                        {' '}
                        <DefinitionPopover termName="Exhibit Forms">
                            <ConsentRecipientDefinition />
                        </DefinitionPopover>
                        {' '}
                        and/or any completed 
                        {' '}
                        <DefinitionPopover termName="Disclosure Form">
                            <DisclosureFormDefinition />
                        </DefinitionPopover>
                        {' '}
                        by any other released part(ies).
                    </ListItem>
                </OrderedList>
                
                <Box
                    my="8"
                    p="4"
                    borderWidth="0.2em"
                    borderRadius="0.9em"
                    borderColor="blue.700"
                    bg="gray.200"
                >
                    <Text fontWeight={500} mb="4">
                        This Consent Form will expire in 10 years (after the date I submit it) unless I renew it.  I may rescind this 
                        Consent Form from my ETT dashboard. The link below explains one exception to the expiration or rescission of my Consent Form.
                    </Text>
                    <Accordion allowToggle>
                        <AccordionItem p="2" border="1px" borderColor="gray.400" borderRadius="md" backgroundColor="gray.100">
                            <h2>
                                <AccordionButton>
                                    <Box as="span" flex='1' textAlign='left'>
                                        <Heading size="sm">Click here for information on Consent expiration exception</Heading>
                                    </Box>
                                    <AccordionIcon />
                                </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4}>
                                <ConsentExpirationExceptionsText link={true} />
                            </AccordionPanel>
                        </AccordionItem>
                    </Accordion>
                </Box>
                <Text>
                    I agree that a copy of this Consent Form may be given at any time to any 
                    {' '}
                    <DefinitionPopover termName="Consent Recipient(s)">
                        <ConsentRecipientDefinition />
                    </DefinitionPopover>
                    {' '}
                    and 
                    {' '}
                    <DefinitionPopover termName="ETT-Registered Entit(ies)">
                        <RegisteredEntityDefinition registrationFormEntityUrl={registrationFormEntityUrl} />
                    </DefinitionPopover>
                    . 
                    I agree that this electronic Consent Form, my electronic (digital) signature, and any copy will have the same effect as originals for all purposes. 
                    I have read this Consent Form (including the <Button textDecoration="underline" variant="link" onClick={onOpen}>definitions</Button>) 
                    and read and agree to <ChakraLink color="blue.600" as={ReactRouterLink} to="/privacy" textDecoration="underline">the ETT Privacy Policy</ChakraLink>. I have had the time 
                    to consider and consult anyone I wish on whether to provide this Consent Form.  I am at least 18 years old and it is my knowing and voluntary 
                    decision to sign and deliver this Consent Form.
                </Text>
            </Box>
            <Drawer
                isOpen={isOpen}
                placement='right'
                onClose={onClose}
                size="lg"
            >
                <DrawerOverlay />
                <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>Definitions</DrawerHeader>

                <DrawerBody>
                    <EttDefinition />
                    <PrinciplesDefinition />
                    <PrivilegesDefinition />
                    <EmploymentRolesDefinition />
                    <ConsentRecipientDefinition />
                    <DisclosureFormDefinition disclosureFormUrl={disclosureFormUrl} />
                    <RegisteredEntityDefinition registrationFormEntityUrl={registrationFormEntityUrl} />
                    <SponsorsDefinition />
                    <Text mb="6">
                        (ETT-related Forms may be amended for amplification, clarity, or operations over time and re-posted.) 
                    </Text>
                </DrawerBody>

                <DrawerFooter>
                    <Button mr={3} onClick={onClose}>
                        Close
                    </Button>
                </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    );
}

ConsentFormText.propTypes = {
    disclosureFormUrl: PropTypes.string.isRequired,
    registrationFormEntityUrl: PropTypes.string.isRequired,
};