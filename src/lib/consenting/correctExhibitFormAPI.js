// Correct exhibit form via the API.
async function correctExhibitForm(appConfig, accessToken, email, corrections) {
    // Look up if we are in local development mode.
    const { MODE } = import.meta.env;

    // De-structure api values from the appConfig.
    const { apiStage, consentingPerson: { apiHost } } = appConfig;

    // Set the API URL based on the environment, local dev needs a proxy to avoid CORS issues.
    const apiUrl = MODE === 'development'
        ? `/consentingApi/${apiStage}/CONSENTING_PERSON`
        : `${apiHost}/${apiStage}/CONSENTING_PERSON`;

    // Fetch the response from the API with the token from sign in.
    const response = await fetch(apiUrl, {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'ettpayload': JSON.stringify({
                task: 'correct-exhibit-form',
                parameters: {
                    email: email,
                    corrections: corrections
                }
            })
        }
    });

    // Extract and return the payload from the response.
    const data = await response.json();
    return data;
}

export { correctExhibitForm };
