import queryString from 'query-string';

// Constructs a sign up URL and redirects the user to it.
function signUp( cognitoDomain, email, clientID, redirectUri ) {
    const params = {
        username: email,
        client_id: clientID,
        response_type: 'code',
        scope: 'email openid phone',
        redirect_uri: window.location.origin + '/' + redirectUri,
    };

    const signUpQueryString = queryString.stringify(params);
    const signUpURL = `https://${cognitoDomain}/signup?${signUpQueryString}`;

    // Redirect the user to the sign up URL.
    window.location.href = signUpURL;
}

export { signUp };
