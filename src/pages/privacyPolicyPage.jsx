import { Text } from '@chakra-ui/react';

import PrivacyPolicyBox from '../components/sharedTexts/privacyPolicyBox';
import PrivacyNoticeText from '../components/sharedTexts/privacyNoticeText';

export default function PrivacyPolicyPage() {
    return (
        <>
            <PrivacyNoticeText />
            <PrivacyPolicyBox />
        </>
    );
}
