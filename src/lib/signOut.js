// This function redirects to the cognito logout page.
// Cognito will redirect back to the logout page, which will clear the cookies and display a message.
function signOut(cognitoDomain, cognitoID) {

    // Construct the redirect URI
    const port = window.location.port ? `:${window.location.port}` : '';
    const redirectBase = `${window.location.protocol}//${window.location.hostname}${port}`;

    const logoutRedirect = encodeURIComponent(`${redirectBase}/logout`);

    const logoutUrl = `https://${cognitoDomain}/logout?client_id=${cognitoID}&logout_uri=${logoutRedirect}`;

    window.location.href = logoutUrl;
}

export { signOut };