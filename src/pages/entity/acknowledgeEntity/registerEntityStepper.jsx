import { Box, Step, StepDescription, StepIcon, StepIndicator, StepNumber, Stepper, StepSeparator, StepStatus, StepTitle, useSteps } from "@chakra-ui/react";

const steps =[
    { title: 'Validate Invitation', description: '' },
    { title: 'Privacy Policy', description: '' },
    { title: 'Register Entity', description: '' },
    { title: 'Sign Up', description: '' },
];

export default function RegisterEntityStepper({ currentIndex }) {
    return (
        <Box my="2em" borderWidth="2px" borderRadius='lg' p='1em' boxShadow='lg'>
            <Stepper index={currentIndex}>
                {steps.map((step, index) => (
                    <Step key={index}>
                        <StepIndicator>
                            <StepStatus
                                complete={<StepIcon />}
                                incomplete={<StepNumber />}
                                active={<StepNumber />}
                            />
                        </StepIndicator>
                        <Box flexShrink='0'>
                            <StepTitle>{step.title}</StepTitle>
                            <StepDescription>{step.description}</StepDescription>
                        </Box>
                        <StepSeparator />
                    </Step>
                ))}
            </Stepper>
        </Box>
    );
}