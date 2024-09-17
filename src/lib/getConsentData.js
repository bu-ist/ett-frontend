async function getConsentData(accessToken, email) {
    // This is the URL of the API Gateway endpoint that will be called.
    //const response = await fetch(import.meta.env.VITE_CONSENTING_API_URI, {
    const response = await fetch('/api/dev/CONSENTING_PERSON', {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
        headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'ettpayload': JSON.stringify({ task: 'get-consenter', parameters: { email: email} })
        }
    });

    const data = await response.json();
    return data.payload;
}

export { getConsentData };
