async function searchConsentersAPI(apiHost, apiStage, accessToken, searchFragment) {
    // Look up if we are in local development mode.
    const { MODE } = import.meta.env;

    // Set the API URL based on the environment, local dev needs a proxy to avoid CORS issues.
    const apiUrl = MODE === 'development'
        ? `/authorizedApi/${apiStage}/RE_AUTH_IND`
        : `${apiHost}/${apiStage}/RE_AUTH_IND`;

    // Send a request to the API to get consenter names that match the fragment parameter.
    const response = await fetch(apiUrl, {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'ettpayload': JSON.stringify({ task: 'get-consenter-list', parameters: { fragment: searchFragment } })
        }
    });

    // Extract and return the payload from the response.
    const data = await response.json();

    console.log('searchConsentersAPI data', data);

    return data;
}

export { searchConsentersAPI };
