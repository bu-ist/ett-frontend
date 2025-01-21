// This function sends a POST request to the Entity API to invite two 'Authorized Individual' users to an entity.
async function inviteAuthIndFromEntityAPI( appConfig, accessToken, fromEmail, entity, emailsToInvite ) {
    // Look up if we are in local development mode.
     const { MODE } = import.meta.env;
    
    // Get the api details from the appConfig.
    const { apiStage, entityAdmin: { apiHost } } = appConfig;
    
    // Set the API URL based on the environment, local dev needs a proxy to avoid CORS issues.
    const apiUrl = MODE === 'development'
        ? `/entityApi/${apiStage}/RE_ADMIN`
        : `${apiHost}/${apiStage}/RE_ADMIN`;

    // Construct the registration URI for the email invitation, which cognito will redirect to.
    const registrationUri = `${window.location.origin}/auth-ind/sign-up`;

    const outgoingPayload = {
        task: 'invite-users',
        parameters: {
            entity: entity,
            registrationUri: registrationUri,
            invitations: {
                inviter: {
                    email: fromEmail,
                    role: 'RE_ADMIN'
                },
                invitee1: { email: emailsToInvite.email1, role:'RE_AUTH_IND' },
                invitee2: { email: emailsToInvite.email2, role:'RE_AUTH_IND' }
            }
        }
    }

    // POST the email addresses in the payload to the API to invite them to the entity.
    const response = await fetch(apiUrl, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'ettpayload': JSON.stringify(outgoingPayload)
        }
    });

    // Extract and return the payload from the response.
    if ( !response.ok ) {
        // Don't try to parse error responses to json (it hard crashes), just early return a payload with a false 'ok' result.
        return { payload: { ok: false } }
    }

    const data = await response.json();
    return data;
}

export { inviteAuthIndFromEntityAPI };
