import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { SettingOutlined } from '@vicons/antd';
import { renderIcon } from '@/utils/index';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/product',
    name: 'Product',
    redirect: '/product/registration',
    component: Layout,
    meta: {
      title: '제품관리',
      icon: renderIcon(SettingOutlined),
      sort: 5,
    },
    children: [
      {
        path: 'registration',
        name: 'product-registration',
        meta: {
          title: '제품 등록',
        },
        component: () => import('@/views/product-management/registration/registration.vue'),
      },
      {
        path: 'products',
        name: 'products',
        meta: {
          title: '제품 목록',
        },
        component: () => import('@/views/product-management/productList/products.vue'),
      },
    ],
  },
];

export default routes;
