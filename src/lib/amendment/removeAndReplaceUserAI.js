// This is so similar to the removeUserAI function that it could be refactored to use that function.
// The only difference is that the replacementEmail parameter is not empty, and the role...
async function removeAndReplaceUserAI(appConfig, accessToken, entityID, emailToRemove, emailToInvite, role, emailOfRequestor ) {
    // Look up if we are in local development mode.
    const { MODE } = import.meta.env;

    const { apiStage, registerEntityApiHost } = appConfig;

    // Set the API URL based on the environment, local dev needs a proxy to avoid CORS issues.
    const apiUrlBase = MODE === 'development'
    ? `/authorizedApi/${apiStage}`
    : `${registerEntityApiHost}/${apiStage}`;

    const requestUri = `${apiUrlBase}/RE_AUTH_IND`;

    const roleMap = {
        RE_ADMIN: 'entity/register',
        RE_AUTH_IND: 'auth-ind/sign-up',
    };

    const registerUri = roleMap[role];

    // Send a request to the API to remove the user.
    const response = await fetch(requestUri, {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'ettPayload': JSON.stringify({ 
                task: 'amend-entity-user',
                parameters: { 
                    entity_id: entityID,
                    replacerEmail: emailOfRequestor,
                    replaceableEmail: emailToRemove,
                    replacementEmail: emailToInvite,
                    registrationUri: `${window.location.origin}/${registerUri}`
                }
            })
        }
    });

    // Extract and return the payload from the response.
    const data = await response.json();
    return data;
}

export { removeAndReplaceUserAI };
