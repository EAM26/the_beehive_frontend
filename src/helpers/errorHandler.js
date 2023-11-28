export function errorHandler(e) {
    if(e.message === 'Network Error') {
        return "Kan geen verbinding maken."
    }
    const {status, data} = e.response
    switch (status) {
        case 401:
            if (data.includes("Incorrect username or password")) {
                return "Ongeldige combinatie gebruikersnaam en wachtwoord."
            }
            break;
        default:
            return "Onbekende fout"
    }
}