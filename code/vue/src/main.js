import './assets/main.css';

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'
import App from './App.vue'
import router from './router'
import { io } from "socket.io-client"

axios.defaults.baseURL = 'http://api-dad-group-1-172.22.21.101.sslip.io/api'

const app = createApp(App);
app.provide('socket', io("http://ws-dad-group-1-172.22.21.101.sslip.io"))

const pinia = createPinia()

app.use(router);
app.use(pinia)

app.mount('#app')
