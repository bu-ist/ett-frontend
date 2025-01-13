function getRoleForScope(scope) {
    // If the space delimited scope string contains any string that starts with RE_ADMIN/ then return 'entity'
    if (scope.split(' ').some( s => s.startsWith('RE_ADMIN/'))) {
        return 'entity';
    }

    // If the space delimited scope string contains any string that starts with RE_AUTH_IND/ then return 'auth-ind'
    if (scope.split(' ').some( s => s.startsWith('RE_AUTH_IND/'))) {
        return 'auth-ind';
    }

    // If the space delimited scope string contains any string that starts with CONSENTING_PERSON/ then return 'consenting'
    if (scope.split(' ').some( s => s.startsWith('CONSENTING_PERSON/'))) {
        return 'consenting';
    }

    // If the space delimited scope string contains any string that starts with SYS_ADMIN/ then return 'sysadmin'
    if (scope.split(' ').some( s => s.startsWith('SYS_ADMIN/'))) {
        return 'sysadmin';
    }

    // If unknown, return null
    return null;
}

export { getRoleForScope };
