import StatusPage from "@/views/StatusPage.vue";
import StatusList from "@/components/status/StatusList.vue";
import StatusEdit from "@/components/status/StatusEdit.vue";
import StatusAdd from "@/components/status/StatusAdd.vue";

export default {
    path: "/status",
    name: "status-page",
    component: StatusPage,
    children: [
        {
            path: '',
            name: 'status-list',
            component: StatusList
        },
        {
            path: 'add',
            name: 'status-add',
            component: StatusAdd
        },
        {
            path: 'edit/:id',
            name: 'status-edit',
            component: StatusEdit
        }
    ]
};