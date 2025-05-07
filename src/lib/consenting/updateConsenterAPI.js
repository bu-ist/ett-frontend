/**
 * Updates Consenting Person information
 * 
 * API Workflow:
 * 1. Sends a GET request to the /CONSENTING_PERSON endpoint with an ettPayload header
 * 2. The ettPayload contains:
 *    - task: 'correct-consenter' to identify the update operation
 *    - parameters: Object containing the updated user data:
 *      - firstname: The consenter's first name
 *      - middlename: The consenter's middle name (optional)
 *      - lastname: The consenter's last name
 *      - email: The consenter's current email
 *      - new_email: The consenter's new email (if being changed)
 *      - phone_number: The consenter's phone number
 * 3. Returns a response with { payload: { ok: true/false } } structure
 * 
 * @param {Object} appConfig - The application configuration object
 * @param {string} accessToken - JWT access token
 * @param {Object} userData - Object containing user data to update
 * @returns {Promise<Object>} - API response
 */
async function updateConsenterAPI(appConfig, accessToken, userData) {
    // Look up if we are in local development mode
    const { MODE } = import.meta.env;

    const { apiStage, consentingPerson: { apiHost } } = appConfig;

    // Set the API URL based on the environment, local dev needs a proxy to avoid CORS issues
    const apiUrlBase = MODE === 'development'
        ? `/consentingApi/${apiStage}`
        : `${apiHost}/${apiStage}`;

    const requestUri = `${apiUrlBase}/CONSENTING_PERSON`;

    try {
        const response = await fetch(requestUri, {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'ettPayload': JSON.stringify({
                    task: 'correct-consenter',
                    parameters: userData
                })
            }
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error updating consenting person:', error);
        return {
            message: 'Error updating consenting person information',
            payload: { ok: false }
        };
    }
}

export { updateConsenterAPI };