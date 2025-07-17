import { Box, Heading, UnorderedList, ListItem } from "@chakra-ui/react";
import { useContext } from "react";
import { ConfigContext } from "../../../lib/configContext";

// Mapping for friendlier form labels
const formLabelMap = {
    "registration-form-entity": "Entity Registration Form",
    "registration-form-individual": "Individual Registration Form",
    "consent-form": "Individual Consent Form",
    "exhibit-form-current-full": "Exhibit Form (Current Employer(s) and Appointing Entit(ies) - Full)",
    "exhibit-form-current-single": "Exhibit Form (Current Employer(s) and Appointing Entit(ies), Single Entity for Each Affiliate)",
    "exhibit-form-other-full": "Exhibit Form (All Affiliates Other Than Current Employer(s) and Appointing Entit(ies) — Full)",
    "exhibit-form-other-single": "Exhibit Form (All Affiliates Other Than Current Employer(s) and Appointing Entit(ies), Single Entity for Each Affiliate)",
    "exhibit-form-both-full": "Exhibit Form (All Affiliates - Full)",
    "exhibit-form-both-single": "Exhibit Form (All Affiliates - Single Entity for Each Affiliate)",
    "disclosure-form": "Disclosure Form"
};

export default function DownloadBlankForms() {
    const { appConfig } = useContext(ConfigContext);

    // Only render if publicBlankFormURIs is available in the appConfig context.
    if (!appConfig?.publicBlankFormURIs) {
        return null;
    }

    return (
        <Box my="8">
            <Heading size="md" mb="2">Download Blank Example Forms</Heading>
            <UnorderedList>
                {appConfig.publicBlankFormURIs.reduce((items, uri) => {
                    const key = uri.split('/').pop();
                    const label = formLabelMap[key] || key.replace(/-/g, ' ').replace('.pdf', '');
                    
                    // If this is a "single" variant, skip it as we'll handle it with its parent
                    if (key.includes('-single')) {
                        return items;
                    }

                    // Only look for single variants for exhibit forms with -full suffix
                    const singleVariantUri = key.includes('exhibit-form-') && key.includes('-full')
                        ? appConfig.publicBlankFormURIs.find(u => 
                            u.split('/').pop() === key.replace('-full', '-single')
                          )
                        : null;

                    items.push(
                        <ListItem key={uri}>
                            <a href={uri} target="_blank" rel="noopener noreferrer">
                                {label}
                            </a>
                            {singleVariantUri && (
                                <UnorderedList ml={4} mt={1}>
                                    <ListItem key={singleVariantUri}>
                                        <a href={singleVariantUri} target="_blank" rel="noopener noreferrer">
                                            {formLabelMap[singleVariantUri.split('/').pop()]}
                                        </a>
                                    </ListItem>
                                </UnorderedList>
                            )}
                        </ListItem>
                    );
                    return items; // Return the accumulated items array
                }, [])}
            </UnorderedList>
        </Box>
    );
}
