/**
 * Authenticate with the cognito user pool in such a way as to reflect that it implements the
 * oauth PKCE standard. The final redirect should come with a JWT for all api access.
 */
function signIn(clientId, redirectUri) {
    const codeVerifier = generateCodeVerifier();
    const state = getRandomString(12);

    // Save state and code_verifier in session storage
    const storage = window.sessionStorage;
    storage.clear();
    storage.setItem("state", state);
    storage.setItem("code_verifier", codeVerifier);

    generateCodeChallenge(codeVerifier).then(codeChallenge => {
        initiateAuthorizationRequest(codeChallenge, state, clientId, redirectUri);
    });
}

/**
 * Generate a code verifier
 */
function generateCodeVerifier() {
    const codeVerifierLength = 64;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    let codeVerifier = '';

    for (let i = 0; i < codeVerifierLength; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        codeVerifier += chars.charAt(randomIndex);
    }

    return codeVerifier;
}

function getRandomString(length) {
    const s = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return Array(length).join().split(',').map(
        function () {
            return s.charAt(Math.floor(Math.random() * s.length));
        }
    ).join('');
}

/**
 * Generate a code challenge from the verifier
 */
async function generateCodeChallenge(codeVerifier) {
    const encoder = new TextEncoder();
    const encodedVerifier = encoder.encode(codeVerifier);
    const codeChallenge = base64UrlEncode(await crypto.subtle.digest('SHA-256', encodedVerifier));
    return codeChallenge;
}

/**
 * Generate a base64 encoded string from input and return the url safe result.
 * NOTE: The base64 value is NOT url encoded, but any non-url compliant characters are stripped out.
 * Any platform implementing the oauth PKCE standard will account for this when processing the code challenge.
 */
async function base64UrlEncode(sha256HashBuffer) {
    // Convert the SHA-256 hash to a base64 URL encoded string
    const sha256HashArray = Array.from(new Uint8Array(sha256HashBuffer));
    const base64UrlEncoded = btoa(String.fromCharCode(...sha256HashArray))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');

    return base64UrlEncoded;
}

/**
 * Issue a code challenge to the cognito authorization endpoint as the first step in 
 * acquiring an authorization code to exchange for a JWT.
 */
function initiateAuthorizationRequest(codeChallenge, state, clientId, redirectUri) {
    const params = {
        response_type: 'code',
        client_id: clientId,
        redirect_uri: `${import.meta.env.VITE_REDIRECT_BASE}/${redirectUri}`,
        state: state,
        code_challenge: codeChallenge,
        code_challenge_method: 'S256'
    };

    const queryString = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`).join('&');
    const authorizationUrl = `https://${import.meta.env.VITE_COGNITO_DOMAIN}/oauth2/authorize?${queryString}`;

    window.location.href = authorizationUrl;
}

export { signIn };
