// This function sends a POST request to the Entity API to invite two 'Authorized Individual' users to an entity.
async function inviteAuthIndFromEntityAPI( accessToken, fromEmail, entity, emailsToInvite ) {
    // Set the API URL based on the environment, local dev needs a proxy to avoid CORS issues.
    const apiUrl = import.meta.env.MODE === 'development'
        ? '/entityApi/dev/RE_ADMIN'
        : `${import.meta.env.VITE_ENTITY_API_HOST}/dev/RE_ADMIN`;

    const outgoingPayload = {
        task: 'invite-users',
        parameters: {
            entity: entity,
            invitations: {
                from: {
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