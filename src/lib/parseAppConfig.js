// Parse the data
function parseAppConfig(data) {

    // Start with parsing the sysadmin url
    const sysAdminApiUrl = new URL(data.ROLES.SYS_ADMIN.API_URI);

    // Extract the stage from the sysadmin path
    const apiStage = sysAdminApiUrl.pathname.split('/')[1];

    // Use the sysadmin redirect uri as the domain hostname (but strip the last slash).
    const appHostname = data.ROLES.SYS_ADMIN.REDIRECT_URI.replace(/\/$/, '');

    // Get the sysadmin api host.
    const sysAdminApiHost = sysAdminApiUrl.hostname;

    // Parse the entity admin api host.
    const entityAdminApiUrl = new URL(data.ROLES.RE_ADMIN.API_URI);
    const entityAdminApiHost = entityAdminApiUrl.hostname;

    // Parse the Authorized API host.
    const authorizedApiUrl = new URL(data.ROLES.RE_AUTH_IND.API_URI);
    const authorizedApiHost = authorizedApiUrl.hostname;

    // Parse the Consenting Person API host.
    const consentingApiUrl = new URL(data.ROLES.CONSENTING_PERSON.API_URI);
    const consentingApiHost = consentingApiUrl.hostname;

    // Parse the entity registration api host.
    const entityRegistrationApiUrl = new URL(data.REGISTER_ENTITY_API_URI);
    const entityRegistrationApiHost = entityRegistrationApiUrl.hostname;

    // Parse the consenting person registration api host.
    const consentingRegistrationApiUrl = new URL(data.REGISTER_CONSENTER_API_URI);
    const consentingRegistrationApiHost = consentingRegistrationApiUrl.hostname;

    // Assemble the parsed data.
    const parsedData = {
        appHostname: appHostname,
        cognitoDomain: data.COGNITO_DOMAIN,
        apiStage: apiStage,
        sysadmin: {
            cognitoID: data.ROLES.SYS_ADMIN.CLIENT_ID,
            apiHost: `https://${sysAdminApiHost}`,
        },
        entityAdmin: {
            cognitoID: data.ROLES.RE_ADMIN.CLIENT_ID,
            apiHost: `https://${entityAdminApiHost}`,
        },
        authorizedIndividual: {
            cognitoID: data.ROLES.RE_AUTH_IND.CLIENT_ID,
            apiHost: `https://${authorizedApiHost}`,
        },
        consentingPerson: {
            cognitoID: data.ROLES.CONSENTING_PERSON.CLIENT_ID,
            apiHost: `https://${consentingApiHost}`,
        },
        registerEntityApiHost: `https://${entityRegistrationApiHost}`,
        registerConsenterHost: `https://${consentingRegistrationApiHost}`,
    };

    return parsedData;
}

export { parseAppConfig };
