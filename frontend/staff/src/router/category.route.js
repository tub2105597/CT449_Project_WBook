import CategoryPage from '@/views/CategoryPage.vue';
import CategoryList from '@/components/category/CategoryList.vue';
import CategoryAdd from '@/components/category/CategoryAdd.vue';
import CategoryEdit from '@/components/category/CategoryEdit.vue';
import CategoryDelete from '@/components/category/CategoryDelete.vue';

export default {
    path: '/category',
    name: 'category-page',
    component: CategoryPage,
    children: [
        {
            path: '',
            name: 'category-list',
            component: CategoryList
        },
        {
            path: 'add',
            name: 'category-add',
            component: CategoryAdd
        },
        {
            path: 'edit/:id',
            name: 'category-edit',
            component: CategoryEdit
        },
        {
            path: 'delete/:id',
            name: 'category-delete',
            component: CategoryDelete
        }
    ]
}