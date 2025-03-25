import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/stores/user.store";

//Routes

//Another components
import HomePage from "@/views/HomePage.vue";
import LoginPage from "@/views/auth/LoginPage.vue";
import ProfilePage from "@/views/ProfilePage.vue";

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
    {
        path: "/profile",
        name: "profile-page",
        component: ProfilePage,
        meta: {
            requiresAuth: true,
        }
    },
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
    const isLogin = localStorage.getItem("bookgo-user-isLogin");

    // Nếu đã đăng nhập và cố truy cập trang login -> Chuyển hướng về home
    if (to.meta.authRoute && isLogin) {
        await store.login(); // Cập nhật trạng thái auth
        if (store.isAuth) {
            return { name: "home-page" };
        }
    }

    if (to.meta.requiresAuth && !isLogin) {
        return { name: "login-page" };
    }

    if (to.meta.requiresAuth && isLogin) {
        return;
    }

    return true;
});



export default router;