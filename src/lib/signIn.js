import { Base64 } from 'js-base64';
import queryString from 'query-string';

/**
 * Authenticate with the cognito user pool in such a way as to reflect that it implements the
 * oauth PKCE standard. The final redirect should come with a JWT for all api access.
 */
function signIn(clientId, redirectUri, cognitoDomain) {
    const codeVerifier = generateCodeVerifier();
    const state = getRandomString(12);

    // Save state and code_verifier in session storage
    const storage = window.sessionStorage;
    storage.clear();
    storage.setItem("state", state);
    storage.setItem("code_verifier", codeVerifier);

    generateCodeChallenge(codeVerifier).then(codeChallenge => {
        initiateAuthorizationRequest(codeChallenge, state, clientId, redirectUri, cognitoDomain);
    });
}

/**
 * Generate a code verifier
 */
function generateCodeVerifier() {
    const array = new Uint32Array(64);
    window.crypto.getRandomValues(array);
    return Array.from(array, dec => ('0' + dec.toString(36)).substr(-2)).join('');
}

function getRandomString(length) {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => String.fromCharCode(byte % 36 + (byte % 36 < 10 ? 48 : 87))).join('');
}

/**
 * Generate a code challenge from the verifier
 */
async function generateCodeChallenge(codeVerifier) {
    const encoder = new TextEncoder();
    const encodedVerifier = encoder.encode(codeVerifier);
    const hashBuffer = await crypto.subtle.digest('SHA-256', encodedVerifier);

    // base64 encode the hash
    // NOTE: The base64 value is NOT url encoded, but any non-url compliant characters are stripped out.
    // Any platform implementing the oauth PKCE standard will account for this when processing the code challenge.
    const encodedHash = Base64.fromUint8Array(new Uint8Array(hashBuffer), true);

    return encodedHash;
}

/**
 * Issue a code challenge to the cognito authorization endpoint as the first step in 
 * acquiring an authorization code to exchange for a JWT.
 */
function initiateAuthorizationRequest(codeChallenge, state, clientId, redirectUri, cognitoDomain) {
    // Construct the redirect URI
    const port = window.location.port ? `:${window.location.port}` : '';
    const redirectBase = `${window.location.protocol}//${window.location.hostname}${port}`;
        
    const params = {
        response_type: 'code',
        client_id: clientId,
        redirect_uri: `${redirectBase}/${redirectUri}`,
        state: state,
        code_challenge: codeChallenge,
        code_challenge_method: 'S256'
    };

    const authorizationUrl = `https://${cognitoDomain}/oauth2/authorize?${queryString.stringify(params)}`;

    window.location.href = authorizationUrl;
}

export { signIn };
