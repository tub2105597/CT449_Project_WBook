import AuthorPage from "@/views/AuthorPage.vue";
import AuthorList from "@/components/author/AuthorList.vue";
import AuthorEdit from "@/components/author/AuthorEdit.vue";
import AuthorAdd from "@/components/author/AuthorAdd.vue";
import AuthorDelete from "@/components/author/AuthorDelete.vue";

export default {
    path: "/author",
    name: "author-page",
    component: AuthorPage,
    children: [
        {
            path: '',
            name: 'author-list',
            component: AuthorList
        },
        {
            path: 'add',
            name: 'author-add',
            component: AuthorAdd
        },
        {
            path: 'edit/:id',
            name: 'author-edit',
            component: AuthorEdit
        },
        {
            path: 'delete/:id',
            name: 'author-delete',
            component: AuthorDelete
        }
    ]
};