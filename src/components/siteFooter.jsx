import { Link as RouterLink } from 'react-router-dom';
import { Box, Flex, Link, Spacer, Text } from "@chakra-ui/react";

export default function SiteFooter() {
    return (
        <Box as="footer" my={12} p="5" backgroundColor="gray.50" borderRadius="md" >
            <Flex minWidth='max-content' alignItems='center' gap='2'>
                <Box p='2'>
                    <Text fontSize="sm" color="gray.500">
                        Ethical Transparency Tool is brought to you by the
                        <br /><Link href="https://societiesconsortium.com/" isExternal>Societies Consortium to End Harassment in STEMM</Link>
                    </Text>
                </Box>
                <Spacer />
                <Box p='2'>
                    <Text fontSize="xl" color="gray.700">
                        <Link as={RouterLink} to="/privacy">Privacy Policy</Link> {" "} | {" "}
                        <Link as={RouterLink} to="/terms">Terms of Use</Link> {" "} | {" "}
                        <Link as={RouterLink} to="/about">About</Link>
                    </Text>
                </Box>
            </Flex>
        </Box>
    );
}
