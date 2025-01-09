import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { UserAddOutlined } from '@vicons/antd';
import { renderIcon } from '@/utils/index';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/customer',
    name: 'Customer',
    redirect: '/customer/customers',
    component: Layout,
    meta: {
      title: '고객관리',
      icon: renderIcon(UserAddOutlined),
      sort: 0.92,
    },
    children: [
      {
        path: 'customers',
        name: 'customers',
        meta: {
          title: '고객 관리',
        },
        component: () => import('@/views/customer-management/customers/customers.vue'),
      },
      {
        path: 'customers-histories',
        name: 'customers-histories',
        meta: {
          title: '인수인계 내역',
        },
        component: () => import('@/views/customer-management/customerHistories/customerHist.vue'),
      },
    ],
  },
];

export default routes;
