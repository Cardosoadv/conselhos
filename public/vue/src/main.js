import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap'
import './/assets/dist/css/adminlte.css'
import './/assets/dist/plugins/icheck-bootstrap/icheck-bootstrap.min.css'
import './/assets/dist/plugins/jqvmap/jqvmap.min.css'
import './/assets/dist/plugins/overlayScrollbars/css/OverlayScrollbars.min.css'
import './/assets/dist/plugins/fontawesome-free/css/all.min.css'
import './/assets/dist/plugins/ionicons/css/ionicons.min.css'


import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

createApp(App).use(router).mount('#app')

import 'bootstrap/dist/js/bootstrap.js'
import 'jquery/dist/jquery.js'
import 'jquery'
import 'jquery-ui/dist/jquery-ui.js'
import 'jquery-ui'
import './/assets/dist/js/adminlte.js'
import './/assets/dist/plugins/overlayScrollbars/js/jquery.overlayScrollbars.min.js'