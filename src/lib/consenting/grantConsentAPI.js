async function grantConsentAPI(accessToken, grantRequestPayload) {
    // Destructure environment variables from import.meta.env
    const { MODE, VITE_API_STAGE, VITE_CONSENTING_API_HOST } = import.meta.env;

    // Set the API URL based on the environment, local dev needs a proxy to avoid CORS issues.
    const apiUrl = MODE === 'development'
        ? `/consentingApi/${VITE_API_STAGE}/CONSENTING_PERSON`
        : `${VITE_CONSENTING_API_HOST}/${VITE_API_STAGE}/CONSENTING_PERSON`;

    // Send a request to the API to register consent.
    const response = await fetch(apiUrl, {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
        headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'ettpayload': JSON.stringify({ task: 'register-consent', parameters: grantRequestPayload })
        }
    });

    // Extract and return the payload from the response.
    const data = await response.json();
    return data;
}

export { grantConsentAPI };