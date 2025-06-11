import PropTypes from 'prop-types';

import { Text } from '@chakra-ui/react';

export default function CorrectAffiliates({correctableAffiliates}) {
    // If there are no correctable affiliates, return null to render nothing.
    if (!correctableAffiliates || correctableAffiliates.length === 0) {
        return null;
    }

    // Map through the correctable affiliates and render each one.
    return (
        <>
            <Text>
                There is an existing exhibit form for this entity. You can correct the affiliates below.
            </Text>
            {correctableAffiliates.map((affiliateEmail, index) => (
                <div key={index} className="affiliate-item">
                    <p>{affiliateEmail}</p>
                </div>
            ))}
        </>
    );
}

CorrectAffiliates.propTypes = {
    correctableAffiliates: PropTypes.arrayOf(
        PropTypes.string
    ).isRequired
};
