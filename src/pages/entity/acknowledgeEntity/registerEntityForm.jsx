import { useState } from 'react';
import { Heading, FormControl, FormLabel, Input, Button, Spinner, Text, Card, CardHeader, CardBody, CardFooter } from "@chakra-ui/react";

import { registerEntityAPI } from '../../../lib/entity/registerEntityAPI';
import { signUp } from '../../../lib/signUp';

export default function RegisterEntityForm({ code, setStepIndex }) {
    // Initialize state for each form input
    const [formData, setFormData] = useState({
        entity_name: '',
        fullname: '',
        title: '',
        email: ''
    });

    const [apiState, setApiState] = useState('idle');

    // Handle form input changes
    function handleChange(e) {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    // Handle form submission
    async function handleSubmit(e) {
        e.preventDefault();
        console.log('Registering: ', formData);

        setApiState('loading');

        const registerResult = await registerEntityAPI(code, formData);
        console.log(registerResult);

        if (registerResult.payload.ok) {

            console.log('Registration successful');
            setStepIndex(3);
            setApiState('success');
        } else {
            console.error('register result was:',  registerResult);
            setApiState('error');
        }
    }

    function handleRegisterClick() {
        signUp(formData.email, import.meta.env.VITE_ENTITY_COGNITO_CLIENTID, 'entity?action=post-signup');
    }

    return (
        <>
            <Heading as="h3" size={"md"} >Register Entity</Heading>
            <Text my="6">
                Nisi ex qui dolore irure dolor ut id velit veniam consequat. Veniam aliqua sint magna culpa proident dolore qui laborum ut mollit esse ea. Dolor pariatur aliquip non dolor nulla ipsum. Aute esse mollit commodo ad minim aute ut. Ullamco exercitation aliqua deserunt incididunt anim non aliquip.
            </Text>
            <FormControl as="form" onSubmit={handleSubmit} isDisabled={apiState != 'idle'}>
                <FormLabel>Entity Name</FormLabel>
                <Input
                    name="entity_name"
                    value={formData.entity_name}
                    onChange={handleChange}
                />
                <FormLabel>Your Name</FormLabel>
                <Input
                    name="fullname"
                    value={formData.name}
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
                <Button my="1em" type="submit" isDisabled={apiState != 'idle'}>
                    { apiState == 'loading' && <Spinner /> }
                    { apiState == 'idle' && 'Register' }
                    { apiState == 'success' && 'Registered' }
                </Button>
            </FormControl>
            {apiState == 'success' &&
                <Card>
                    <CardHeader>
                        <Heading as="h4" size={"sm"}>Registration successful</Heading>
                    </CardHeader>
                    <CardBody>
                        <Text>Click Sign Up to be redirected to the account creation page.</Text>
                    </CardBody>
                    <CardFooter>
                        <Button
                            onClick={handleRegisterClick}
                        >
                            Sign Up
                        </Button>
                    </CardFooter>
                </Card>
            }
            {apiState == 'error' &&
                <Card>
                    <CardHeader>
                        <Heading as="h4" size={"sm"}>Error</Heading>
                    </CardHeader>
                    <CardBody>
                        <Text>There was an error registering the entity. Please try again.</Text>
                    </CardBody>
                </Card>
            }
        </>
    );
}
