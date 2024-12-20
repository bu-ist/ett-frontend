async function registerConsenterAPI(formData) {
    // Destructure environment variables from import.meta.env
    const { MODE, VITE_API_STAGE, VITE_REGISTER_CONSENTER_API_HOST } = import.meta.env;

    // Set the API URL based on the environment, local dev needs a proxy to avoid CORS issues.
    const apiUrlBase = MODE === 'development'
        ? `/registerConsenterApi/${VITE_API_STAGE}/`
        : `${VITE_REGISTER_CONSENTER_API_HOST}/${VITE_API_STAGE}/`;

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
