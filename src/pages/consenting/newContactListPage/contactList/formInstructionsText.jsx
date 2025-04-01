import { Box, ListItem, OrderedList, Text } from "@chakra-ui/react";

export default function FormInstructionsText({ entityName }) {

    return (
        <Box mb="6">
            <Text fontSize="xl" fontWeight="semibold" my="4">
                I direct the Ethical Transparency Tool (&ldquo;ETT&rdquo;) to do the following and consent to it doing so: 
            </Text>
            <OrderedList spacing="4" styleType="lower-alpha">
                <ListItem>
                    <b>Transmit this &ldquo;Full Exhibit Form&rdquo; and my accompanying  &ldquo;Single-Entity Exhibit Forms&rdquo; on my behalf to my private page on ETT.</b>
                </ListItem>
                <ListItem>
                    <b>Also transmit this Full Exhibit Form on my behalf to</b> {entityName}, which is the ETT-Registered Entity that requested it 
                    (&ldquo;Registered Entity&rdquo;) in connection with considering me for a Privilege or Honor, Employment or Role at this time.
                </ListItem>
                <ListItem>
                    <Text>
                        <b><u>Within the next 60 days</u>—if the Registered Entity initiates transmittals via ETT to my listed Consent Recipients/Affiliates, 
                        asking them to complete Disclosure Forms about me (“Disclosure Requests”), transmit the Disclosure Requests.</b> Each Disclosure Request 
                        will include the relevant Single-Entity Exhibit Form (so one Consent Recipient is not notified of the others), my Consent Form, and a 
                        blank Disclosure Form.  Copy the Registered Entity and me on the Disclosure Requests.  
                    </Text>
                    <Text mt="4">
                        <b><u>Within the 21 days after sending these initial Disclosure Request(s)</u>—resend the Registered Entity’s Disclosure Request(s) twice (as reminders) 
                        to my Consent Recipients (Affiliates) listed in this Exhibit Form, copying the Registered Entity and me. Then promptly delete the Disclosure Requests, 
                        my Full Exhibit Form and all related Single Entity Exhibit Forms from ETT (as ETT will have completed its transmittal role).</b>
                    </Text>
                </ListItem>
                <ListItem>
                    <b><u>I agree that my ETT Registration Form and Consent Form will remain in effect for use with these particular Disclosure Requests and 
                    completed Disclosure Forms that my Consent Recipient(s) provide in response (even if my ETT Registration and Consent otherwise 
                    expire or are rescinded)</u></b>
                </ListItem>
                <ListItem>
                    <b><u>I agree that ETT has the right to identify me as the person who provided and authorized use of the name, title, email and phone number 
                    of the contacts I’ve listed for my Affiliates.</u></b>
                </ListItem>
                <ListItem>
                    <b>If the Registered Entity does not initiate Disclosure Requests within the 60-day period provided, delete all of these Exhibit Forms from ETT.</b>
                </ListItem>
            </OrderedList>
            <Text my="6">
                I agree that this electronic Full Exhibit Form and my electronic (digital) signature, and any copy will have the same effect as originals for all purposes.
                <b>I have had the time to consider and consult anyone I wish on whether to provide this Full Exhibit Form.  I am at least 18 years old and it is my knowing 
                and voluntary decision to sign and deliver this Exhibit Form.</b>
            </Text>
        </Box>
    );
}
