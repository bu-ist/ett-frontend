// This has been removed, but may be re-enabled later.

// Function to lookup the entity details based on the invitation code.
async function lookupEntityAPI( invitationCode ) {
        const { MODE, VITE_API_STAGE, VITE_CONSENTING_API_HOST } = import.meta.env;

        // Set the API URL based on the environment, local dev needs a proxy to avoid CORS issues.
        const apiUrlBase = MODE === 'development'
        ? `/registerEntityApi/${VITE_API_STAGE}/`
        : `${import.meta.env.VITE_REGISTER_ENTITY_API_HOST}/${VITE_API_STAGE}/`;
    
        // Construct the full URI for the API call.
        const requestUri = `${apiUrlBase}register-entity/lookup-entity/${invitationCode}`;

        // Send the GET request and get the response.
        const response = await fetch(requestUri, {
            method: 'GET',
            mode: 'cors',
            credentials: 'omit',
        });

        // Extract and return the response.
        const data = await response.json();

        return data;
}

export { lookupEntityAPI };
