async function sysAdminInviteUserAPI(accessToken, email, role) {
    // Set the API URL based on the environment, local dev needs a proxy to avoid CORS issues.
    const apiUrl = import.meta.env.MODE === 'development'
        ? '/sysadminApi/dev/SYS_ADMIN'
        : `${import.meta.env.VITE_CONSENTING_API_HOST}/dev/SYS_ADMIN`;

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
