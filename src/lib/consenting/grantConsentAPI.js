async function grantConsentAPI(accessToken, grantRequestPayload) {
    // Set the API URL based on the environment, local dev needs a proxy to avoid CORS issues.
    const apiUrl = import.meta.env.MODE === 'development'
        ? '/consentingApi/dev/CONSENTING_PERSON'
        : `${import.meta.env.VITE_CONSENTING_API_HOST}/dev/CONSENTING_PERSON`;

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