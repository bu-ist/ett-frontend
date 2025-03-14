// This is somewhat duplicative of the inviteAuthIndFromEntityAPI function, but is more specific to the AI role and a single invitee.

async function inviteUserAI(appConfig, accessToken, emailToInvite, entityID, role) {
    // Look up if we are in local development mode.
    const { MODE } = import.meta.env;

    // Get the API URL from appConfig.
    const { apiStage, authorizedIndividual: { apiHost } }  = appConfig;

    // Set the API URL based on the environment, local dev needs a proxy to avoid CORS issues.
    const apiUrlBase = MODE === 'development'
    ? `/authorizedApi/${apiStage}`
    : `${apiHost}/${apiStage}`;

    const requestUri = `${apiUrlBase}/RE_AUTH_IND`;

    const roleMap = {
        RE_ADMIN: 'entity/register',
        RE_AUTH_IND: 'auth-ind/sign-up',
    };

    const registerUri = roleMap[role];

    // Send a request to the API to invite the user.
    const response = await fetch(requestUri, {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'ettPayload': JSON.stringify({ 
                task: 'invite-user',
                parameters: { 
                    email: emailToInvite, 
                    entity_id: entityID,
                    role: role,
                    registrationUri: `${window.location.origin}/${registerUri}`
                 }
            })
        }
    });

    // Extract and return the payload from the response.
    const data = await response.json();
    return data;
}

export { inviteUserAI };
