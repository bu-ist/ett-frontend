import { Button, Popover, PopoverTrigger, PopoverContent, PopoverCloseButton, PopoverBody, PopoverArrow, PopoverHeader } from "@chakra-ui/react";

export default function DefinitionPopover({ termName, children }) {

    return (
        <Popover>
            <PopoverTrigger>
                <Button textDecoration="underline" variant="link">{termName}</Button>
            </PopoverTrigger>
            <PopoverContent width="xl">
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader>Definitions</PopoverHeader>
                <PopoverBody p="6">
                    {children}
                </PopoverBody>
            </PopoverContent>
        </Popover>
    );
}
