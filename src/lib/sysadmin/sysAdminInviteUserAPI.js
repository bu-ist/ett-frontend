async function sysAdminInviteUserAPI(appConfig, accessToken, email, role) {
    // Look up if we are in local development mode.
    const { MODE } = import.meta.env;
 
    // Get the API URL from appConfig.
    const { apiStage, sysadmin: { apiHost } } = appConfig;

    // Set the API URL based on the environment, local dev needs a proxy to avoid CORS issues.
    const apiUrl = MODE === 'development'
        ? `/sysadminApi/${apiStage}/SYS_ADMIN`
        : `${apiHost}/${apiStage}/SYS_ADMIN`;

    // Construct the registration URI for the email invitation, which cognito will redirect to.
    const registrationUri = `${window.location.origin}/entity/register`;

    // Fetch the consenting person data from the API with the token from sign in.
    const response = await fetch(apiUrl, {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
        headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'ettpayload': JSON.stringify({ task: 'invite-user', parameters: { email: email, role: role, registrationUri: registrationUri} })
        }
    });

    // Extract and return the payload from the response.
    const data = await response.json();
    return data;
}

export { sysAdminInviteUserAPI };
