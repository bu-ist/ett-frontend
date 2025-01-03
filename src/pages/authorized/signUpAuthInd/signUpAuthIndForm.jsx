import { useState } from 'react';
import { Button, Card, CardBody, CardHeader, FormControl, FormLabel, Heading, Input, Spinner, Text } from "@chakra-ui/react";

import SignUpCognitoButton from './signUpCognitoButton';

import { registerEntityAPI } from '../../../lib/entity/registerEntityAPI';
import { signUp } from '../../../lib/signUp';

export default function SignUpAuthIndForm({entityInfo, setStepIndex, code}) {
    const  { entity, invitation, users }  = entityInfo;

    const [apiState, setApiState] = useState('idle');

    // Initialize state for each form input
    const [formData, setFormData] = useState({
        fullname: '',
        title: '',
        email: ''
    });

    // Find the user with a role property of 'RE_ADMIN', which is the administator of the entity.
    // Diabled because the endpoint was removed.
    //const entityAdmin = users.find(user => user.role === 'RE_ADMIN');

    // Handle form input changes
    function handleChange(e) {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    // Handle form submission
    async function handleSubmit(e) {
        e.preventDefault();

        setApiState('loading');

        const registerResult = await registerEntityAPI(code, formData);
        console.log(registerResult);

         if (registerResult.payload.ok) {

            console.log('Registration successful');
            setStepIndex(3);
            setApiState('success');
        }
    }

    function signUpRedirect() {
        signUp(formData.email, import.meta.env.VITE_AUTHORIZED_COGNITO_CLIENTID, 'auth-ind?action=post-signup')
    }

    return (
        <>
            <Heading as="h3" mb="1" size="md">Register For an Account</Heading>
            {/* Display the entity name and the entity administrator, disabled for now */}
            {
            /*
            <Card mb="1em" variant="filled">
                <CardHeader>
                    <Heading as="h4" size="sm">Invitation from {entity.entity_name}</Heading>
                </CardHeader>
                <CardBody>
                    <Heading as="h5" size="xs">Entity Administrator</Heading>
                    <Text>{entityAdmin.fullname}</Text>
                    <Text>{entityAdmin.title}</Text>
                    <Text>{entityAdmin.email}</Text>
                    <Text>{entityAdmin.phone_number}</Text>
                </CardBody>
            </Card>
            */
            }
            <Text mb="8">
                Nisi voluptate irure culpa dolor laborum enim consectetur eu incididunt. Id culpa esse ad Lorem dolor cupidatat incididunt ipsum ipsum velit. Incididunt non velit et minim eiusmod occaecat ex consectetur voluptate cillum.
            </Text>
            <FormControl as="form" onSubmit={handleSubmit}>
                <FormLabel>Your Full Name</FormLabel>
                <Input
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                />
                <FormLabel>Your Title</FormLabel>
                <Input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                />
                <FormLabel>Your Email</FormLabel>
                <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                />
                <Button my="1em" type="submit" isDisabled={apiState !== 'idle'}>
                    { apiState === 'loading' && <Spinner /> }
                    { apiState === 'idle' && 'Register' }
                    { apiState === 'success' && 'Registered' }
                </Button>
            </FormControl>
            {apiState === 'success' &&
                <SignUpCognitoButton signUpRedirect={signUpRedirect} />
            }
        </>
    );
}
