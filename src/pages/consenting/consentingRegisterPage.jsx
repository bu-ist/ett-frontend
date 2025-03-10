import { useState, useRef } from 'react';
import { Heading, Text, Button, HStack, Icon, Box } from "@chakra-ui/react";
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
                        <Icon as={HiOutlineArrowCircleDown} color="blue.600" boxSize="36" />
                        <Box>
                            <Text>
                                Registering on ETT means that you have read and agree to the ETT Privacy Notice and Privacy Policy.
                            </Text>
                            <Text fontSize="2xl" fontWeight="black" color="blue.800">
                                Scroll to the bottom of the page to accept the Privacy Notice and Privacy Policy, and continue.
                            </Text>
                        </Box>
                    </HStack>
                    <PrivacyNoticeText />
                    <PrivacyPolicyBox />
                    <Button
                        mt="12"
                        size="lg"
                        colorScheme="blue"
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
