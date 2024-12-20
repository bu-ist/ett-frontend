async function lookupInvitationAPI(code) {
    // Destructure environment variables from import.meta.env
    const { MODE, VITE_API_STAGE, VITE_ACKNOWLEDGE_ENTITY_API_HOST } = import.meta.env;

    // Set the API URL based on the environment, local dev needs a proxy to avoid CORS issues.
    const apiUrlBase = MODE === 'development'
        ? `/acknowledgeEntityApi/${VITE_API_STAGE}/`
        : `${VITE_ACKNOWLEDGE_ENTITY_API_HOST}/${VITE_API_STAGE}/`;

    const requestUri = `${apiUrlBase}/acknowledge-entity/lookup-invitation/${code}`;

    // Fetch the consenting person data from the API with the token from sign in.
    const response = await fetch(requestUri, {
        method: 'GET',
        mode: 'cors',
        credentials: 'omit',
    });

    // Extract and return the payload from the response.
    const data = await response.json();
    return data;
}

export { lookupInvitationAPI };
