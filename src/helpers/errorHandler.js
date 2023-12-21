export function errorHandler(e) {
    try {
        const {status, data} = e.response
        switch (status) {
            case 401:
                if (data.includes("Incorrect username or password")) {
                    return "Ongeldige combinatie gebruikersnaam en wachtwoord."
                }
                break;
                case 403:
                    return "Onjuiste autorisatie."
            default:
                return "Onbekende fout"
        }
    } catch (e) {
        return "Onbekende fout"
    }

}