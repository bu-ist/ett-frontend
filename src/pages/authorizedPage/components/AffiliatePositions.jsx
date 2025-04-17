import { Box, FormControl, FormErrorMessage, Heading, Input, Select, Text } from "@chakra-ui/react";

export default function AffiliatePositions({ register, errors, watch, setValue }) {
    const employerPosition = watch('employerPosition');
    const academicPosition = watch('academicPosition');
    const otherOrgPosition = watch('otherOrgPosition');

    return (
        <>
            <Heading as="h3" mt="8" mb="4" size="sm">Specify Positions of Affiliates</Heading>
            <Text mb="2" fontSize="sm" fontStyle="italic">What position(s) should be included in the search?</Text>
            
            {/* Employer Positions */}
            <Box mb="6">
                <Text fontWeight="medium" mb="2">Employer Organizations</Text>
                <FormControl isInvalid={errors.employerPosition}>
                    <Select 
                        placeholder="Select position"
                        {...register('employerPosition', { 
                            required: 'Please select a position',
                            onChange: (e) => {
                                if (e.target.value !== 'other') {
                                    setValue('employerOtherPosition', '');
                                }
                            }
                        })}
                    >
                        <option value="ex">Executive/Officer</option>
                        <option value="bm">Board Member</option>
                        <option value="em">Employee</option>
                        <option value="other">Other</option>
                    </Select>
                    <FormErrorMessage>{errors.employerPosition?.message}</FormErrorMessage>
                </FormControl>

                {employerPosition === 'other' && (
                    <FormControl mt="3" isInvalid={errors.employerOtherPosition}>
                        <Input
                            placeholder="Please specify the position"
                            {...register('employerOtherPosition', {
                                required: 'Please specify the position',
                                validate: (value) => {
                                    if (employerPosition === 'other' && !value) {
                                        return 'Please specify the position';
                                    }
                                    return true;
                                }
                            })}
                        />
                        <FormErrorMessage>{errors.employerOtherPosition?.message}</FormErrorMessage>
                    </FormControl>
                )}
            </Box>

            {/* Academic Positions */}
            <Box mb="6">
                <Text fontWeight="medium" mb="2">Academic Organizations</Text>
                <FormControl isInvalid={errors.academicPosition}>
                    <Select 
                        placeholder="Select position"
                        {...register('academicPosition', { 
                            required: 'Please select a position',
                            onChange: (e) => {
                                if (e.target.value !== 'other') {
                                    setValue('academicOtherPosition', '');
                                }
                            }
                        })}
                    >
                        <option value="pr">Professor/Researcher</option>
                        <option value="ad">Administrator</option>
                        <option value="st">Staff</option>
                        <option value="other">Other</option>
                    </Select>
                    <FormErrorMessage>{errors.academicPosition?.message}</FormErrorMessage>
                </FormControl>

                {academicPosition === 'other' && (
                    <FormControl mt="3" isInvalid={errors.academicOtherPosition}>
                        <Input
                            placeholder="Please specify the position"
                            {...register('academicOtherPosition', {
                                required: 'Please specify the position',
                                validate: (value) => {
                                    if (academicPosition === 'other' && !value) {
                                        return 'Please specify the position';
                                    }
                                    return true;
                                }
                            })}
                        />
                        <FormErrorMessage>{errors.academicOtherPosition?.message}</FormErrorMessage>
                    </FormControl>
                )}
            </Box>

            {/* Other Organization Positions */}
            <Box mb="6">
                <Text fontWeight="medium" mb="2">Other Organizations</Text>
                <FormControl isInvalid={errors.otherOrgPosition}>
                    <Select 
                        placeholder="Select position"
                        {...register('otherOrgPosition', { 
                            required: 'Please select a position',
                            onChange: (e) => {
                                if (e.target.value !== 'other') {
                                    setValue('otherOrgOtherPosition', '');
                                }
                            }
                        })}
                    >
                        <option value="di">Director</option>
                        <option value="tr">Trustee</option>
                        <option value="vo">Volunteer</option>
                        <option value="other">Other</option>
                    </Select>
                    <FormErrorMessage>{errors.otherOrgPosition?.message}</FormErrorMessage>
                </FormControl>

                {otherOrgPosition === 'other' && (
                    <FormControl mt="3" isInvalid={errors.otherOrgOtherPosition}>
                        <Input
                            placeholder="Please specify the position"
                            {...register('otherOrgOtherPosition', {
                                required: 'Please specify the position',
                                validate: (value) => {
                                    if (otherOrgPosition === 'other' && !value) {
                                        return 'Please specify the position';
                                    }
                                    return true;
                                }
                            })}
                        />
                        <FormErrorMessage>{errors.otherOrgOtherPosition?.message}</FormErrorMessage>
                    </FormControl>
                )}
            </Box>
        </>
    );
} 