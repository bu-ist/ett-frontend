import { Button, FormControl, FormLabel, Heading, Input, Spinner, Text } from "@chakra-ui/react";
import { useState } from "react";

import SignUpCognitoButton from '../../authorized/signUpAuthInd/signUpCognitoButton';

import { registerConsenterAPI } from '../../../lib/consenting/registerConsenterAPI';
import { signUp } from '../../../lib/signUp';

export default function ConsentingRegisterForm() {
    const [formData, setFormData] = useState({
        firstname: '',
        middlename: '',
        lastname: '',
        email: ''
    });

    const [apiState, setApiState] = useState('idle');

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setApiState('loading');

        const response = await registerConsenterAPI(formData);
        console.log('register Response', response);


        if (response.payload.ok) {
            setApiState('success');
        } else {
            setApiState('error');
        }

    }

    function signUpRedirect() {
        signUp(formData.email, import.meta.env.VITE_CONSENTING_COGNITO_CLIENTID, 'consenting?action=post-signup');
    }

    return (
        <FormControl as="form" onSubmit={handleSubmit}>
            <Heading as="h3" size="lg" mt="6" mb="4">Register</Heading>
            <Text mb="6">
                Eu velit nisi esse dolor mollit. Eiusmod ex do enim sit pariatur consectetur aute voluptate do. Elit cupidatat ex irure elit voluptate anim. Ad velit pariatur elit officia tempor qui mollit ullamco cillum fugiat proident dolor nisi in. Consectetur ipsum nostrud do ullamco adipisicing pariatur.
            </Text>
            <FormLabel>First Name</FormLabel>
            <Input
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
            />
            <FormLabel>Middle Name</FormLabel>
            <Input
                name="middlename"
                value={formData.middlename}
                onChange={handleChange}
            />
            <FormLabel>Last Name</FormLabel>
            <Input
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
            />
            <FormLabel>Email</FormLabel>
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

            {apiState === 'error' &&
                <p>Error registering consenter</p>
            }

            {apiState === 'success' &&
                <SignUpCognitoButton signUpRedirect={signUpRedirect} />
            }

        </FormControl>
    );
}
