import { Card, CardHeader, CardBody, CardFooter, Button, Heading, Stack, FormLabel, Input, RadioGroup, Radio } from "@chakra-ui/react";

export default function ContactEditCard( {contact, disableRemove, removeContact, index, handleContactChange, handleOrgTypeRadioChange} ) {
    return (
        <Card mb="1em" key={contact.id}>
            <CardHeader>
                <Heading as="h4" size="sm">Contact {index + 1}</Heading>
            </CardHeader>
            <CardBody>
                <FormLabel>Organiziation</FormLabel>
                <Input
                    type="text"
                    name="organizationName"
                    value={contact.organizationName}
                    onChange={(e) => handleContactChange(contact.id, e)}
                />
                <FormLabel>Organization Type</FormLabel>
                <RadioGroup
                    my="0.5em"
                    name="organizationType"
                    value={contact.organizationType}
                    onChange={(value) => handleOrgTypeRadioChange(contact.id, value)}
                >
                    <Stack spacing="1.5em" direction="row">
                        <Radio value="EMPLOYER">Employer</Radio>
                        <Radio value="ACADEMIC">Academic</Radio>
                        <Radio value="OTHER">Other</Radio>
                    </Stack>
                </RadioGroup>
                <FormLabel>Contact Name</FormLabel>
                <Input
                    type="text"
                    name="contactName"
                    value={contact.contactName}
                    onChange={(e) => handleContactChange(contact.id, e)}
                />
                <FormLabel>Contact Title</FormLabel>
                <Input
                    type="text"
                    name="contactTitle"
                    value={contact.contactTitle}
                    onChange={(e) => handleContactChange(contact.id, e)}
                />
                <FormLabel>Contact Email</FormLabel>
                <Input
                    type="email"
                    name="contactEmail"
                    value={contact.contactEmail}
                    onChange={(e) => handleContactChange(contact.id, e)}
                />
                <FormLabel>Contact Phone</FormLabel>
                <Input
                    type="tel"
                    name="contactPhone"
                    value={contact.contactPhone}
                    onChange={(e) => handleContactChange(contact.id, e)}
                />
            </CardBody>
            <CardFooter>
                <Button 
                    onClick={() => removeContact(contact.id)}
                    isDisabled={disableRemove}
                >
                    Remove Contact
                </Button>
            </CardFooter>
        </Card>
    );
}
