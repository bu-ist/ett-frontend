/**
 * Updates Authorized Individual information including optional delegate contact
 * 
 * API Workflow:
 * 1. Sends a GET request to the /RE_AUTH_IND endpoint with an ettPayload header
 * 2. The ettPayload contains:
 *    - task: 'correct-entity-rep' to identify the update operation
 *    - parameters: Object containing the updated user data:
 *      - fullname: The AI's full name
 *      - title: The AI's title
 *      - email: The AI's email (typically not changed)
 *      - phone_number: The AI's phone number
 *      - delegate_* fields (optional): If a delegate contact is included
 * 3. Returns a response with { payload: { ok: true/false } } structure
 * 
 * Note: While this uses a GET request with the payload in headers (following current
 * API pattern), this would typically be better implemented as a PUT or PATCH request
 * in a RESTful API design.
 * 
 * @param {Object} appConfig - The application configuration object
 * @param {string} accessToken - JWT access token
 * @param {Object} userData - Object containing user data to update
 * @returns {Promise<Object>} - API response
 */
async function updateAuthIndAPI(appConfig, accessToken, userData) {
    // Look up if we are in local development mode
    const { MODE } = import.meta.env;

    const { apiStage, authorizedIndividual: { apiHost } } = appConfig;

    // Set the API URL based on the environment, local dev needs a proxy to avoid CORS issues
    const apiUrlBase = MODE === 'development'
        ? `/authorizedApi/${apiStage}`
        : `${apiHost}/${apiStage}`;

    const requestUri = `${apiUrlBase}/RE_AUTH_IND`;

    try {
        const response = await fetch(requestUri, {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'ettPayload': JSON.stringify({
                    task: 'correct-entity-rep',
                    parameters: userData
                })
            }
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error updating authorized individual:', error);
        return {
            message: 'Error updating authorized individual information',
            payload: { ok: false }
        };
    }
}

export { updateAuthIndAPI };
