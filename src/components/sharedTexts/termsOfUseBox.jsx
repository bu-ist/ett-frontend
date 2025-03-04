import { Box, Heading, Text, Divider } from '@chakra-ui/react';

import { EmploymentRolesDefinition, PrivilegesDefinition } from "../sharedTexts/definitions/definitions";
import DefinitionPopover from "../sharedTexts/definitions/definitonPopover";

export default function TermsOfUseBox() {

    const termsPageURI = window.location.origin + "/terms";

    return (
        <Box
            as="section"
            my="6"
            p="6"
            borderWidth="0.3em"
            borderRadius="1em"
            borderColor="gray.400"
            bg="gray.50"
        >
            <Heading as="h3" size="lg" mb="2">Terms of Use</Heading>
            <Text>
                <i>Important Terms of Use for entities registering to use ETT</i> - always available at this location: {termsPageURI}
            </Text>
            <Divider my="4" />
            <Text>
                <Text as="b" color="red.800"> EACH ETT-REGISTERED ENTITY MUST MAKE INDEPENDENT DECISIONS AND POLICIES.</Text> ETT is just an automation tool that any ETT-Registered Entity may use, 
                in its discretion, to get individuals’ consents to disclosures of findings of misconduct about them and to make disclosures requests 
                to the entities that may have made or adopted findings.  ETT does not receive any disclosures or conduct records.  It is not a policy 
                and does not dictate or guide decisions or policies, including, e.g., for which Privileges or Honors, Employment or Roles  ETT is used, 
                how to weigh findings, or who is qualified or should be selected.
            </Text>
            <Divider my="4" />
            <Text>
                Authorized Individuals (AIs) should be in senior institutional roles, accustomed to managing sensitive
                and confidential information, and knowledgeable about the ETT-Registered Entity. Administrative Support Professionals
                (ASPs) should also be accustomed to managing sensitive and confidential information. An ETT-Registered Entity
                determines these roles/people.
            </Text>
            <Divider my="4" />
            <Text>
                Either ETT-Registered Entity&rsquo;s AI may update who is an AI or ASP. However, ETT will send a copy of the
                change to the other AI and ASP (at least one) serving at the time for security of the information. ETT will also copy the
                removed AI or ASP.
            </Text>
            <Divider my="4" />
            <Text>
                The ASP may initiate Disclosure Requests in ETT only when directed by an AI. ASPs will be blind copied
                on Disclosure Requests to aid AIs in tracking. <b>Only</b> AIs are visibly copied on Disclosure Requests and should be the <b>direct
                recipients</b> of completed Disclosure Forms from other entities. AIs will decide who within the ETT-Registered Entity needs
                the disclosed information (or will confer with the person who has that authority). <b>Each ETT-Registered Entity creates its
                internal processes to satisfy all terms of use</b>.
            </Text>
            <Divider my="4" />
            <Text>
                Completed Consent Forms, Exhibit Forms, and Disclosure Forms must be used by an ETT-Registered Entity <b>only</b> in connection with 
                {' '}
                <DefinitionPopover termName="Privilege(s) or Honor(s)">
                    <PrivilegesDefinition />
                </DefinitionPopover>
                , 
                {' '}
                <DefinitionPopover termName="Employment or Role(s)">
                    <EmploymentRolesDefinition />
                </DefinitionPopover>
                .
            </Text>
            <Divider my="4" />
            <Text>
                ETT-Registered Entities must not share <b>completed</b> Registration, Consent, Exhibit, or Disclosure Forms that
                they <b>receive or access</b> with other entities (third parties). ETT-Registered Entities may access Consent Forms on ETT, while
                a Consent is in effect.
            </Text>
            <Divider my="4" />
            <Text color="red.900">
                <b>No warranties of any kind are made concerning ETT</b>. Each ETT-Registered Entity determines the uses of
                ETT that are operationally and legally appropriate for it and waives and releases all claims and liabilities of every kind
                (except intentional harm) that are associated with ETT, against the Societies Consortium to End Harassment in STEMM,
                EducationCounsel LLC, the American Association for the Advancement of Science (AAAS), and each owner, designer,
                developer, host, sponsor, advisor, agent, contractor, administrator and/or operator of ETT, their respective predecessors,
                successors, and assigns (and their respective current, former, and future directors/trustees/managers, officers,
                members/stockholders/partners, personnel, agents, contractors, and representatives). <b>ETT&rsquo;s owner (AAAS) or its
                designee, or an ETT-Registered Entity, may terminate the ETT-Registered Entity&rsquo;s participation in ETT, with or
                without cause, upon written notice by the terminating party to the other party.</b>
            </Text>
        </Box>
    );
}
