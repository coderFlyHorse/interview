const WebSocket = require("ws")
const server = new WebSocket.Server({ port: 8000 })
server.on('connection', handleConnection)
function handleConnection(ws) {
    console.log("Connection")
    ws.on('close', handleClose)
    ws.on('error', handleError)
    ws.on('message', handleMessage)
}

function handleClose() {
    console.log("server close")
    this.send(JSON.stringify({
        mode: "Message",
        msg: "--Server closed"
    }))
}
function handleError(e) {
    console.log("server error" + e)
}
function handleMessage(data) {
    const { mode, msg } = JSON.parse(data)

    switch (mode) {
        case "MESSAGE":
            console.log("User message")
            this.send(JSON.stringify(JSON.parse(data)))
            break;
        case "HEART_BEAT":
            console.log("HEART_BEAT")
            this.send(JSON.stringify(JSON.parse(data)))
            break;

        default:
            break;
    }
}

