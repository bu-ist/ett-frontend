async function getConsentData( apiStage, apiHost, accessToken, email) {
    // Look up if we are in local development mode.
    const { MODE } = import.meta.env;

    // Set the API URL based on the environment, local dev needs a proxy to avoid CORS issues.
    const apiUrl = MODE === 'development'
        ? `/consentingApi/${apiStage}/CONSENTING_PERSON`
        : `${apiHost}/${apiStage}/CONSENTING_PERSON`;

    // Fetch the consenting person data from the API with the token from sign in.
    const response = await fetch(apiUrl, {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'ettpayload': JSON.stringify({ task: 'get-consenter', parameters: { email: email } })
        }
    });

    // Extract and return the payload from the response.
    const data = await response.json();
    return data.payload;
}

export { getConsentData };
