import { Text } from '@chakra-ui/react';

import PropTypes from 'prop-types';

export default function ConsentExpirationExceptionsText({ link = false }) {

    const consenterDashboardURI = window.location.origin + '/consenting';

    return (
        <>
            <Text mb="2" fontWeight="semibold">
                How Long Is My Consent Form In Effect & How Can I Terminate It Early? 
            </Text>
            <Text mb="6">
                Your Consent Form has a 10 year life. It will expire in 10 years from the date you submit it, unless you renew it. 
                Each renewal similarly has a 10 year life. You can rescind your Consent Form early on a <u>going forward basis</u> by
                {link 
                    ? <>
                        {" "}visiting your dashboard at{" "}
                        <br />
                        <b>{consenterDashboardURI}</b>
                        <br />
                        and clicking the &ldquo;Rescind&rdquo; button.
                    </>
                    : ` clicking the 'Rescind' button above.`
                }
            </Text>
            <Text mb="2" fontWeight="semibold">
                There is one exception to the expiration or rescission of your Consent Form:
            </Text>
            <Text mb="4">
                Even when your Consent Form otherwise expires or you otherwise rescind it, your Consent Form will remain in effect
                while you are being considered for a particular Employment or Role, Privilege or Honor <u>only for the  purpose of -and for as 
                long as it takes for-</u> all requested disclosures about you to be made.  But there are two conditions to this limited continued 
                life of your Consent Form: (1) you submit your ETT Exhibit Forms on ETT (listing your professional affiliations that will be asked 
                for disclosures) and (2) the ETT-Registered Entity that is considering you timely directs ETT to issue requests for disclosures.  
            </Text>
            <Text>
                The ETT Exhibit Forms include a reminder of your agreement to this limited continued life for your Consent Form.
            </Text>
        </>
    );
}

ConsentExpirationExceptionsText.propTypes = {
    link: PropTypes.bool,
};
