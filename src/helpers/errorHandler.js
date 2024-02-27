export function errorHandler(e) {
    if(!e.response) {
        return "Unknown error"
    }

    const {status, data} = e.response

        return ("Failed attempt:  " + data)
}