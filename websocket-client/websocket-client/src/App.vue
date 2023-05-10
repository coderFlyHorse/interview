<template>
  <div>
    <button @click="sendMsg">Connect</button>
  </div>
</template>

<script setup>
import Ws from './Ws.js';

let ws = null


function wsConnect(){
  ws =   Ws.create('ws://localhost:8000',wsReconnect);
}
function wsReconnect(){
  if(!ws){
    return wsConnect()
  }
  if(ws&&ws.reconnectTimer){
    clearTimeout(ws.reconnectTimer);
    ws.reconnectTimer = null
    wsConnect()
  }
}
const sendMsg = () => {
  if (ws) {
    ws.sendMsg({
      mode: "MESSAGE",
      msg: "Hello, Websocket"
    });
  }
}
wsConnect()

</script>

<style></style>
