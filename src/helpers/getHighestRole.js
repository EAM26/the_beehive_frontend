export function getHighestRole(authorities) {
    if (authorities.some(auth => auth.authority === 'ROLE_ADMIN')) {
        return 'admin'
    } else if (authorities.some(auth => auth.authority === 'ROLE_MANAGER')) {
        return 'manager'
    } else {
        return 'user'
    }

}