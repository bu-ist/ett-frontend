import { useState } from 'react';
import { Button, Card, CardBody, CardHeader, FormControl, FormLabel, Heading, Input, Spinner, Text } from "@chakra-ui/react";

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
    const entityAdmin = users.find(user => user.role === 'RE_ADMIN');

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

    function handleRegisterClick() {
        signUp(formData.email, import.meta.env.VITE_AUTHORIZED_COGNITO_CLIENTID, 'auth-ind')
    }

    return (
        <>
            <Heading as="h3" mb="1em" size="md">Sign Up For Account</Heading>
            <Card mb="1em" variant="filled">
                <CardHeader>
                    <Heading as="h4" size="sm">{entity.entity_name}</Heading>
                </CardHeader>
                <CardBody>
                    <Heading as="h5" size="xs">Entity Administrator</Heading>
                    <Text>{entityAdmin.fullname}</Text>
                    <Text>{entityAdmin.title}</Text>
                    <Text>{entityAdmin.email}</Text>
                    <Text>{entityAdmin.phone_number}</Text>
                </CardBody>
            </Card>
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
                <Button my="1em" type="submit">
                    { apiState === 'loading' && <Spinner /> }
                    { apiState !== 'loading' && 'Sign Up' }
                </Button>
            </FormControl>
            {apiState === 'success' &&
                <>
                    <Heading as="h4" size={"sm"} >Registration successful</Heading>
                    <Text>Click Sign Up to create a password and complete registration.</Text>
                    <Button
                        onClick={handleRegisterClick}
                    >
                        Sign Up
                    </Button>
                </>
            }
        </>
    );
}
