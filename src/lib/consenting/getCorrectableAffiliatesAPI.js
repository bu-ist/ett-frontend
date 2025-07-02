// Get correctable affiliates from the API.
async function getCorrectableAffiliatesAPI(appConfig, accessToken, email, entityId) {
    // Look up if we are in local development mode.
    const { MODE } = import.meta.env;

    // De-structure api values from the appConfig.
    const { apiStage, consentingPerson: { apiHost } } = appConfig;

    // Set the API URL based on the environment, local dev needs a proxy to avoid CORS issues.
    const apiUrl = MODE === 'development'
        ? `/consentingApi/${apiStage}/CONSENTING_PERSON`
        : `${apiHost}/${apiStage}/CONSENTING_PERSON`;

    // Fetch the correctable affiliates data from the API with the token from sign in.
    const response = await fetch(apiUrl, {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'ettpayload': JSON.stringify({
                task: 'get-correctable-affiliates',
                parameters: {
                    email: email,
                    entity_id: entityId
                }
            })
        }
    });

    // Extract and return the payload from the response.
    const data = await response.json();
    return data.payload;
}

export { getCorrectableAffiliatesAPI };
