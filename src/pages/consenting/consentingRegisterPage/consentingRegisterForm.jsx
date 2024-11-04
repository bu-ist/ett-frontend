import { Button, FormControl, FormLabel, Heading, Input, Spinner } from "@chakra-ui/react";
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
        signUp(formData.email, import.meta.env.VITE_CONSENTING_COGNITO_CLIENTID, 'consenting')
    }

    return (
        <FormControl as="form" onSubmit={handleSubmit}>
            <Heading as="h3" size="lg" my="6">Register</Heading>
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
