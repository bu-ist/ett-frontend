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

    // Handle error responses from the API
    if (!response.ok) {
        try {
            // The API may return either a single error or an array of responses
            const errorData = await response.json();

            // If there are multiple errors in an array, handle bundled responses from multiple API calls
            if (Array.isArray(errorData)) {
                // Find items that represent errors (identified by payload.error === true)
                const failedItems = errorData.filter(item => item?.payload?.error === true);

                // Extract messages from failed items
                const errorMessages = failedItems.map(item => item.message);

                // Return the error messages, if any, as a single consolidated message
                return errorMessages.length > 0
                    ? { payload: { ok: false, message: errorMessages.join('\n\n') } }
                    : { payload: { ok: false } };
            }

            // Otherwise if it's not an array, return the error data as-is
            return { payload: { ok: false, message: errorData?.message || 'Unknown error' } };
        } catch (error) {
            console.error('Error parsing response:', error);
            return { payload: { ok: false } };
        }
    }

    // Handle successful response
    return response.json();
}

export { inviteAuthIndFromEntityAPI };
