import { Text, Link } from "@chakra-ui/react";
import { Link as ReactRouterLink } from 'react-router-dom';

export function OtherFormPrefaceText() {
    return (
        <Text mb="6">
            This Full Exhibit Form is incorporated into my Consent Form, 
            available from <Link as={ReactRouterLink} to="/consenting" textDecoration="underline">my dashboard.</Link> This Exhibit Form 
            provides an up-to-date list of the names and contacts for my known 
            Consent Recipients (also called Affiliates) on the date of this 
            Exhibit Form—but NOT my current employers and appointing organizations.  
            The definitions in the Consent Form also apply to this Exhibit Form. 
            My known Consent Recipient(s) of the types covered by this form are: 
        </Text>
    );
}

export function CurrentFormPrefaceText() {
    return (
        <Text mb="6">
            This Current Employer(s) Exhibit Form is incorporated into my Consent Form
            available from <Link as={ReactRouterLink} to="/consenting" textDecoration="underline">my dashboard.</Link> This Exhibit Form
            provides an up-to-date list of the name(s) and contact(s) for my known 
            Current Employers and other Organizations where I hold appointments on 
            the date of this Exhibit.  They are among my Consent Recipients (also called Affiliates). 
            The definitions in the Consent Form also apply to this Exhibit Form.   
            My known Consent Recipients that are my <b>Current</b> Employer(s) and Appointing Organization(s) are: 
        </Text>
    );
}

export function BothFormPrefaceText() {
    return (
        <Text mb="6">
            This Full Exhibit Form is incorporated into my Consent Form
            available from <Link as={ReactRouterLink} to="/consenting" textDecoration="underline">my dashboard.</Link> This Exhibit Form
            provides an up-to-date list of the name(s) and contact(s) for my known 
            Consent Recipients (also called Affiliates) on the date of this Exhibit Form.  
            The definitions in the Consent Form also apply to this Exhibit Form. My known Consent Recipient(s) are: 
        </Text>
    );
}