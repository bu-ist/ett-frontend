async function lookupAuthIndAPI(accessToken, email) {
    // Set the API URL based on the environment, local dev needs a proxy to avoid CORS issues.
    const apiUrlBase = import.meta.env.MODE === 'development'
        ? '/authorizedApi/dev/'
        : `${import.meta.env.VITE_AUTHORIZED_API_HOST}/dev/`;

    const requestUri = `${apiUrlBase}/RE_AUTH_IND`;

    // Fetch the consenting person data from the API with the token from sign in.
    const response = await fetch(requestUri, {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'ettPayload': JSON.stringify({ task: 'lookup-user-context', parameters: { email: email, role: 'RE_AUTH_IND' } })
        }
    });

    // Extract and return the payload from the response.
    const data = await response.json();
    return data;
}

export { lookupAuthIndAPI };
