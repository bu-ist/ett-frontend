async function lookupUserContextAPI(accessToken, email) {
    // Destructure environment variables from import.meta.env
    const { MODE, VITE_API_STAGE, VITE_ENTITY_API_HOST } = import.meta.env;
    
    // Set the API URL based on the environment, local dev needs a proxy to avoid CORS issues.
    const apiUrlBase = MODE === 'development'
        ? `/entityApi/${VITE_API_STAGE}`
        : `${VITE_ENTITY_API_HOST}/${VITE_API_STAGE}`;

    const requestUri = `${apiUrlBase}/RE_ADMIN`;

    // Fetch the consenting person data from the API with the token from sign in.
    const response = await fetch(requestUri, {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'ettPayload': JSON.stringify({ task: 'lookup-user-context', parameters: { email: email, role: 'RE_ADMIN' } })
        }
    });

    // Extract and return the payload from the response.
    const data = await response.json();
    return data;
}

export { lookupUserContextAPI };