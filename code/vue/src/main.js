import './assets/main.css';

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'
import App from './App.vue'
import router from './router'
import { io } from "socket.io-client"

axios.defaults.baseURL = 'http://web-dad-group-1-172.22.21.101.sslip.io/api'

const app = createApp(App);
app.provide('socket', io("http://web-dad-group-1-172.22.21.101.sslip.io:8081"))

const pinia = createPinia()

app.use(router);
app.use(pinia)

app.mount('#app')
