import { Box, Heading, Image, ListItem, Text, UnorderedList } from "@chakra-ui/react";

export default function DescriptionDetails() {
    return (
        <>
            <Heading my="4" size="md">What are the benefits of ETT?</Heading>
            <UnorderedList>
                <ListItem>
                    Creating a healthy climate for all - avoiding awards and appointments for harassers, while recognizing that a person 
                    may learn and correct past behaviors, and regain trust, benefiting everyone.  
                </ListItem>
                <ListItem>
                    Ethically treating everyone - making it easier for an entity that made a misconduct finding (the most reliable source) 
                    to share it with an entity that requests it via ETT.  Doing so with care for sensitive information and without shaming or whisper campaigns.
                </ListItem>
                <ListItem>
                    Minimizing legal and enterprise risk for all involved: organizations maintain independence in all policy- and decision making; candidates provide 
                    consent for disclosures; and disclosures are limited to useful but hard to dispute facts—the kind and year of a misconduct finding.
                </ListItem>
                <ListItem>
                    Enhancing efficiency in consenting to and requesting disclosures – a person’s single consent has a 10-year life. It can be used to request and provide 
                    disclosures throughout (by any ETT-Registered Entities and a consenting person’s professionally affiliated entities), unless a person rescinds their consent early. ETT automates requests for disclosures and reminders.
                </ListItem>
                <ListItem>
                    ETT never receives disclosures–only the organizations that request them using ETT do - there is no centralized shame list or conduct record. 
                </ListItem>
            </UnorderedList>
            <Heading my="4" size="md">How does the Ethical Transparency Tool work?</Heading>
            <Box display="flex" justifyContent="center" mt="4">
                <Image src="/ett-explanation-diagram.png" alt="ETT Diagram" />
            </Box>
            <Heading my="4" size="md">What information is retained in the ETT?</Heading>
            <Text mb="4">
                Organizations’ and individuals’ registration to use ETT and individuals’ consent forms are stored in ETT.  Candidate professional affiliations 
                (their employers, appointing and honoring organizations, and societies - with contact information) and organization requests for disclosures are deleted 
                as soon as ETT sends the requests
                and two reminders. (A limited archival record of making the transmission is kept behind a firewall.)  ETT is a conduit, not a records repository. 
            </Text>
            <Text>
                For more information, please see the Ethical Transparency Tool <a href="/privacy" style={{ textDecoration: 'underline' }}>Privacy Policy</a> or
                visit the <a href="https://societiesconsortium.com/" style={{ textDecoration: 'underline' }}>Societies Consortium to End Harassment in STEMM website</a>.
            </Text>
        </>
    );
}
