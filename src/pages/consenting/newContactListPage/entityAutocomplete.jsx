import { useState } from 'react';
import { AutoComplete, AutoCompleteInput, AutoCompleteList, AutoCompleteItem } from "@choc-ui/chakra-autocomplete";
import { useDisclosure } from '@chakra-ui/react';

export default function EntityAutocomplete({ entities, entity, setEntity }) {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [selectedEntity, setSelectedEntity] = useState('');

    return (
        <AutoComplete
            openOnFocus
            value={entity}
            onChange={setEntity}
        >
            <AutoCompleteInput placeholder="Search for an entity" />
            <AutoCompleteList>
                {entities.map((entity) => {
                    const { entity_name, entity_id } = entity;
                    
                    return (
                        <AutoCompleteItem key={entity_id} value={entity_id} label={entity_name}>
                            {entity_name}
                        </AutoCompleteItem>
                    );
                
                })}
            </AutoCompleteList>
        </AutoComplete>
    );
}