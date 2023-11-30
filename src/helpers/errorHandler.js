export function errorHandler(e) {

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