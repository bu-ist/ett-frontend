function setJwt(jwt, cookieName) {
    const secureFlag = window.location.protocol === 'https:' ? '; Secure' : '';
    const decodedToken = JSON.parse(atob(jwt.split('.')[1]));
    const expirationDate = new Date();
    if (decodedToken.expires_in) {
        expirationDate.setTime(expirationDate.getTime() + decodedToken.expires_in * 1000); // Convert expires_in from seconds to milliseconds
    }
    else if (decodedToken.exp) {
        expirationDate.setTime(decodedToken.exp * 1000); // Convert the 'exp' claim to milliseconds
    }
    else {
        console.error("Cookie not set. No expiration claims found in jwt");
        return;
    }
    const expires = `; expires=${expirationDate.toUTCString()}`;
    const path = '; path=/'; // Set the path to the root of the site
    const cookieValue = encodeURIComponent(jwt) + expires + secureFlag + path + '; SameSite=Strict';
    document.cookie = `${cookieName}=${cookieValue}`;
    // Now that the cookie is set and we have the JWT, we don't need the state and code verfier values anymore.
    const storage = window.sessionStorage;
    storage.clear();
};

export { setJwt };
