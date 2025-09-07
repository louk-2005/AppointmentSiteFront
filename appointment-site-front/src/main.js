import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'
import 'leaflet/dist/leaflet.css';

// FontAwesome
import {library} from '@fortawesome/fontawesome-svg-core'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import {
    faUser,
    faCoffee,
    faSearch,
    faSearchPlus,
    faMap,
    faEnvelope,
    faPhone,
    faHome,
    faMapMarkerAlt,
    faXmark,
    faStar,
    faEye,
    faEyeSlash,
    faCartShopping,
    faTrash,
    faChevronLeft,
    faChevronRight
} from '@fortawesome/free-solid-svg-icons'

import {
    faTelegram,
    faFacebook,
    faWhatsapp,
    faInstagram,
    faTwitter,
    faTelegramPlane
} from '@fortawesome/free-brands-svg-icons'

library.add(
    faSearch,
    faUser,
    faCoffee,
    faSearch,
    faSearchPlus,
    faMap,
    faEnvelope,
    faPhone,
    faHome,
    faMapMarkerAlt,
    faXmark,
    faStar,
    faEye,
    faEyeSlash,
    faCartShopping,
    faTrash,
    faTelegram,
    faFacebook,
    faWhatsapp,
    faInstagram,
    faTwitter,
    faTelegramPlane,
    faChevronLeft,
    faChevronRight,


)

const app = createApp(App)

app.use(router)

app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')
