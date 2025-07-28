import { Text } from "@chakra-ui/react";

export default function RegisterStatementText() {
    const privacyPageURI = window.location.origin + "/privacy";

    return (
        <>
            <Text color="red.700" my="6">
                Your organization’s representatives are its above-listed Administrative Support Professional and its Authorized 
                Individuals, who are also the contacts that will respond to Disclosure Requests when another ETT Registered Entity 
                makes a Disclosure Request to your organization.
            </Text>
            <Text color="red.700" my="6">
                Registering your organization to use ETT means that it can participate in ETT. 
                It also means that in your official and personal capacities you have read and agree to the ETT Privacy Notice and Privacy Policy 
                (available at <b>{privacyPageURI}</b> ), and consent on your own and your organization’s behalf to them and to inclusion of your organization’s name, 
                with or without its representative(s) names and contact information (as reflected in the registration 
                form) on the ETT database and in ETT-related communications, factually stating that your organization is or was registered to 
                use ETT or is or was an ETT-Registered Entity. 
            </Text>
            <Text color="red.700" my="6">
                This agreement and consent includes but is not limited to putting your organization’s name, with or without its representative(s)’ names and contact 
                information, on lists of ETT-Registered Entities that are made publicly available. Your organization’s and 
                representatives’ information will be removed from lists of <i>current</i> ETT-Registered Entities upon termination of the organization’s registration. 
                If there is a change in an ETT-Registered Entity’s Authorized Representative(s), the removed representative(s) will be removed from lists of <i>current</i> ETT-Registered Entities; 
                successors will then be included. Lists of ETT-Registered Entities (with or without their representative(s) names and contact 
                information) may be used to operate, publicize, and recruit additional entities to use ETT and to support 
                ETT-Registered Entities’ ability to use ETT efficiently. Any such reference will not include an endorsement of ETT or state the specific way (within all the permitted ways) in which 
                your organization is or was using ETT, unless an Authorized Individual gives additional written consent. 
                (ETT may be abbreviated or spelled out as the Ethical Transparency Tool.)
            </Text>
            <Text color="red.700" my="6">
                <i>
                    Mere listing of your organization and its representatives as an ETT-Registered Entity is not deemed an endorsement. 
                    ETT may communicate aggregated data on the way ETT-Registered Entities use ETT and the impact of the tool.
                </i>
            </Text>
        </>
    );
}
