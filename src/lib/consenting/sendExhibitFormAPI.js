// Formats the payload and sends the exhibit form to the API.
async function sendExhibitFormAPI(accessToken, contactList, entityId, email) {
    // Set the API URL based on the environment, local dev needs a proxy to avoid CORS issues.
    const apiUrl = import.meta.env.MODE === 'development'
        ? '/consentingApi/dev/CONSENTING_PERSON'
        : `${import.meta.env.VITE_CONSENTING_API_HOST}/dev/CONSENTING_PERSON`;

    const mappedContactList = contactList.map(contact => {
        return {
            org: contact.organizationName,
            affiliateType: contact.organizationType,
            email: contact.contactEmail,
            fullname: contact.contactName,
            title: contact.contactTitle,
            phone_number: contact.contactPhone,
        }
    });

    // Prepare the payload for the request.
    const params = {
        email: email,
        exhibit_data: {
            entity_id: entityId,
            affiliates: mappedContactList
        }
    };

    // Send a request to the API to register consent.
    const response = await fetch(apiUrl, {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
        headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'ettpayload': JSON.stringify({ task: 'send-exhibit-form', parameters: params })
        }
    });

    // Extract and return the payload from the response.
    const data = await response.json();
    return data;
}

export { sendExhibitFormAPI };
