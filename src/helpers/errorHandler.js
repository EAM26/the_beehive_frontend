export function errorHandler(e) {
    if(!e.response) {
        return "Unknown error"
    }

    const {status, data} = e.response
    console.log("The length of the message is "+data.length)
    console.log("The length of the message is "+data.length)
    console.log("The length of the message is "+data.length)
        return ("Failed attempt:  " + data)
}