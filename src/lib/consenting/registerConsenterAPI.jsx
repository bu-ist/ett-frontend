async function registerConsenterAPI(appConfig, formData) {
    // Look up if we are in local development mode.
    const { MODE } = import.meta.env;

    // De-structure api values from the appConfig.
    const { apiStage, registerConsenterHost } = appConfig;

    // Set the API URL based on the environment, local dev needs a proxy to avoid CORS issues.
    const apiUrlBase = MODE === 'development'
        ? `/registerConsenterApi/${apiStage}/`
        : `${registerConsenterHost}/${apiStage}/`;

    const requestUri = `${apiUrlBase}register-consenter`;

    // Register the consenter with the API.
    const response = await fetch(requestUri, {
        method: 'GET',
        mode: 'cors',
        credentials: 'omit',
        headers: {
            'Content-Type': 'application/json',
            'ettpayload': JSON.stringify({parameters: formData})
        }
    });

    // Extract and return the payload from the response.
    const data = await response.json();
    return data;
}

export { registerConsenterAPI };
