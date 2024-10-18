async function sendDisclosureRequestAPI(accessToken, consenterEmail, affiliateEmail, entityId) {
    // Set the API URL based on the environment, local dev needs a proxy to avoid CORS issues.
    const apiUrlBase = import.meta.env.MODE === 'development'
    ? '/authorizedApi/dev/'
    : `${import.meta.env.VITE_AUTHORIZED_API_HOST}/dev/`;
    
    const requestUri = `${apiUrlBase}/RE_AUTH_IND`;

    // Send a request to the API to send exhibit request.
    const response = await fetch(requestUri, {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'ettPayload': JSON.stringify({ 
                task: 'send-disclosure-request',
                parameters: { consenterEmail: consenterEmail, entity_id: entityId, affiliateEmail: affiliateEmail }
            })
        }
    });

    // Extract and return the payload from the response.
    const data = await response.json();
    return data;
}

export { sendDisclosureRequestAPI };