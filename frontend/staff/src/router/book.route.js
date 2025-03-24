import BookPage from "@/views/BookPage.vue";
import BookList from "@/components/book/BookList.vue";
import BookEdit from "@/components/book/BookEdit.vue";
import BookAdd from "@/components/book/BookAdd.vue";
import BookDelete from "@/components/book/BookDelete.vue";

export default {
    path: '/book',
    name: 'book-page',
    component: BookPage,
    children: [
        {
            path: '',
            name: 'book-list',
            component: BookList
        },
        {
            path: 'add',
            name: 'book-add',
            component: BookAdd
        },
        {
            path: 'edit/:id',
            name: 'book-edit',
            component: BookEdit
        },
        {
            path: 'delete/:id',
            name: 'book-delete',
            component: BookDelete
        },
    ]
}