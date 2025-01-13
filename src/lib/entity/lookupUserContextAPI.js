async function lookupUserContextAPI( apiStage, apiHost, accessToken, email) {
    // Look up if we are in local development mode.
    const { MODE } = import.meta.env;

    // Set the API URL based on the environment, local dev needs a proxy to avoid CORS issues.
    const apiUrlBase = MODE === 'development'
        ? `/entityApi/${apiStage}`
        : `${apiHost}/${apiStage}`;

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