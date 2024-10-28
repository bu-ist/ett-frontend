import { Box, Flex, Link, Spacer, Text } from "@chakra-ui/react";

export default function SiteFooter() {
    return (
        <Box as="footer" my={12} p="5" backgroundColor="gray.50" borderRadius="md" >
            <Flex minWidth='max-content' alignItems='center' gap='2'>
                <Box p='2'>
                    <Text fontSize="sm" color="gray.500">
                        Ethical Transparency Tool is brought to you by <Link href="https://societiesconsortium.com/" isExternal>Societies Consortium</Link>.
                    </Text>
                </Box>
                <Spacer />
                <Box p='2'>
                    <Text fontSize="sm" color="gray.500">
                        <Link href="/">Privacy Policy</Link>
                    </Text>
                </Box>
            </Flex>
        </Box>
    );
}
