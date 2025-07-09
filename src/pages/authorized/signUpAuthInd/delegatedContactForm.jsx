import { Box, FormControl, FormLabel, Input, FormHelperText, FormErrorMessage, Text } from "@chakra-ui/react";
import { emailRegex } from '../../../lib/formatting/emailRegex';

// Form to add delegated contact information
export default function DelegatedContactForm({ register, errors }) {
    return (
        <Box>
            <Text mb="4">
                These are the contacts who will respond to Disclosure Requests from another ETT-Registered Entity when your 
                organization is disclosing its findings of misconduct against a person who is being considered by the other 
                ETT-Registered Entity.   You may add an existing Authorized Individuals or Administrative Support Professional
                if these individuals will fulfill the Disclosure Response Contact role too.
            </Text>
            <FormControl mb="4" isInvalid={errors.delegate_fullname}>
                <FormLabel>Contact Full Name</FormLabel>
                <Input
                    id="delegate_fullname"
                    name="delegate_fullname"
                    placeholder="Full Name"
                    {...register('delegate_fullname', {
                        required: 'Full name is required',
                    })}
                />
                {!errors.delegate_fullname ? (
                    <FormHelperText>The name of the person who will be the delegated contact.</FormHelperText>
                ) : (
                    <FormErrorMessage>{errors.delegate_fullname && errors.delegate_fullname.message}</FormErrorMessage>
                )}
            </FormControl>
            <FormControl mb="4" isInvalid={errors.delegate_title}>
                <FormLabel>Contact Title</FormLabel>
                <Input
                    id="delegate_title"
                    name="delegate_title"
                    placeholder="Title"
                    {...register('delegate_title', {
                        required: 'Title is required',
                    })}
                />
                {!errors.delegate_title ? (
                    <FormHelperText>The title of the person who will be the delegated contact.</FormHelperText>
                ) : (
                    <FormErrorMessage>{errors.delegate_title && errors.delegate_title.message}</FormErrorMessage>
                )}
            </FormControl>
            <FormControl mb="4" isInvalid={errors.delegate_email}>
                <FormLabel>Contact Email</FormLabel>
                <Input
                    id="delegate_email"
                    name="delegate_email"
                    type="email"
                    placeholder="Email"
                    {...register('delegate_email', {
                        required: 'Email is required',
                        pattern: {
                            value: emailRegex,
                            message: 'Invalid email address',
                        },
                    })}
                />
                {!errors.delegate_email ? (
                    <FormHelperText>The email address of the person who will be the delegated contact.</FormHelperText>
                ) : (
                    <FormErrorMessage>{errors.delegate_email && errors.delegate_email.message}</FormErrorMessage>
                )}
            </FormControl>
            <FormControl mb="4" isInvalid={errors.delegate_phone}>
                <FormLabel>Contact Phone</FormLabel>
                <Input
                    id="delegate_phone"
                    name="delegate_phone"
                    type="tel"
                    placeholder="Phone Number (e.g., +1 (555) 123-4567)"
                    {...register('delegate_phone', {
                        required: 'Phone is required',
                        pattern: {
                            value: /^\+?\s*1?\s*(?:\([0-9]{3}\)|[0-9]{3})[-.\s]*[0-9]{3}[-.\s]*[0-9]{4}$/,
                            message: 'Please enter a valid phone number. Allowed formats: +1 (555) 123-4567, 555-123-4567, 555.123.4567'
                        }
                    })}
                />
                {!errors.delegate_phone ? (
                    <FormHelperText>Enter a phone number with optional country code, area code, and separators (e.g., +1 (555) 123-4567)</FormHelperText>
                ) : (
                    <FormErrorMessage>{errors.delegate_phone && errors.delegate_phone.message}</FormErrorMessage>
                )}
            </FormControl>
        </Box>
    );
}