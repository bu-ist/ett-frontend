// Function to lookup the entity details based on the invitation code.
async function lookupEntityAPI( invitationCode ) {
        // Set the API URL based on the environment, local dev needs a proxy to avoid CORS issues.
        const apiUrlBase = import.meta.env.MODE === 'development'
        ? '/registerEntityApi/dev/'
        : `${import.meta.env.VITE_REGISTER_ENTITY_API_HOST}/dev/`;
    
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