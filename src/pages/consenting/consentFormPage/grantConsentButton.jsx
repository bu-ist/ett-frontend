import { useState, useContext, useEffect, useRef } from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Box, Button, Card, CardBody, CardFooter, CardHeader, FormControl, FormErrorMessage, FormHelperText, FormLabel, Heading, Input, Spinner, Text } from '@chakra-ui/react';
import Cookies from 'js-cookie';

import { ConfigContext } from '../../../lib/configContext';

import { grantConsentAPI } from '../../../lib/consenting/grantConsentAPI';

export default function GrantConsentButton({ consentData }) {
    // Get the appConfig from the ConfigContext.
    const { appConfig } = useContext( ConfigContext );

    const [apiState, setApiState] = useState('idle');

    // Setup the digital signature form.
    const { handleSubmit, register, formState: { errors } } = useForm({
        defaultValues: {
            signature: '',
        }
    });

    const scrollBoxRef = useRef(null);

    async function handleConsentButton(values) {
        const { signature } = values;

        setApiState('loading');
        const accessToken = Cookies.get('EttAccessJwt');

        if (accessToken) {
            const { fullName: fullname, consenter } = consentData;
            const { email, phone_number } = consenter;
            const grantRequestPayload = { 
                consent_signature: signature,  // Rename signature field for backend API
                fullname, 
                email, 
                phone_number 
            };
            
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
            <form onSubmit={handleSubmit(handleConsentButton)}>
                <FormControl mt="2em">
                    <FormLabel>Digital Signature</FormLabel>
                    <Input
                        id="signature"
                        name="signature"
                        placeholder="Signature"
                        isDisabled={apiState !== "idle"}
                        {...register('signature', {
                            required: 'Signature is required',
                        })}
                        type="text"
                    />
                    {!errors.signature ? (
                        <FormHelperText>Type your name here as your digital signature.</FormHelperText>
                    ) : (
                        <FormErrorMessage>{errors.signature.message}</FormErrorMessage>
                    )}
                    {/* This extra error message shouldn't be necessary, but for some reason the one above is not rendering */}
                    {errors.signature && <Text color="red.500" mt="2">{errors.signature.message}</Text>}
                </FormControl>
                <Button type="submit" my="2em" isDisabled={apiState !== 'idle'}>
                    {apiState === 'idle' && 'Grant Consent'}
                    {apiState === 'loading' && <Spinner />}
                    {apiState === 'error' && 'Error'}
                    {apiState === 'success' && 'Consent Granted'}
                </Button>
            </form>
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
