import { Alert, AlertIcon, Stack, Text } from "@chakra-ui/react";

export default function DisclosureSuccessModalBody({ affiliate }) {
    return (
        <Stack spacing={3}>
            <Alert status="success">
                <AlertIcon />
                Disclosure request sent to {affiliate}
            </Alert>
            <Text>
                In occaecat elit Lorem dolor proident deserunt adipisicing. Reprehenderit aliquip duis reprehenderit officia eu ipsum cupidatat pariatur non anim aliqua. Commodo labore proident cillum anim ipsum. Quis incididunt anim ea tempor fugiat. Cillum irure est consequat pariatur anim magna aliquip officia do adipisicing nulla Lorem voluptate exercitation. Est nulla aliquip est sint labore eiusmod occaecat.
            </Text>
        </Stack>
    );
}
