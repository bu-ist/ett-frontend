import { useState } from 'react';
import { Button, Card, CardBody, CardFooter, CardHeader, Heading, Link, Text, Spinner } from "@chakra-ui/react";

export default function AcknowledgePrivacy({ acknowledgeEntity }) {
    const [apiState, setApiState] = useState('idle');

    async function handleAcceptClick() {
        setApiState('loading');
        await acknowledgeEntity();
        setApiState('success');
    }

    return (
        <Card mb="1em">
            <CardHeader>
                <Heading as="h4" size="sm">Privacy Policy</Heading>
            </CardHeader>
            <CardBody>
                <Text>
                    By clicking the &quot;Accept&quot; button, you agree to the Privacy Policy of the entity.
                </Text>
                <Text>
                    You can view the Privacy Policy <Link href="/privacy-policy">here</Link>.
                </Text>
            </CardBody>
            <CardFooter>
                <Button
                    onClick={handleAcceptClick}
                >
                    {apiState === 'loading' && <Spinner />}
                    {apiState !== 'loading' && 'Accept'}
                </Button>
            </CardFooter>
        </Card>
    );
}
