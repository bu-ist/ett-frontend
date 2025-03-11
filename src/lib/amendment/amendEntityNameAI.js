// This is a function to amend the entity name, specifically for the AI (Authorized Individual) role.
async function amendEntityNameAI(appConfig, accessToken, entityId, newEntityName) {
    // Look up if we are in local development mode.
    const { MODE } = import.meta.env;

    const { apiStage, registerEntityApiHost } = appConfig;

    // Set the API URL based on the environment, local dev needs a proxy to avoid CORS issues.
    const apiUrlBase = MODE === 'development'
    ? `/authorizedApi/${apiStage}`
    : `${registerEntityApiHost}/${apiStage}`;

    const requestUri = `${apiUrlBase}/RE_AUTH_IND`;

    // Send a request to the API to amend the entity name.
    const response = await fetch(requestUri, {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'ettPayload': JSON.stringify({ 
                task: 'amend-entity-name',
                parameters: { entity_id: entityId, name: newEntityName }
            })
        }
    });

    // Extract and return the payload from the response.
    const data = await response.json();
    return data;
}

export { amendEntityNameAI };
