import { Link as ReactRouterLink } from 'react-router-dom';
import { Text, Box, Divider, Heading, OrderedList, ListItem, UnorderedList, Link as ChakraLink, useDisclosure, Drawer, DrawerOverlay, DrawerHeader, DrawerBody, DrawerFooter, Button, DrawerContent, DrawerCloseButton } from "@chakra-ui/react";

export default function ConsentFormText() {
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
                <Text color="gray.700" mb="4" >Hover on underlined terms for definitions, or <Button textDecoration="underline" variant="link" onClick={onOpen}>click here to see a full list</Button>.</Text>
                <Heading as="h3" size="lg" mb="2">A. Fundamental Principles (Principles)</Heading>
                <Text>
                    The institutions and societies that are using the Ethical Transparency Tool are committed to providing a climate and culture where all are welcome and able to thrive, for the sake of our community members and to advance our integrity, excellence, and earned public trust. While people found responsible for misconduct may learn lessons, change conduct, and regain trust, transparency is important.  Not knowing about findings of sexual, gender, and racial/ethnic misconduct, along with certain other ethical misconduct, prevents us from achieving the climate and culture we value. 
                </Text>
                <Divider my="8" />
                <Heading as="h3" size="lg" mb="2">B. Give Your Consent</Heading>
                <Text mb="4">
                    This Consent Form is part of the Ethical Transparency Tool, a tool to advance the Principles.
                </Text>
                <Text mb="4">
                    As a condition to being considered for Privileges or Honors, Employment or Roles, by an ETT-Registered Entity
                    now or in the future, and by submitting this Consent Form, I give my consent to any Consent Recipient(s) 
                    to complete a Disclosure Form about me and to provide it or its information to any ETT-Registered Entit(ies) 
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
                        Consent Recipient(s) are my:  
                    </Text>
                    <OrderedList spacing="4">
                        <ListItem>
                            Current employers and former employers (the look-back period for former employers will be determined by 
                            each ETT-Registered Entity at the time it uses this Consent Form to request a disclosure)
                        </ListItem>
                        <ListItem>
                            Current and former academic, professional, and field-related honorary and membership societies and 
                            organizations (same look-back period as in #1);
                        </ListItem>
                        <ListItem>
                            Current and former entities and organizations where I have or had emeritus/emerita, visiting, or other teaching, 
                            research, or administrative appointments or that have given me an honor or award (same look-back period as in #1)
                        </ListItem>
                        <ListItem>
                            The entities and organizations where I have any of the above-listed kinds of affiliations in the future.
                        </ListItem>
                    </OrderedList>
                </Box>
                <Text mt="6">
                    To provide an up-to-date list, I will submit Exhibit Forms listing the name, title, and a contact for each of my 
                    Consent Recipients each time any ETT-Registered Entity makes a request for disclosures.  
                </Text>
                <Text mt="6">
                    This Consent Form, any Exhibit Forms and any completed Disclosure Form about me may only be used in connection 
                    with Privileges or Honors and Employment or Roles.  Other policies or laws may provide for additional disclosures 
                    (beyond those covered by the Ethical Transparency Tool).
                </Text>
                <Text mt="6" fontWeight="600">
                    To the maximum extent that law allows me to knowingly give a waiver/release: 
                </Text>
                <OrderedList spacing="4">
                    <ListItem>
                        I waive any non-disclosure, non-disparagement, confidentiality and other limitations that would otherwise apply 
                        to a completed Disclosure Form6 about me which are imposed by—
                        <UnorderedList>
                            <ListItem>
                                any current or future agreement or 
                            </ListItem>
                            <ListItem>
                                any law or policy in effect when a completed Disclosure Form or its information is provided;
                            </ListItem>
                        </UnorderedList>
                    </ListItem>
                    <ListItem>
                        I waive and release all claims and liabilities of every kind that are associated with this Consent Form, 
                        any Exhibit Form(s), or the disclosures and uses of disclosures to which I am consenting, against any: 
                        Consent Recipient(s),5 ETT-Registered Entit(ies),7 and/or the ETT Sponsors8 (and their respective prior, 
                        current, and future directors/trustees/managers, officers, partners/members/ stockholders, personnel, 
                        agents, contractors, and representatives), which are the released parties.  This waiver and release as applied to 
                        any one of the released parties also covers the misuse of this Consent Form,1 any Exhibit Forms5 and/or any completed 
                        Disclosure Form6 by any other released part(ies).
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
                    <Text fontWeight={500}>
                        This Consent Form will expire in 10 years (after the date I submit it) unless I renew it.  I may rescind this 
                        Consent Form1 by clicking on the link below. The link explains one exception to the expiration or rescission of my Consent Form.
                    </Text>
                </Box>
                <Text>
                    I agree that a copy of this Consent Form may be given at any time to any Consent Recipient(s) and ETT-Registered Entit(ies). 
                    I agree that this electronic Consent Form, my electronic (digital) signature, and any copy will have the same effect as originals for all purposes. 
                    I have read this Consent Form (including the definitions) and read and agree to <ChakraLink color="blue.600" as={ReactRouterLink} to="/privacy" textDecoration="underline">the ETT Privacy Policy</ChakraLink>. I have had the time 
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
                    <Heading as="h3" size="sm">Ethical Transparency Tool (or ETT)</Heading> 
                    <Text mb="6">
                        means a tool that enables each Consent Recipient to provide a completed Disclosure Form (or its information) about an individual who has 
                        signed and delivered a “Consent Form” (this form) to ETT.   Each ETT-Registered Entity (RE) retains its independence in policymaking and 
                        decision-making (e.g., on when to use the ETT, how to respond to disclosures, who’s qualified or selected).  Before completing a Consent 
                        Form, an individual completes an ETT “Registration Form” at this link to receive their ETT account. Individuals do so proactively—or when 
                        it is a condition to being considered for Privilege(s) or Honor(s), Employment or Role(s) by any ETT-Registered Entit(ies).
                    </Text>
                    <Heading as="h3" size="sm">Principles</Heading> 
                    <Text mb="6">
                        mean the statements in “Part A. FUNDAMENTAL PRINCIPLES” of the Consent Form.
                    </Text>
                    <Heading as="h3" size="sm">Privilege(s) or Honor(s)</Heading>
                    <Text mb="6">
                        Examples include but are not limited to: elected fellow, elected or life membership; recipient of an honor, award, or an emeritus or endowed role; elected or appointed governance, committee, officer, or leadership role. However, Privilege(s) or Honor(s) do not include basic membership in an academic, professional, or honorary society at an individual’s initiative (i.e., when not elected or awarded).  Other Privilege(s) or Honor(s) that an ETT-Registered Entity identifies as affecting climate, culture or enterprise risk may be included (e.g., volunteer roles).  
                    </Text>
                    <Heading as="h3" size="sm">Employment or Role(s)</Heading>
                    <Text mb="6">
                    Examples include but are not limited to: employment; employee appointment or assignment to a supervisory, evaluative, committee, or mentoring role. May include other employment roles and decisions that an ETT-Registered Entity identifies as affecting climate, culture, or enterprise risk.
                    </Text>
                    <Heading as="h3" size="sm">Consent Recipient(s)</Heading>
                    <Text mb="6">
                        (also called Affiliate(s)) mean the entities referenced in Part B. 1, 2, 3, 4 of the Consent Form.  A Consent Recipient (Affiliate) is the “Disclosing Entity” that completes a Disclosure Form when requested.  For up-to-date information, the person who submits a Consent Form also provides a list of the names of their Consent Recipients (Affiliates), with contacts, using “Exhibit Forms” at this link each time any ETT-Registered Entity is considering the person for a Privilege or Honor, Employment or Role and is anticipating using ETT to make a Disclosure Request about a person who has completed a Consent Form. 
                    </Text>
                    <Heading as="h3" size="sm">The Disclosure Form</Heading>
                    <Text mb="6">
                        means the form at this link. <b>Finding of Responsibility</b> is a finding of any one or more of the generic types of misconduct listed or referenced on the Disclosure Form; it is defined by the Consent Recipient (Affiliate) that made or adopted the finding under its own policy (see the Disclosure Form for details).  A Disclosure Form is completed when a Consent Recipient checks the Finding(s) of Responsibility it has made or adopted against a person (with the year(s)) or checks “No Finding of Responsibility” or “Will Not Be Responding”—and gives the completed Disclosure Form or its information to a RE.  
                    </Text>
                    <Heading as="h3" size="sm">ETT-Registered Entit(ies) or “RE”</Heading>
                    <Text mb="6">
                        mean the entities and organizations now or in the future registered to use the Ethical Transparency Tool by completing an “ETT Registration Form”. See this link for a list that will be updated over time. RE(s) are the only entities that may use ETT to make a Disclosure Request to Consent Recipients (Affiliates).  ETT sends a separate Disclosure Request on behalf of a RE to each Affiliate of a person, including the person’s Consent Form, a Single Entity Exhibit Form naming that Affiliate as a Consent Recipient, a blank Disclosure Form and instructions to respond directly to the RE. 
                    </Text>
                    <Heading as="h3" size="sm">ETT Sponsors</Heading>
                    <Text mb="6">
                        mean the owner(s), designer(s), developer(s), host(s), administrator(s), operator(s), governing bod(ies), sponsor(s), funder(s), and/or advisor(s) for the Ethical Transparency Tool.
                    </Text>
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