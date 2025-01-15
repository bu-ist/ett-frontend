// Function to lookup the entity details based on the invitation code.
// Should probably be renamed to lookupInvitationCodeAPI.
async function lookupEntityAPI( appConfig, invitationCode ) {
        const { MODE } = import.meta.env;

        const { apiStage, registerEntityApiHost } = appConfig;

        // Set the API URL based on the environment, local dev needs a proxy to avoid CORS issues.
        const apiUrlBase = MODE === 'development'
        ? `/registerEntityApi/${apiStage}/`
        : `${registerEntityApiHost}/${apiStage}/`;
    
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
