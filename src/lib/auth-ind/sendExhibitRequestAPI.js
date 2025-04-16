async function sendExhibitRequestAPI(apiHost, apiStage, accessToken, email, entityId, constraint, lookbackPeriod) {
    // Look up if we are in local development mode.
    const { MODE } = import.meta.env;

    // Set the API URL based on the environment, local dev needs a proxy to avoid CORS issues.
    const apiUrlBase = MODE === 'development'
    ? `/authorizedApi/${apiStage}`
    : `${apiHost}/${apiStage}`;
    
    const requestUri = `${apiUrlBase}/RE_AUTH_IND`;

    // Send a request to the API to send exhibit request.
    const response = await fetch(requestUri, {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'ettPayload': JSON.stringify({ 
                task: 'send-exhibit-form-request',
                parameters: {
                    consenterEmail: email,
                    entity_id: entityId,
                    constraint: constraint,
                    lookback: lookbackPeriod
                }
            })
        }
    });

    // Extract and return the payload from the response.
    const data = await response.json();
    return data;
}

export { sendExhibitRequestAPI };