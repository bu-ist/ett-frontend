import { useState } from 'react';
import { Heading, Text, Box, Checkbox, Button, Divider } from "@chakra-ui/react";

import ConsentingRegisterForm from './consentingRegisterPage/consentingRegisterForm';

export default function ConsentingRegisterPage() {
    const [apiState, setApiState ] = useState('idle');
    const [privacyPolicyAccepted, setPrivacyPolicyAccepted] = useState(false);

    return (
        <>
            <Heading as="h2" size="xl" mb="2">Sign Up as a Consenting Person</Heading>
            <Text>
                Lorem ipsum minim anim id do nisi aliqua. Consequat cillum sint qui ad aliqua proident nostrud. Cillum ullamco consectetur mollit eu labore amet ullamco mollit dolor veniam adipisicing veniam nulla ex. Quis irure minim id commodo dolore anim nulla aliqua reprehenderit pariatur. Id aute mollit pariatur tempor ex aute id voluptate enim. Et excepteur dolore non non ad deserunt duis voluptate aliqua officia qui ut elit.
            </Text>
            <Box
                as="section"
                mt="6"
                p="6"
                borderWidth="0.3em"
                borderRadius="1em"
                borderColor="gray.400"
                bg="gray.50"
                color={ apiState === 'accepted' ? "gray.400" : "black"}
            >
                <Heading as="h3" size="lg" mb="6">Privacy Policy</Heading>
                <Text>
                    Nisi ex qui dolore irure dolor ut id velit veniam consequat. Veniam aliqua sint magna culpa proident dolore qui laborum ut mollit esse ea. Dolor pariatur aliquip non dolor nulla ipsum. Aute esse mollit commodo ad minim aute ut. Ullamco exercitation aliqua deserunt incididunt anim non aliquip.

Sit incididunt exercitation reprehenderit ea eiusmod veniam sint voluptate. Cillum excepteur eiusmod qui sunt qui ut et sunt sunt fugiat deserunt sit nisi. Dolore laboris ex sit labore. Cupidatat culpa irure ea et tempor. Nostrud consectetur esse est est. Ut veniam incididunt ut velit voluptate officia et. Fugiat excepteur laborum sunt incididunt ullamco.

Nisi irure anim tempor qui eiusmod cupidatat anim proident. Quis qui cillum amet eu. Aute est elit ex id eu ea in nisi minim do labore adipisicing culpa. Irure sint elit cillum culpa do sit. Enim culpa consequat cupidatat do nostrud duis est Lorem et et qui.

Consequat irure laboris labore culpa labore amet quis exercitation esse labore officia consectetur quis mollit. Adipisicing laborum est sit nostrud consequat. Voluptate ad adipisicing cupidatat minim laboris sint. Et cillum duis ad voluptate ullamco pariatur laborum proident.
                </Text>
                <Divider my="4" />
                <Text>
                    Nisi ex qui dolore irure dolor ut id velit veniam consequat. Veniam aliqua sint magna culpa proident dolore qui laborum ut mollit esse ea. Dolor pariatur aliquip non dolor nulla ipsum. Aute esse mollit commodo ad minim aute ut. Ullamco exercitation aliqua deserunt incididunt anim non aliquip.

Sit incididunt exercitation reprehenderit ea eiusmod veniam sint voluptate. Cillum excepteur eiusmod qui sunt qui ut et sunt sunt fugiat deserunt sit nisi. Dolore laboris ex sit labore. Cupidatat culpa irure ea et tempor. Nostrud consectetur esse est est. Ut veniam incididunt ut velit voluptate officia et. Fugiat excepteur laborum sunt incididunt ullamco.

Nisi irure anim tempor qui eiusmod cupidatat anim proident. Quis qui cillum amet eu. Aute est elit ex id eu ea in nisi minim do labore adipisicing culpa. Irure sint elit cillum culpa do sit. Enim culpa consequat cupidatat do nostrud duis est Lorem et et qui.

Consequat irure laboris labore culpa labore amet quis exercitation esse labore officia consectetur quis mollit. Adipisicing laborum est sit nostrud consequat. Voluptate ad adipisicing cupidatat minim laboris sint. Et cillum duis ad voluptate ullamco pariatur laborum proident.
                </Text>
                <Divider my="4" />
                <Text>
                    Nisi ex qui dolore irure dolor ut id velit veniam consequat. Veniam aliqua sint magna culpa proident dolore qui laborum ut mollit esse ea. Dolor pariatur aliquip non dolor nulla ipsum. Aute esse mollit commodo ad minim aute ut. Ullamco exercitation aliqua deserunt incididunt anim non aliquip.

Sit incididunt exercitation reprehenderit ea eiusmod veniam sint voluptate. Cillum excepteur eiusmod qui sunt qui ut et sunt sunt fugiat deserunt sit nisi. Dolore laboris ex sit labore. Cupidatat culpa irure ea et tempor. Nostrud consectetur esse est est. Ut veniam incididunt ut velit voluptate officia et. Fugiat excepteur laborum sunt incididunt ullamco.

Nisi irure anim tempor qui eiusmod cupidatat anim proident. Quis qui cillum amet eu. Aute est elit ex id eu ea in nisi minim do labore adipisicing culpa. Irure sint elit cillum culpa do sit. Enim culpa consequat cupidatat do nostrud duis est Lorem et et qui.

Consequat irure laboris labore culpa labore amet quis exercitation esse labore officia consectetur quis mollit. Adipisicing laborum est sit nostrud consequat. Voluptate ad adipisicing cupidatat minim laboris sint. Et cillum duis ad voluptate ullamco pariatur laborum proident.
                </Text>
                <Divider my="4" />
                <Box>
                    <Checkbox
                        value={privacyPolicyAccepted}
                        onChange={(e) => setPrivacyPolicyAccepted(e.target.checked)}
                        isDisabled={apiState === 'accepted'}
                    >
                        Accept Privacy Policy
                    </Checkbox>
                </Box>
                <Button
                    isDisabled={!privacyPolicyAccepted || apiState === 'accepted'}
                    onClick={() => setApiState('accepted')}
                >
                   {apiState !== 'accepted' ? 'Accept' : 'Accepted'}
                </Button>
            </Box>
            {apiState === 'accepted' &&
                <ConsentingRegisterForm />
            }
        </>
    );
}
