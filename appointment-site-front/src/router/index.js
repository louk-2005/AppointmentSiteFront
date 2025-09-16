import { createRouter, createWebHistory } from "vue-router"

const Home = () => import("../pages/home/home.vue")
const AboutUs = () => import("../pages/aboutUs/aboutUs.vue")
const ContactUs = () => import("../pages/contactUs/contactUs.vue")
const Services = () => import("../pages/services/services.vue")



const routes = [
    { path: "/", name: "Home", component: Home },
    { path: "/about", name: "About", component: AboutUs },
    {path: '/contact', name: "ContactUs", component: ContactUs},
    {path: '/services', name: "Services", component: Services}

]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        }
        return { top: 0 }
    }
})

export default router
