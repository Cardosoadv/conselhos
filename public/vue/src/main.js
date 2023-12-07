import '@fontsource/source-sans-3'
import 'overlayscrollbars/overlayscrollbars.css';
import  'bootstrap-icons/font/bootstrap-icons.min.css'
import 'jsvectormap/dist/css/jsvectormap.min.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/dist/css/adminlte.min.css'


import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

createApp(App).use(router).mount('#app')

import 'overlayscrollbars/browser/overlayscrollbars.browser.es6.js'
import './assets/dist/plugins/popper.min'
import 'bootstrap/dist/js/bootstrap.js'
import './assets/dist/js/adminlte.js'
import './assets/dist/plugins/Sortable.min.js'
import './assets/dist/plugins/apexcharts.min.js';
