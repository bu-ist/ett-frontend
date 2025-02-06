async function terminateEntityAPI(appConfig, code) {
    // Look up if we are in local development mode.
    const { MODE } = import.meta.env;

    const { apiStage, registerEntityApiHost } = appConfig;

    // Set the API URL based on the environment, local dev needs a proxy to avoid CORS issues.
    const apiUrlBase = MODE === 'development'
        ? `/registerEntityApi/${apiStage}/`
        : `${registerEntityApiHost}/${apiStage}/`;

    // Construct the full URI for the API call.
    const requestUri = `${apiUrlBase}register-entity/terminate/${code}`;

    // Send the GET request and get the response.
    const response = await fetch(requestUri, {
        method: 'GET',
        mode: 'cors',
        credentials: 'omit',
    });
    
    // Extract and return the response.
    const data = await response.json();

    return data;
}

export { terminateEntityAPI };
