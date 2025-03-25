import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/stores/user.store";

//Routes
import userRoute from "@/router/user.route.js";
import categoryRoute from "@/router/category.route.js";
import publisherRoute from "@/router/publisher.route.js";
import authorRoute from "@/router/author.route.js";
import bookRoute from "@/router/book.route.js";
import statusRoute from "@/router/status.route.js";
import staffRoute from "./staff.route";

//Another components
import HomePage from "@/views/HomePage.vue";
import LoginPage from "@/views/LoginPage.vue";

const routes = [
    {
        path: "/login",
        name: "login-page",
        component: LoginPage,
        meta: {
            authRoute: true,
        }
    },
    {
        path: "/home",
        alias: "/",
        name: "home-page",
        component: HomePage,
        meta: {
            requiresAuth: true,
        }
    },
    userRoute,
    categoryRoute,
    publisherRoute,
    authorRoute,
    bookRoute,
    statusRoute,
    staffRoute,
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        return { top: 0 };
    },
});

// Kiểm tra đăng nhập
router.beforeEach(async (to, from) => {
    const store = useUserStore();
    const isLogin = localStorage.getItem("bookgo-staff-isLogin");

    // Nếu đã đăng nhập và cố truy cập trang login -> Chuyển hướng về home
    if (to.meta.authRoute && isLogin) {
        await store.login(); // Cập nhật trạng thái auth
        if (store.isAuth) {
            return { name: "home-page" };
        }
    }

    if (to.meta.requiresAuth && isLogin) {
        return;
    }

    return true;
});



export default router;