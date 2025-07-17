import { Heading, Text } from "@chakra-ui/react";
import PropTypes from 'prop-types';

export function EttDefinition() {
    return (
        <>
            <Heading as="h3" size="sm">Ethical Transparency Tool (or ETT)</Heading> 
            <Text mb="6">
                means a tool that enables each Consent Recipient to provide a completed Disclosure Form (or its information) about a person who has 
                signed and delivered a “Consent Form” (this form) to ETT.   Each ETT-Registered Entity (RE) retains its independence in policymaking and 
                decision-making (e.g., on when to use the ETT, how to respond to disclosures, who’s qualified or selected).  Before completing a Consent 
                Form, an individual completes an ETT “Registration Form” at this link to receive their ETT account. Individuals do so proactively—or when 
                it is a condition to being considered for Privilege(s) or Honor(s), Employment or Role(s) by any ETT-Registered Entit(ies).
            </Text>
        </>
    );
}

export function PrinciplesDefinition() {
    return (
        <>
            <Heading as="h3" size="sm">Principles</Heading> 
            <Text mb="6">
                mean the statements in “Part A. FUNDAMENTAL PRINCIPLES” of the Consent Form.
            </Text>
        </>
    );
}

export function PrivilegesDefinition() {
    return (
        <>
            <Heading as="h3" size="sm">Privilege(s) or Honor(s)</Heading>
            <Text mb="6">
                Examples include but are not limited to: elected fellow, elected or life membership; recipient of an honor, award, or an emeritus or endowed role; elected or appointed governance, committee, officer, or leadership role. However, Privilege(s) or Honor(s) <b>do not</b> include basic membership in an academic, professional, or honorary society at an individual’s initiative (i.e., when not elected or awarded).  Other Privilege(s) or Honor(s) that an ETT-Registered Entity identifies as affecting climate, culture or enterprise risk may be included (e.g., volunteer roles).  
            </Text>
        </>
    );
}

export function EmploymentRolesDefinition() {
    return (
        <>
            <Heading as="h3" size="sm">Employment or Role(s)</Heading>
            <Text mb="6">
                Examples include but are not limited to: employment; employee appointment or assignment to a supervisory, evaluative, 
                committee, or mentoring role. May include other employment roles and decisions that an ETT-Registered Entity identifies 
                as affecting climate, culture, or enterprise risk.
            </Text>
        </>
    );
}

export function ConsentRecipientDefinition() {
    return (
        <>
            <Heading as="h3" size="sm">Consent Recipient(s)</Heading>
            <Text mb="6">
                (also called Affiliate(s)) mean the entities referenced in Part B. 1, 2, 3, 4 of the Consent Form.  A Consent Recipient (Affiliate) is the <b>“Disclosing Entity”</b> that completes a Disclosure Form when requested.  For up-to-date information, the person who submits a Consent Form also provides a list of the names of their Consent Recipients (Affiliates), with contacts, using <b>“Exhibit Forms”</b> at this link each time any ETT-Registered Entity is considering the person for a Privilege or Honor, Employment or Role and is anticipating using ETT to make a Disclosure Request about a person who has completed a Consent Form. 
            </Text>
        </>
    );
}

export function DisclosureFormDefinition({ disclosureFormUrl }) {
    return (
        <>
            <Heading as="h3" size="sm">The Disclosure Form</Heading>
            <Text mb="6">
                The Disclosure Form is the form at <a style={{ textDecoration: 'underline' }} target="_blank" rel="noopener noreferrer" href={disclosureFormUrl}>this link</a>. <b>Finding of Responsibility</b> is a finding of any one or more of the generic types of 
                misconduct listed or referenced on the Disclosure Form; it is defined by the Consent Recipient (Affiliate) that made 
                or adopted the finding under its own policy (see the Disclosure Form for details).  A Disclosure Form is completed when 
                a Consent Recipient checks the Finding(s) of Responsibility that it has made or adopted against a person (with the year(s)) 
                or checks &ldquo;No Finding of Responsibility&rdquo; or &ldquo;Will Not Be Responding&rdquo;—and gives the completed Disclosure Form or its 
                information to a Registered Entity that requested it.  
            </Text>
        </>
    );
}

DisclosureFormDefinition.propTypes = {
    disclosureFormUrl: PropTypes.string.isRequired
};

export function RegisteredEntityDefinition() {
    return (
        <>
            <Heading as="h3" size="sm">ETT-Registered Entit(ies) or “RE”</Heading>
            <Text mb="6">
                mean the entities and organizations now or in the future registered to use the Ethical Transparency Tool by completing an “ETT Registration Form”. See this link for a list that will be updated over time. RE(s) are the only entities that may use ETT to make a Disclosure Request to Consent Recipients (Affiliates).  ETT sends a separate Disclosure Request on behalf of a RE to each Affiliate of a person, including the person’s Consent Form, a Single Entity Exhibit Form naming that Affiliate as a Consent Recipient, a blank Disclosure Form and instructions to respond directly to the RE. 
            </Text>
        </>
    );
}

export function SponsorsDefinition() {
    return (
        <>
            <Heading as="h3" size="sm">ETT Sponsors</Heading>
            <Text mb="6">
                mean the owner(s), designer(s), developer(s), host(s), administrator(s), operator(s), governing bod(ies), sponsor(s), funder(s), and/or advisor(s) for the Ethical Transparency Tool.     
            </Text>
        </>
    );
}
