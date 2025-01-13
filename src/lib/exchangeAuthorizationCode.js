import { setJwt } from "./jwtUtil";

/**
  * Request an authorization code from the cognito authorization endpoint, with the original code verifier 
  * included as the second (and final) step in acquiring an authorization code to exchange for a JWT.
  * SEE: https://docs.aws.amazon.com/cognito/latest/developerguide/token-endpoint.html
  *      https://www.rfc-editor.org/rfc/rfc6749#section-3.2
  */
async function exchangeAuthorizationCode( cognitoDomain, clientId, redirectUri ) {
    const queryParams = new URLSearchParams(window.location.search);
    const authorizationCode = queryParams.get('code');
    const returnedState = queryParams.get('state')
    const savedState = window.sessionStorage.getItem("state");

    if (savedState !== returnedState) {
        throw Error("Probable session hijacking attack!");
    }

    if (!authorizationCode) {
        throw Error('Authorization code not found in the URL.');
    }

    // Construct the redirect URI
    const port = window.location.port ? `:${window.location.port}` : '';
    const redirectBase = `${window.location.protocol}//${window.location.hostname}${port}`;

    const codeVerifier = window.sessionStorage.getItem("code_verifier");
    const params = {
        grant_type: 'authorization_code',
        client_id: clientId,
        redirect_uri: `${redirectBase}/${redirectUri}`,
        state: savedState,
        code: authorizationCode,
        code_verifier: codeVerifier
    };

    const formData = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`).join('&');
    const tokenUrl = `https://${cognitoDomain}/oauth2/token`;

    const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
    });

    const data = await response.json();
    if (data.error) {
        console.error(data);
    }
    else {
        // Set the access token in a cookie.
        setJwt(data.access_token, 'EttAccessJwt');

        // Set the id token in a cookie.
        setJwt(data.id_token, 'EttIdJwt');
    }
}

export { exchangeAuthorizationCode };
