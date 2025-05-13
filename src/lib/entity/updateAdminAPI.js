/**
 * Updates Administrative Support Professional information
 * 
 * API Workflow:
 * 1. Sends a GET request to the /RE_ADMIN endpoint with an ettPayload header
 * 2. The ettPayload contains:
 *    - task: 'correct-entity-rep' to identify the update operation
 *    - parameters: Object containing the updated user data:
 *      - email: The ASP's current email
 *      - new_email: The ASP's new email (if being changed)
 *      - entity_id: The entity ID
 *      - fullname: The ASP's full name
 *      - title: The ASP's title
 *      - phone_number: The ASP's phone number
 *      - role: 'RE_ADMIN'
 * 3. Returns a response with { payload: { ok: true/false } } structure
 * 
 * @param {Object} appConfig - The application configuration object
 * @param {string} accessToken - JWT access token
 * @param {Object} userData - Object containing user data to update
 * @returns {Promise<Object>} - API response
 */
async function updateAdminAPI(appConfig, accessToken, userData) {
    // Look up if we are in local development mode
    const { MODE } = import.meta.env;

    const { apiStage, entityAdmin: { apiHost } } = appConfig;

    // Set the API URL based on the environment, local dev needs a proxy to avoid CORS issues
    const apiUrlBase = MODE === 'development'
        ? `/entityApi/${apiStage}`
        : `${apiHost}/${apiStage}`;

    const requestUri = `${apiUrlBase}/RE_ADMIN`;

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
        console.error('Error updating administrative support professional:', error);
        return {
            message: 'Error updating administrative support professional information',
            payload: { ok: false }
        };
    }
}

export { updateAdminAPI };
