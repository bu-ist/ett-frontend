import { Alert, AlertIcon, Stack, Text } from "@chakra-ui/react";

export default function ExhibitSuccessModalBody( { selectedConsenter } ) {
    return (
        <Stack spacing={3}>
            <Alert status="success">
                <AlertIcon />
                Request sent to {selectedConsenter}
            </Alert>
            <Text>
                Your request has been sent to the selected Consenting Person. They will receive an email 
                with a link to the corresponding exhibit form, and custom instructions for completing the form.
                You will receive an email when the consenter has completed the form. ETT does not 
                track the request further than this.
            </Text>
        </Stack>
    );
}