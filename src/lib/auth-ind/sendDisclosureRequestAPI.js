/**
 * Sends a disclosure request as an Authorized Individual
 * 
 * @param {Object} appConfig - The application configuration object
 * @param {string} accessToken - JWT access token
 * @param {string} consenterEmail - Email of the consenter
 * @param {string} entityId - ID of the entity
 * @returns {Promise<Object>} - API response
 */
async function sendDisclosureRequestAPI(appConfig, accessToken, consenterEmail, entityId) {
    // Look up if we are in local development mode.
    const { MODE } = import.meta.env;

    // Get the API URL from appConfig.
    const { apiStage, authorizedIndividual: { apiHost } } = appConfig;

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
                task: 'send-disclosure-request',
                parameters: { consenterEmail: consenterEmail, entity_id: entityId }
            })
        }
    });

    // Extract and return the payload from the response.
    const data = await response.json();
    return data;
}

export { sendDisclosureRequestAPI };
