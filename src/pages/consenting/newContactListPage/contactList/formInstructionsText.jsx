import { Box, ListItem, OrderedList, Text } from "@chakra-ui/react";

export default function FormInstructionsText({ entityName, formConstraint }) {

    const currentEmployer = formConstraint === 'current';

    return (
        <Box mb="6">
            <Text fontSize="xl" fontWeight="semibold" my="4">
                I direct the Ethical Transparency Tool (&ldquo;ETT&rdquo;) to do the following and consent to it doing so: 
            </Text>
            <OrderedList spacing="4" styleType="lower-alpha">
                <ListItem>
                    {currentEmployer ? (
                        <b>Transmit this &ldquo;Current Employer(s) Exhibit Form&rdquo; and my <u>&ldquo;Single-Entity Exhibit Form&rdquo;</u> for each of my Current Employer(s) and Appointing Organization(s) on my behalf to my private page on ETT.</b>
                    ) : (
                        <b>Transmit this &ldquo;Full Exhibit Form&rdquo; and my accompanying  &ldquo;Single-Entity Exhibit Forms&rdquo; on my behalf to my private page on ETT.</b>
                    )}
                </ListItem>
                <ListItem>
                    <b>Also transmit this { currentEmployer ? "Current Employer(s)" : "Full" } Exhibit Form on my behalf to</b> {entityName}, which is the ETT-Registered Entity that requested it 
                    (&ldquo;Registered Entity&rdquo;) in connection with considering me for a Privilege or Honor, Employment or Role at this time.
                </ListItem>
                <ListItem>
                    <Text>
                        <b><u>Within the next 60 days</u>—if the Registered Entity initiates transmittal(s) via ETT to my listed Consent Recipient(s)/Affiliates, 
                        asking them to complete Disclosure Forms about me (“Disclosure Request(s)”), transmit the Disclosure Request(s),</b> copying the Registered Entity and me. 
                        Each Disclosure Request will include my Consent Form, the relevant Single-Entity Exhibit Form (listing only the Consent Recipient/Affiliate 
                        that is receiving it — so one Consent Recipient is not notified of the others), and a blank Disclosure Form. Copy the Registered Entity and me on the 
                        Disclosure Requests. 
                    </Text>
                    <Text mt="4">
                        {currentEmployer ? (
                            <b><u>Within the 21 days after sending the initial Disclosure Request(s) (2 weeks after, and 1 week after that)</u>—resend the Registered Entity’s 
                            Disclosure Request(s) twice (as reminders) separately to each of my Consent Recipients (current employer(s) and appointing organization(s)) listed 
                            in this Exhibit Form, copying the Registered Entity and me. Then promptly delete the Disclosure Requests, my Current Employer(s) Exhibit Form and all related Single 
                            Entity Exhibit Forms from ETT (as ETT will have completed its transmittal role).</b>
                        ) : (
                            <b><u>Within the 21 days after sending the initial Disclosure Request(s) (2 weeks after, and 1 week after that)</u>—resend the Registered Entity’s 
                            Disclosure Request(s) twice (as reminders) separately to each of my Consent Recipients (Affiliates) listed in this Exhibit Form, copying the Registered Entity and me. 
                            Then promptly delete the Disclosure Requests, my Full Exhibit Form and all related Single Entity Exhibit Forms from ETT (as ETT will have completed its 
                            transmittal role).</b>
                        )}
                    </Text>
                </ListItem>
                <ListItem>
                    <b><u>I agree that my ETT Registration Form and Consent Form will remain in effect for use with these particular Disclosure Requests and 
                    my Consent Recipient(s)’ disclosures in response (even if my ETT Registration and Consent otherwise expire or are rescinded).</u></b>
                </ListItem>
                <ListItem>
                    <b><u>I agree that ETT has the right to identify me as the person who provided and authorized use of the name, title, email and phone number 
                    of the contacts I’ve listed for my Consent Recipients (Affiliates).</u></b>
                </ListItem>
                <ListItem>
                    <b>If the Registered Entity does not initiate Disclosure Requests within the 60-day period provided, delete all of these Exhibit Forms from ETT.</b>
                </ListItem>
            </OrderedList>
            <Text my="6">
                I agree that this electronic { currentEmployer ? "Current Employer(s)" : "Full" } Exhibit Form and my electronic (digital) signature, and any copy will have the same effect as originals for all purposes.
                <b>I have had the time to consider and consult anyone I wish on whether to provide this { currentEmployer ? "Current Employer(s)" : "Full" } Exhibit Form.  I am at least 18 years old and it is my knowing 
                and voluntary decision to sign and deliver this Exhibit Form.</b>
            </Text>
        </Box>
    );
}
