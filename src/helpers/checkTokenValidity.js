import {jwtDecode} from "jwt-decode";

function CheckTokenValidity(jwt) {
    const decodedToken = jwtDecode(jwt);
    return (Date.now()) < decodedToken.exp * 1000;
}

export default CheckTokenValidity;