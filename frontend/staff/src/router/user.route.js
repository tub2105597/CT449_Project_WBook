import UserPage from "@/views/UserPage.vue";
import UserList from "@/components/user/UserList.vue";
import UserEdit from "@/components/user/UserEdit.vue";
import UserAdd from "@/components/user/UserAdd.vue";

export default {
    path: "/user",
    name: 'user-page',
    component: UserPage,
    children: [
        {
            path: "",
            name: 'user-list',
            component: UserList
        },
        {
            path: "add",
            name: 'user-add',
            component: UserAdd
        },
        {
            path: "edit/:id",
            name: 'user-edit',
            component: UserEdit
        }
    ]
}