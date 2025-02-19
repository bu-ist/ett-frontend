import { useState, useRef } from 'react';
import { Heading, Text, Button, HStack, Icon } from "@chakra-ui/react";
import { HiOutlineArrowCircleDown } from "react-icons/hi";

import PrivacyNoticeText from '../../components/sharedTexts/privacyNoticeText';
import PrivacyPolicyBox from '../../components/sharedTexts/privacyPolicyBox';

import ConsentingRegisterStepper from './consentingRegisterPage/consentingRegisterStepper';
import ConsentingRegisterForm from './consentingRegisterPage/consentingRegisterForm';

export default function ConsentingRegisterPage() {
    const [privacyPolicyAccepted, setPrivacyPolicyAccepted] = useState(false);

    const [stepIndex, setStepIndex] = useState(0);

    // Create a ref so we can scroll back to the header when the privacy policy is accepted.
    const headerRef = useRef(null);

    function acceptPrivacyPolicy() {
        setPrivacyPolicyAccepted(true)
        setStepIndex(1);

        // Scroll to the header when the privacy policy is accepted.
        headerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    return (
        <>
            <Heading ref={headerRef} as="h2" size="xl" mb="2">Register as a Consenting Person</Heading>
            <ConsentingRegisterStepper currentIndex={stepIndex} />
            
            {!privacyPolicyAccepted &&
                <>
                    <HStack mt="4">
                        <Icon as={HiOutlineArrowCircleDown} color="gray.400" boxSize="12" />
                        <Text>
                            Registering on ETT means that you have read and agree to the ETT Privacy Notice and Privacy Policy.
                            <span style={{fontWeight: "500"}}> Scroll to the bottom</span> of the page to accept the Privacy Notice and Privacy Policy, and continue.
                        </Text>
                    </HStack>
                    <PrivacyNoticeText />
                    <PrivacyPolicyBox />
                    <Button
                        mt="6"
                        onClick={acceptPrivacyPolicy}
                        disabled={privacyPolicyAccepted}
                    >
                        {!privacyPolicyAccepted ? 'Accept' : 'Accepted'}
                    </Button>
                </>
            }
            {privacyPolicyAccepted &&
                <ConsentingRegisterForm setStepIndex={setStepIndex} />
            }
        </>
    );
}
