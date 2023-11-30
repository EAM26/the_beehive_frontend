import {jwtDecode} from "jwt-decode";

export function checkTokenValidity(jwt) {
    const decodedToken = jwtDecode(jwt);
    return (Date.now()) < decodedToken.exp * 1000;
}

