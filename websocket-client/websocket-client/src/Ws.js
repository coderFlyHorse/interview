const WS_MODE = {
    MESSAGE: "MESSAGE",
    HEARTBEAT: "HEART_BEAT"
}
class Ws extends WebSocket {
    constructor(url, wsReconnect) {
        super(url)
  
        this.wsUrl = url
        this.wsReconnect = wsReconnect
        this.reconnectTimer = null;
        this.reconnectInterval = 5000;
        this.heartBeatTimer = null;
        this.init()
    }

    init() {
        this.bindEvent()
    }

    bindEvent() {
        this.addEventListener("open", this.handleOpen, false)
        this.addEventListener("error", this.handleError, false)
        this.addEventListener("close", this.handleClose, false)
        this.addEventListener("message", this.handleMessage, false)
    }
    handleOpen() {
        console.log("---client is connected---")

        this.startHeartBeat()
    }

    handleError(e) {
        this.onerror = () => {
            new Error(e)
        }
        console.log("---client occured error---", e)

        this.reconnect()
    }
    handleClose() {
        console.log("---client is closed---")
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer)
            this.reconnectTimer = null
        }
        if (this.heartBeatTimer) {
            clearInterval(this.heartBeatTimer)
            this.heartBeatTimer = null
        }
        this.reconnect()
    }
    handleMessage(data) {
        const { mode, msg } = this.receiveMsg(data)
        switch (mode) {
            case WS_MODE.HEART_BEAT:

                console.log("connected", data)
                break;
            case WS_MODE.MESSAGE:
                console.log("--MESSAGE--", msg)
                break;

            default:
                break;
        }
    }

    startHeartBeat() {


        this.heartBeatTimer = setInterval(() => {
            if (this.readyState === 1) {
                this.sendMsg({ mode: WS_MODE.HEARTBEAT, msg: "HEART_BEAT" })
            } else {
                clearInterval(this.heartBeatTimer)
                this.heartBeatTimer = null
            }

            console.log("链接完成后发送心跳信息")
            // this.waitForResponse()
        }, 5000)
    }
    reconnect() {

        this.reconnectTimer = setTimeout(() => {
            this.wsReconnect()
        }, 3000)


    }
    // 等待服务端响应
    // waitForResponse() {

    //     setTimeout(() => {
    //         if (this.connectedStatus) {
    //             return this.startHeartBeat()
    //         }
    //         try {
    //             this.close()
    //         } catch (e) {
    //             console.log("Client is Closed", e)
    //         }
    //     },2000)
    // }
    static create(url) {
        return new Promise(resolve => { resolve(new Ws(url)) })
    }
    receiveMsg({ data }) {
        return JSON.parse(data)
    }
    sendMsg(data) {
        this.readyState==1&&this.send(JSON.stringify(data))
    }

}

export default Ws