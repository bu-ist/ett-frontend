import queryString from 'query-string';

// This is the API call to register an entity. It is called from the acknowledgeEntityPage.jsx page.
// I think this should be a POST request, not a GET request... But it is a GET right now. 
async function registerEntityAPI(appConfig, code, formData) {
    // Look up if we are in local development mode.
    const { MODE } = import.meta.env;

    const { apiStage, registerEntityApiHost } = appConfig;

    // Set the API URL based on the environment, local dev needs a proxy to avoid CORS issues.
    const apiUrlBase = MODE === 'development'
        ? `/registerEntityApi/${apiStage}/`
        : `${registerEntityApiHost}/${apiStage}/`;

        
    // Take the form data and convert it to a query string.
    const queryStringData = queryString.stringify(formData);
    
    // Construct the full URI for the API call.
    const requestUri = `${apiUrlBase}register-entity/register/${code}?${queryStringData}`;

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

export { registerEntityAPI };
