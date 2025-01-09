import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { FileSearchOutlined } from '@vicons/antd';
import { renderIcon } from '@/utils/index';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/sales',
    name: '판매관리',
    redirect: '/sales-list',
    component: Layout,
    meta: {
      title: '판매',
      icon: renderIcon(FileSearchOutlined),
      sort: 0.9,
    },
    children: [
      {
        path: 'sales-list',
        name: 'sales-list',
        meta: {
          title: '판매관리',
        },
        component: () => import('@/views/list/salesList/sales.vue'),
      },
      {
        path: 'sales-info/:id?',
        name: 'sales-info',
        meta: {
          title: '基础详情',
          hidden: true,
          activeMenu: 'sales-list',
        },
        component: () => import('@/views/list/salesList/info.vue'),
      },
    ],
  },
];

export default routes;
