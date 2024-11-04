import { useState } from 'react';
import { Link as ReactRouterLink, useNavigate } from 'react-router-dom';
import { Button, FormControl, FormLabel, Input, Spinner } from '@chakra-ui/react';
import Cookies from 'js-cookie';

import { grantConsentAPI } from '../../../lib/consenting/grantConsentAPI';

export default function GrantConsentButton({ consentData }) {
    const [apiState, setApiState] = useState('idle');

    const [digitalSignature, setDigitalSignature] = useState('');

    async function handleConsentButton() {
        setApiState('loading');
        const accessToken = Cookies.get('EttAccessJwt');

        if (accessToken) {
            const { fullName: fullname, consenter } = consentData;
            const { email, phone_number } = consenter;
            const grantRequestPayload = { digitalSignature, fullname, email, phone_number };
            
            const grantResult = await grantConsentAPI(accessToken, grantRequestPayload);

            console.log('grantResult', grantResult);
            if (grantResult.payload.ok) {
                setApiState('success');
            }
        } 
    }

    return (
        <>
            <FormControl mt="2em">
                <FormLabel>Digital Signature</FormLabel>
                <Input value={digitalSignature} onChange={(e) => setDigitalSignature(e.target.value) } type="text" />
            </FormControl>
            <Button onClick={handleConsentButton} my="2em" isDisabled={apiState !== 'idle'}>
                {apiState === 'idle' && 'Grant Consent'}
                {apiState === 'loading' && <Spinner />}
                {apiState === 'error' && 'Error'}
                {apiState === 'success' && 'Consent Granted'}
            </Button>
            <Button ml="6" as={ReactRouterLink} to="/consenting" my="2em"> {"< "} Dashboard</Button>
        </>
    );
}
