import PublisherPage from "@/views/PublisherPage.vue";
import PublisherList from "@/components/publisher/PublisherList.vue";
import PublisherEdit from "@/components/publisher/PublisherEdit.vue";
import PublisherAdd from "@/components/publisher/PublisherAdd.vue";
import PublisherDelete from "@/components/publisher/PublisherDelete.vue";

export default {
    path: "/publisher",
    name: "publisher-page",
    component: PublisherPage,
    children: [
        {
            path: "",
            name: "publisher-list",
            component: PublisherList,
        },
        {
            path: "add",
            name: "publisher-add",
            component: PublisherAdd,
        },
        {
            path: "edit/:id",
            name: "publisher-edit",
            component: PublisherEdit,
        },
        {
            path: "delete/:id",
            name: "publisher-delete",
            component: PublisherDelete,
        }
    ],
};