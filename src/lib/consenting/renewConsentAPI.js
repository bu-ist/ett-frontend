async function renewConsentAPI(accessToken, email) {
    // Set the API URL based on the environment, local dev needs a proxy to avoid CORS issues.
    const apiUrl = import.meta.env.MODE === 'development'
        ? '/consentingApi/dev/CONSENTING_PERSON'
        : `${import.meta.env.VITE_CONSENTING_API_HOST}/dev/CONSENTING_PERSON`;

    // Fetch the consenting person data from the API with the token from sign in.
    const response = await fetch(apiUrl, {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
        headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'ettpayload': JSON.stringify({ task: 'renew-consent', parameters: { email: email} })
        }
    });

    // Extract and return the payload from the response.
    const data = await response.json();
    return data.payload;
}

export { renewConsentAPI };
