// This function redirects to the cognito logout page.
// Cognito will redirect back to the logout page, which will clear the cookies and display a message.
function signOut() {
    const cognitoDomain = import.meta.env.VITE_COGNITO_DOMAIN;
    const clientId = import.meta.env.VITE_ENTITY_COGNITO_CLIENTID;
    const logoutRedirect = encodeURIComponent(`${import.meta.env.VITE_REDIRECT_BASE}/logout`);

    const logoutUrl = `https://${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${logoutRedirect}`;

    window.location.href = logoutUrl;
}

export { signOut };