import { Button } from "@chakra-ui/react";

import EntityPrivacyPolicy from "../../entity/acknowledgeEntity/entityPrivacyPolicy";

export default function AcknowledgePrivacy({ acceptPrivacyPolicy }) {

    return (
        <>
            <EntityPrivacyPolicy accepted={false} /> 
            <Button my="6" onClick={acceptPrivacyPolicy}>
                Accept
            </Button>
        </>
    );
}
