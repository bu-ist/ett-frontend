async function getConsenterListAPI(accessToken) {
    // Destructure environment variables from import.meta.env
    const { MODE, VITE_API_STAGE, VITE_AUTHORIZED_API_HOST } = import.meta.env;

    // Set the API URL based on the environment, local dev needs a proxy to avoid CORS issues.
    const apiUrl = MODE === 'development'
        ? `/authorizedApi/${VITE_API_STAGE}/RE_AUTH_IND`
        : `${VITE_AUTHORIZED_API_HOST}/${VITE_API_STAGE}/RE_AUTH_IND`;

    // Send a request to the API to register consent.
    const response = await fetch(apiUrl, {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'ettpayload': JSON.stringify({ task: 'get-consenter-list', parameters: {} })
        }
    });

    // Extract and return the payload from the response.
    const data = await response.json();
    return data;
}

export { getConsenterListAPI };
