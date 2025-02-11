import { Link as ReactRouterLink } from 'react-router-dom'
import { Box, Divider, Heading, Text, Link as ChakraLink, UnorderedList, ListItem } from "@chakra-ui/react";

export default function PrivacyPolicyBox() {
    return (
        <Box
            as="section"
            mt="6"
            p="6"
            borderWidth="0.3em"
            borderRadius="1em"
            borderColor="gray.400"
            bg="gray.50"
        >
            <Heading as="h2" size="xl" mb="6">Privacy Policy</Heading>
            <Text>
                This is the Ethical Transparency Tool (“ETT”) Privacy Policy (“Privacy Policy”). It explains how ETT houses and/or transmits the information provided to the ETT system by an individual, an ETT-Registered Entity and its representatives.
            </Text>
            <Text mt="6">
                ETT is hosted on a server and kept on computers in the United States, governed by United States law.  If you are a citizen of or reside in another country, the privacy laws of that home country (or its states, provinces, or other divisions) may be more protective than U.S. laws. Subject to applicable U.S. laws, ETT has been reasonably designed to protect against ETT itself transferring your personal or entity information to anyone other than those meant to receive it within the ETT design. However, your data on servers and computers in the U.S. may be subject to production by us in response to access requests or orders from governments, courts, subpoenas, law enforcement officials and national security authorities in the U.S. under U.S. or state/local laws.  See Parts D, E, and F below on what we do and do not do to limit disclosure of personal information.
            </Text>
            <Divider my="8" />
            <Heading as="h3" size="lg" mb="2">A. About ETT</Heading>
            <Text>
                ETT is just an automation tool that each ETT-Registered Entity may use, in its discretion, to:
                (1) make Disclosure Requests to the Individual’s professional Affiliates (e.g., employers, societies, organizations that appoint or honor an individual, etc.), when considering a consenting Individual for Privileges or Honors, Employment or Roles; and
                (2) get an Individual’s consent to each Affiliate disclosing whether or not it made Findings of Responsibility for ETT-covered kinds of misconduct against the Individual.
            </Text>
            <Text mt="6">
                ETT does not receive any disclosures, findings, or conduct records about any person. At the direction and on behalf of any ETT-Registered Entity—and with the Individual’s consent and direction—ETT provides Disclosure Requests to an individual’s Affiliates, with instructions that they make disclosures directly to the requesting ETT-Registered Entity.
            </Text>
            <Text mt="6">
                ETT is not a policy and does not dictate or guide privilege, honor, employment, human resource, conduct code, qualification, selection or similar policies or decisions, including, e.g., the Privilege(s) or Honor(s), Employment or Role(s) for which any ETT-Registered Entity may opt to use ETT, or how that entity weighs any Finding of Responsibility or decides who is qualified or should be selected.  Such policy- and decision-making are for each ETT-Registered Entity’s independent judgment and action under its own policies and processes. ETT’s terms of use (in the ETT Registration Form) prohibit joint policy- and decision- making by ETT-Registered Entities.
            </Text>
            <Text mt="6">
                ETT is owned by the American Association for the Advancement of Science (“AAAS”), in its role as fiscal and contracting agent for the Societies Consortium to End Harassment in STEMM. In that capacity, AAAS obtains ETT technical development and operations services from Boston University, database hosting services from the Amazon Web Services Platform, and non-technical design, program, professional, staff, management and/or governance services from EducationCounsel LLC. (These entities and/or any additional and successor provider(s) and their governance bodies, officers, personnel, representatives and contractors that may deliver any ETT-related services to AAAS or otherwise for ETT are referred to as “ETT Providers”). AAAS and the ETT Providers are collectively and individually referred to as “we, “us,” “our”.
            </Text>
            <Divider my="6" />
            <Heading as="h3" size="lg" mb="2">B. Your decision — consider this Privacy Policy</Heading>
            <Text>
                If you are a consenting Individual who is considering registering with ETT, and you do not agree to the terms and conditions of this Privacy Policy, then please do not complete any ETT forms or provide us with your information. If you have already completed an ETT Registration Form and Consent Form and you no longer want to agree to this Privacy Policy, you need to rescind those Forms; this Link tells you how.   By completing an Individual Registration Form on the ETT system, and then each time you use ETT (e.g., to complete any ETT form(s)), you acknowledge and agree to be bound by all terms of this Privacy Policy.
            </Text>
            <Text mt="6">
                If you are an “Authorized Individual” or “Administrative Support Professional”—defined as the representatives of a prospective or current ETT-Registered Entity in using ETT who are listed in those roles on the ETT  Registration Form—and you or the entity do not agree to the terms and conditions of this Privacy Policy, then please do not complete the ETT Registration Form or other ETT form, do not provide us with information about yourself, your colleagues, or the entity, resign from being a representative for your entity on ETT, and do not use ETT.   By registering the entity on the ETT database, and then each time you or the ETT-Registered Entity uses ETT (e.g., to complete or amend the entity ETT Registration Form or to initiate a Disclosure Request) you and the entity acknowledge and agree to be bound by all terms of this Privacy Policy.
            </Text>
            <Text mt="6">
                We may change this Privacy Policy over time; check the <ChakraLink color="blue.600" as={ReactRouterLink} to="/privacy">link to this policy</ChakraLink> regularly for updates.
            </Text>
            <Divider my="6" />
            <Heading as="h3" size="lg" mb="2">C. ETT Services</Heading>
            <Text mb="4" >
                ETT provides “ETT Services” (defined as follows):
            </Text>
            <UnorderedList spacing="3">
                <ListItem>
                    ETT and its electronic system house and make publicly accessible to anyone who wants them, blank ETT forms, including, e.g., Registration Forms,  Consent Forms, Exhibit Forms,  Disclosure Forms, etc. These forms may be amended or supplemented over time; check the links for the most up to date forms.
                </ListItem>
                <ListItem>
                    When called for by the ETT design, terms of use, and/or Privacy Policy: (1) ETT ‘s system houses and transmits the information in each Individual’s completed ETT Registration Form and Consent Form (that provide an Individual’s consent to disclosures by specified kinds of professional Affiliates without naming them) and (2) also houses and makes accessible the ETT Registration Form for each ETT-Registered Entity.  See Parts D and E below.
                </ListItem>
                <ListItem>
                    ETT provides only transmittal/conduit services for a consenting Individual’s completed Exhibit Forms where they list their professional Affiliates by name (e.g., employers, professional societies, organizations that appoint or honor the Individual, etc.). The Exhibit Forms affirm that the Individual’s Consent Form covers each listed Affiliate and authorizes the Affiliate to make disclosures to a requesting ETT-Registered Entity.  ETT never evaluates, comments on, or alters information in an Individual’s Exhibit Forms.   ETT does not retain an Individual’s Exhibit Forms longer than needed for their transmittal.  See Part E below.
                </ListItem>
            </UnorderedList>
            <Text mt="6">
                “ETT Services” do not include receipt, housing, or transmittal of disclosures about an Individual. Each Affiliate of an individual provides its disclosures directly to an ETT-Registered Entity that used ETT to make Disclosure Requests.   ETT never receives completed Disclosure Forms.
            </Text>
            <Divider my="6" />
            <Heading as="h3" size="lg" mb="2">D. Information we obtain directly from you and how it is used</Heading>
            <Text my="2">
                If you are an Individual acting for yourself, you provide some personal information to us directly when you register for an account or fill out, rescind, or renew an Individual Registration Form, Consent Form or Exhibit Forms.
            </Text>
            <Text my="2">
                If you are a representative of an entity, you provide some personal and entity information to us when you fill out or amend an Entity Registration Form on behalf of a prospective ETT-Registered Entity, or when you use ETT to request disclosures on behalf of an ETT-Registered Entity or otherwise use the ETT system.
            </Text>
            <Heading as="h4" size="md" my="4">
                1. The types of personal information that we and ETT receive from you include:
            </Heading>
            <Text color="green.800" style={{ fontWeight: "600" }} my="4">
                For an Individual acting for themself:
            </Text>
            <UnorderedList spacing="3">
                <ListItem>
                    An Individual ETT Registration Form digitally signed by you with account Registration Information, including your name, electronic signature, email address, cellphone number, ETT username/password.
                </ListItem>
                <ListItem>
                    Consent Form digitally signed by you and your name, email address, and cell phone number.

                    Your Consent Form and Registration Form are not housed on the general public portion of the ETT website.  They are housed on the portion of the ETT website that is generally available to all ETT-Registered Entities during your Consent Form’s life.  But the beginning and ending effective dates of these Forms—and whether you rescinded or renewed them (and related dates)—are not housed on that portion of the ETT website.  This information is collected from you and available to you and to us. These Forms and information may be accessed by others, as provided in this Privacy Policy.
                </ListItem>
                <ListItem>
                    Exhibit Forms digitally signed by you and the names of your employers, professional societies, organizations that have honored you or appointed you to teaching, research or administrative roles, and other professional entity Affiliates covered by your Consent Form, with the name, title, email and telephone number of a contact at each Affiliate, as well as your name, cell phone number, and email address.  By submitting these Forms, you give us the right to identify you as the person who provided and authorized us to use the name, title, email and phone number of the contacts you provide for your listed Affiliates.
                </ListItem>
            </UnorderedList>
            <Text color="blue.800" style={{ fontWeight: "600" }} my="4">
                For a prospective or current ETT-Registered Entity and the individuals representing it:
            </Text>
            <UnorderedList spacing="3">
                <ListItem>
                    Entity ETT Registration Form digitally signed by you with account Registration Information, including the ETT-Registered Entity’s name and your name, title, electronic signature, email address, telephone number and your ETT username/password, as a representative of the entity.  This information about you will also be provided with Disclosure Requests made on behalf of the ETT-Registered Entity; and your organization’s name and the names, titles, phone numbers and email addresses of the Authorized Individuals will be pre-populated on related Disclosure Forms provided to a person’s Affiliates.  The ETT-Registered Entity’s name is on the public portion of the ETT database. The rest of the information is collected and available to you, to us, and to other ETT-Registered Entities. It may also be provided to or accessed by others, as provided in this Privacy Policy.
                </ListItem>
                <ListItem>
                    Public and Recruitment information relating to ETT, including the ETT-Registered Entity’s and your name, title, and contact information as the Entity’s representative, on publicly facing lists of ETT-Registered Entities as provided in the Registration Form.
                </ListItem>
            </UnorderedList>
            <Heading as="h4" size="md" my="4">
                2. The purposes for which we use a consenting Individual’s personal information, and an ETT-Registered Entity’s and its representatives’ information include:
            </Heading>
            <UnorderedList spacing="3">
                <ListItem>
                    Services.  To provide the ETT Services (defined in C above).
                </ListItem>
                <ListItem>
                    Operations, Maintenance, Enforcement. To operate and maintain ETT; and to enter, administer and enforce our terms of use and/or other terms in the Registration Form, any separate agreements between you or the entity you represent and any of us, this Privacy Policy, and/or the terms of other ETT forms.
                </ListItem>
                <ListItem>
                    Other Purposes. To fulfill: (a) any legal or regulatory requirements and any of our internal policies; (b) other purposes disclosed at the time information is collected; and (c) any other purpose, with your consent.
                </ListItem>
            </UnorderedList>
            <Heading as="h4" size="md" my="4">
                3. ETT and we disclose the following personal information that you (a consenting Individual) provide to the ETT system— and the following information on an ETT-Registered Entity and you that you (the Entity’s representatives) provide to the ETT system:
            </Heading>
            <Text mb="6">
                We provide access to your (a consenting Individual’s) completed Registration Form and Consent Form information, during their life (while they are in effect), to all ETT-Registered Entities.
            </Text>
            <UnorderedList spacing="3">
                <ListItem>
                    <Text style={{ fontWeight: "600" }}>
                        Sharing Information With an ETT-Registered Entity That Is Considering an Individual For a Professional Opportunity:
                    </Text>
                    <Text>
                        Only when directed by you (a consenting Individual) during the life of your  Consent Form —each time any ETT-Registered Entity considers you for any Employment or Roles or Privileges or Honors and intends to use ETT to request disclosures from your Affiliates—ETT, as a mere conduit, transmits the information you provide in your full Exhibit Form (your name and contact information and your Affiliates and their contacts) to that ETT-Registered Entity’s representatives. These representatives are the “Authorized Individuals” (meaning two senior officials listed on the Entity Registration Form) and the “Administrative Support Professional” (meaning the person who will assist the Authorized Individuals in use of ETT, also listed on the Entity Registration Form).
                    </Text>
                </ListItem>
                <ListItem>
                    <Text style={{ fontWeight: "600" }}>
                        Sharing Information With an Individual’s Affiliates That Are Being Asked for Disclosures:
                    </Text>
                    <Text>
                        Also, during your Consent Form’s life and only when directed by both you (a consenting Individual) and by the ETT-Registered Entity that is considering you— ETT, as a mere conduit following those directions, transmits separately to each of your listed Affiliates, the ETT-Registered Entity’s Disclosure Request to that Affiliate.  The request asks for disclosures using the ETT Disclosure Form (or disclosure of the information called for by the form).
                    </Text>
                    <Text mt={4}>
                        Each transmittal of a Disclosure Request includes your Consent Form, one of your single entity Exhibit Forms (listing only the Affiliate that is receiving that request with its professional relationship to you and its contact—so one Affiliate is not informed of your other Affiliates), and a blank Disclosure Form.  Each transmittal also includes the contact information for the listed ETT-Registered Entity’s Authorized Individual(s), with instructions to the Affiliate to provide its completed Disclosure Form directly to those Authorized Individual(s). We and ETT never receive completed ETT Disclosure Forms, findings, or conduct information.
                    </Text>
                </ListItem>
                <ListItem>
                    <Text style={{ fontWeight: "600" }}>
                        Sharing Information to Provide, Improve, and Maintain ETT Services or Respond to Issues:
                    </Text>
                    <Text>
                        AAAS and the ETT Providers receive and share with each other prospective and existing ETT-Registered Entity and consenting Individual and entity representative personal information to help us provide, operate, improve, and maintain ETT and to respond to any issues related to ETT.
                    </Text>
                </ListItem>
                <ListItem>
                    <Text style={{ fontWeight: "600" }}>
                        Sharing Information in a Sale or Transfer of Operations or Assets:
                    </Text>
                    <Text>
                        If any of us becomes involved with other entit(ies) in a transaction that includes or affects ETT in any way, or if AAAS and/or any ETT Provider(s) pursue a possible change in ETT Services or ETT Providers, we may provide prospective or existing ETT-Registered Entity and consenting Individual and entity representative personal information gained in designing, operating, or otherwise relating to ETT, to those other entities and their representatives and contractors. (Examples of such transactions include a collaboration or a sale, assignment, other acquisition, divestiture, merger, bankruptcy, consolidation, reorganization, liquidation, or other transfer of any of our operations or assets that relate to or include ETT.)
                    </Text>
                </ListItem>
                <ListItem>
                    <Text style={{ fontWeight: "600" }}>
                        Information Use Limits That ETT-Registered Entities Must Agree To, But ETT and We Do Not Monitor:
                    </Text>
                    <Text>
                        ETT is just a tool, used by ETT-Registered Entities and an Individual’s professional Affiliates to receive that person’s consent for making disclosures and to request disclosures.  Each ETT-Registered Entity is required to agree in its Registration Form not to share completed Consent Forms, Exhibit Forms, or Disclosure Forms that they receive or have access to with other entities and to use ETT only for purposes related to Employment or Roles, Privileges or Honors, as provided in the Consent Form that you (as an Individual) complete.  Affiliates are directed on the Disclosure Form to share their completed Form directly with the ETT-Registered Entity that requested it. ETT Services do not include monitoring use of ETT by ETT-Registered Entities and an Individual’s Affiliates or enforcement of ETT’s terms of use.  But an ETT-Registered Entity’s participation in ETT may be terminated, with or without cause, as provided in the Registration Form’s terms of use.
                    </Text>
                </ListItem>
            </UnorderedList>
            <Divider my="6" />
            <Heading as="h3" size="lg" mb="2">E. Information retention</Heading>
            <UnorderedList spacing="3">
                <ListItem>
                    ETT maintains your (an Individual’s) Consent Form in the ETT system and makes it available on the ETT-Registered Entity part of the website, during the Consent Form’s life (which is 10 years, unless you rescind it early or renew it, as provided in the Consent Form).
                </ListItem>
                <ListItem>
                    <Text>
                        ETT is only a transmittal conduit—not a records repository—for Exhibit Forms and Disclosure Requests.  We do not retain these materials longer than needed to transmit them, as directed by you (the consenting Individual) and by the ETT-Registered Entity that you list in Exhibit Forms.  We delete all of your Exhibit Forms upon the sooner of:
                    </Text>
                    <UnorderedList spacing="2" mt="4" styleType={"lower-alpha"}>
                        <ListItem>
                            upon expiration of 60 days after you submit them via the ETT, IF the ETT-Registered Entity that you list in your Exhibit Form does not initiate Disclosure Requests to your listed Affiliates via ETT by that time; OR
                        </ListItem>
                        <ListItem>
                            immediately after the listed ETT-Registered Entity timely initiates Disclosure Requests via ETT—and ETT completes the transmittal of the initial requests and subsequent reminders.
                        </ListItem>
                    </UnorderedList>
                    <Text mt="4">
                        An Individual completes new, up-to-date Exhibit Forms each time they are being considered by any ETT-Registered Entity that wants to use ETT to make Disclosure Requests about them.
                    </Text>
                </ListItem>
                <ListItem>
                    ETT also retains archival information of the fact that an Individual’s Registration Form, Consent Form, and Exhibit Forms existed (with dates), as well as ETT’s transmittal of Disclosure Requests (with the Registered Entit(ies)’ and Affiliate(s)’ names)— so that we can confirm their having existed at a particular time, if challenged, or can respond if we are legally required to disclose the information.  This archival information is behind a firewall and available to ETT and us, and may be available to some others as provided in this Privacy Policy.
                </ListItem>
            </UnorderedList>
            <Divider my="6" />
            <Heading as="h3" size="lg" mb="2">F. Confidentiality and Security</Heading>
            <Text>
                We value your privacy and are committed to taking commercially reasonable steps to protect the integrity and security of your (the consenting Individual’s) information and ETT-Registered Entit(ies)’ and their representatives’ information.  ETT is designed with commercially reasonable administrative, technical, and physical safeguards in an effort to guard against unauthorized access, use, alteration, or destruction of personal and entity information.
            </Text>
            <Divider my="6" />
            <Heading as="h3" size="lg" mb="2">G. Children</Heading>
            <Text>
                We do not knowingly collect or solicit personal information on Individuals under the age of 18.   If we learn that we have inadvertently collected or received personal information from a person under the age of 18, other than where such personal information has been provided by an adult (such as a parent or guardian), we will delete that information as quickly as reasonably possible.
            </Text>
            <Divider my="6" />
            <Heading as="h3" size="lg" mb="2">H. Contact Us</Heading>
            <Text>
                If you have any questions concerning your personal or entity information or about our use or disclosure of that information, please contact us as via [ ].
            </Text>
        </Box>
    );
}
