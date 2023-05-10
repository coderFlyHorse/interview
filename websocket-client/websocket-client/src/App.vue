<template>
  <div>
    <button @click="sendMsg"></button>
  </div>
</template>

<script setup>
import Ws from './Ws.js';
let ws = null

const init = async () => {
  ws = await new Ws.create('ws://localhost:8000');
}
const sendMsg = () => {
  if (ws) {
    ws.sendMsg({
      mode: "MESSAGE",
      msg: "Hello, Websocket"
    });
  }
}
init()
</script>

<style></style>
