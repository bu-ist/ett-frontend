// Formats the payload and sends the exhibit form to the API.
async function sendExhibitFormAPI(appConfig, accessToken, submissionData, entityId, email, formConstraint) {
    // Look up if we are in local development mode.
    const { MODE } = import.meta.env;

    const { apiStage, consentingPerson: { apiHost } }  = appConfig;

    // Set the API URL based on the environment, local dev needs a proxy to avoid CORS issues.
    const apiUrl = MODE === 'development'
        ? `/consentingApi/${apiStage}/CONSENTING_PERSON`
        : `${apiHost}/${apiStage}/CONSENTING_PERSON`;

    const mappedContactList = submissionData.contacts.map(contact => {
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
            constraint: formConstraint,
            formType: 'full',
            affiliates: mappedContactList,
            signature: submissionData.signature
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
