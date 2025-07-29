/**
 * Sends a POST request to the Entity API to invite Authorized Individual(s) to an entity.
 * Can be used to invite either one or two Authorized Individuals.
 * 
 * @param {Object} appConfig - The application configuration
 * @param {string} accessToken - The access token for authentication
 * @param {string} fromEmail - The email of the RE_ADMIN sending the invitation
 * @param {Object} entity - The entity object
 * @param {Object} emailsToInvite - Object containing email(s) to invite
 * @param {string} emailsToInvite.email1 - First email to invite (required)
 * @param {string} [emailsToInvite.email2] - Second email to invite (optional)
 * @returns {Promise<Object>} The API response
 */
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

    // Construct the invitations object based on whether we have one or two emails
    const invitations = {
        inviter: {
            email: fromEmail,
            role: 'RE_ADMIN'
        },
        invitee1: { email: emailsToInvite.email1, role: 'RE_AUTH_IND' }
    };

    // Only add second invitee if email2 is provided
    if (emailsToInvite.email2) {
        invitations.invitee2 = { email: emailsToInvite.email2, role: 'RE_AUTH_IND' };
    }

    const outgoingPayload = {
        task: 'invite-users',
        parameters: {
            entity: entity,
            registrationUri: registrationUri,
            invitations
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

    let data;

    // Extract and return the payload from the response.
    if ( !response.ok ) {
        try {
            data = await response.json();
            if(data instanceof Array) {
                // The backend calls the single inviteUser api endpoint twice and has "bundled" the responses together.
                const badItems = data.filter((item) => {
                    const { payload:{ invalid=false } = {}, message=''} = item;
                    return invalid && message;
                })
                if(badItems.length > 0) {
                    return { payload: { ok: false, message: badItems.map(item => item.message).join("\n\n") } };
                }
            }
        }
        catch(e) {
            console.error('Error parsing response:', e);
        }
        return { payload: { ok: false } }
    }

    data = await response.json();
    return data;
}

export { inviteAuthIndFromEntityAPI };
