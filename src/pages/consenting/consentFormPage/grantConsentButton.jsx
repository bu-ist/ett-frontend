import { useState, useContext, useEffect, useRef } from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';
import { Box, Button, Card, CardBody, CardFooter, CardHeader, FormControl, FormLabel, Heading, Input, Spinner } from '@chakra-ui/react';
import Cookies from 'js-cookie';

import { ConfigContext } from '../../../lib/configContext';

import { grantConsentAPI } from '../../../lib/consenting/grantConsentAPI';

export default function GrantConsentButton({ consentData }) {
    // Get the appConfig from the ConfigContext.
    const { appConfig } = useContext( ConfigContext );

    const [apiState, setApiState] = useState('idle');

    const [digitalSignature, setDigitalSignature] = useState('');

    const scrollBoxRef = useRef(null);

    async function handleConsentButton() {
        setApiState('loading');
        const accessToken = Cookies.get('EttAccessJwt');

        if (accessToken) {
            const { fullName: fullname, consenter } = consentData;
            const { email, phone_number } = consenter;
            const grantRequestPayload = { digitalSignature, fullname, email, phone_number };
            
            const grantResult = await grantConsentAPI(appConfig, accessToken, grantRequestPayload);

            console.log('grantResult', grantResult);
            if (grantResult.payload.ok) {
                setApiState('success');
            }
        } 
    }

    useEffect(() => {
        if (apiState === 'success') {
            scrollBoxRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [apiState]);

    return (
        <>
            <FormControl mt="2em">
                <FormLabel>Digital Signature</FormLabel>
                <Input value={digitalSignature} isDisabled={apiState !== "idle"} onChange={(e) => setDigitalSignature(e.target.value) } type="text" />
            </FormControl>
            <Button onClick={handleConsentButton} my="2em" isDisabled={apiState !== 'idle'}>
                {apiState === 'idle' && 'Grant Consent'}
                {apiState === 'loading' && <Spinner />}
                {apiState === 'error' && 'Error'}
                {apiState === 'success' && 'Consent Granted'}
            </Button>
            {apiState === 'success' && 
                <Card>
                    <CardHeader>
                        <Heading as="h4" size={"sm"}>Consent Granted</Heading>
                    </CardHeader>
                    <CardBody>
                        You have successfully granted consent. You will receive an email confirmation shortly.
                    </CardBody>
                    <CardFooter>
                        <Button as={ReactRouterLink} to="/consenting" my="2em"> Return to Dashboard</Button>
                    </CardFooter>
                </Card>
            }
            <Box ref={scrollBoxRef}></Box> {/* Invisible element for scrolling */}
        </>
    );
}
