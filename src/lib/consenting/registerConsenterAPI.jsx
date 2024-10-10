async function registerConsenterAPI(formData) {
    // Set the API URL based on the environment, local dev needs a proxy to avoid CORS issues.
    const apiUrlBase = import.meta.env.MODE === 'development'
        ? '/registerConsenterApi/dev/'
        : `${import.meta.env.VITE_REGISTER_CONSENTER_API_HOST}/dev/`;

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
