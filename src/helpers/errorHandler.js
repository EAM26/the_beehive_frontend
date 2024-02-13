export function errorHandler(e) {
    const {status, data} = e.response
    // try {
    //     switch (status) {
    //         case 401:
    //             if (data.includes("Incorrect username or password")) {
    //                 return "Ongeldige combinatie gebruikersnaam en wachtwoord."
    //             }
    //             break;
    //             case 403:
    //                 return "Onjuiste autorisatie."
    //         default:
    //             return data
    //     }
    // } catch (e) {
    //     return e.data
    // }
        return data
}