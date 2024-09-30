async function acknowledgeEntityAPI(code) {
    // Set the API URL based on the environment, local dev needs a proxy to avoid CORS issues.
    const apiUrlBase = import.meta.env.MODE === 'development'
        ? '/acknowledgeEntityApi/dev/'
        : `${import.meta.env.VITE_ACKNOWLEDGE_ENTITY_API_HOST}/dev/`;

    const requestUri = `${apiUrlBase}/acknowledge-entity/register/${code}`;

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

export { acknowledgeEntityAPI };
