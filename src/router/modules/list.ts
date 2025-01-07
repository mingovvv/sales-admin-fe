import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { TableOutlined } from '@vicons/antd';
import { renderIcon } from '@/utils/index';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/list',
    name: 'List',
    redirect: '/list/basic-list',
    component: Layout,
    meta: {
      title: '列表页面',
      icon: renderIcon(TableOutlined),
      sort: 2,
    },
    children: [
      {
        path: 'basic-list',
        name: 'basic-list',
        meta: {
          title: '基础列表',
        },
        component: () => import('@/views/list/basicList/index.vue'),
      },
      {
        path: 'basic-info/:id?',
        name: 'basic-info',
        meta: {
          title: '基础详情',
          hidden: true,
          activeMenu: 'basic-list',
        },
        component: () => import('@/views/list/basicList/info.vue'),
      },
    ],
  },
  {
    path: '/list',
    name: 'List',
    redirect: '/list/sales-list',
    component: Layout,
    meta: {
      title: '列表页面',
      icon: renderIcon(TableOutlined),
      sort: 2,
    },
    children: [
      {
        path: 'sales-list',
        name: 'sales-list',
        meta: {
          title: 'Sales',
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
