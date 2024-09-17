import { Icon } from '@chakra-ui/react';
import { HiCheckCircle } from 'react-icons/hi';

export default function ConsentDetails({consentData}) {

    const { consenter, fullName, activeConsent, entities } = consentData;

    return (
        <div>
            <p>Consent Details</p>
            <p>{fullName}</p>
            <p><Icon as={HiCheckCircle} color="green.500" /> Consent granted on {consenter.consented_timestamp}</p>
            <div>{JSON.stringify(consentData) }</div>
        </div>
    );
}
