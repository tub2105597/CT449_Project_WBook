import StaffPage from "@/views/StaffPage.vue";
import StaffList from "@/components/staff/StaffList.vue";
import StaffEdit from "@/components/staff/StaffEdit.vue";
import StaffAdd from "@/components/staff/StaffAdd.vue";

export default {
    path: '/staff',
    name: 'staff-page',
    component: StaffPage,
    meta: {
        requiresAuth: true,
    },
    children: [
        {
            path: '',
            name: 'staff-list',
            component: StaffList,
        },
        {
            path: 'add',
            name: 'staff-add',
            component: StaffAdd,
        },
        {
            path: 'edit/:id',
            name: 'staff-edit',
            component: StaffEdit,
        }
    ],
};