async function sysAdminInviteUserAPI(accessToken, email, role) {
    // Destructure environment variables from import.meta.env
    const { MODE, VITE_API_STAGE,  VITE_SYSADMIN_API_HOST, VITE_REDIRECT_BASE } = import.meta.env;
 
    // Set the API URL based on the environment, local dev needs a proxy to avoid CORS issues.
    const apiUrl = MODE === 'development'
        ? `/sysadminApi/${VITE_API_STAGE}/SYS_ADMIN`
        : `${ VITE_SYSADMIN_API_HOST}/${VITE_API_STAGE}/SYS_ADMIN`;

    // Fetch the consenting person data from the API with the token from sign in.
    const response = await fetch(apiUrl, {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
        headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'ettpayload': JSON.stringify({ task: 'invite-user', parameters: { email: email, role: role} })
        }
    });

    // Extract and return the payload from the response.
    const data = await response.json();
    return data;
}

export { sysAdminInviteUserAPI };
