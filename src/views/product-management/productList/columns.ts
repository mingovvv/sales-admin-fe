import { BasicColumn } from '@/components/Table';
import { h } from 'vue';
import { NTag } from 'naive-ui';
export interface ListData {
  id: number;
  productName: string;
  standardPrice: number;
  productType: string;
  comment: string;
}

const productTypeMap = {
  aa: '자사제품',
  bb: '타사제품',
};

export const columns: BasicColumn<ListData>[] = [
  {
    title: '제품 ID',
    key: 'id',
  },
  {
    title: '제품명',
    key: 'productName',
    editComponent: 'NInput',
    editRow: true,
    editRule: true,
    edit: true,
  },
  {
    title: '기준가',
    key: 'standardPrice',
    editComponent: 'NInput',
    editRow: true,
    editRule: true,
    edit: true,
  },
  {
    title: '제품 유형',
    key: 'productType',
    render(record) {
      return h(
        NTag,
        {
          type:
            record.productType === 'aa'
              ? 'default'
              : record.productType === 'bb'
              ? 'error'
              : 'success',
        },
        {
          default: () => productTypeMap[record.productType],
        }
      );
    },
    editComponent: 'NSelect',
    editComponentProps: {
      options: [
        {
          label: '자사제품',
          value: 1,
        },
        {
          label: '타사제품',
          value: 2,
        },
      ],
    },
    editRow: true,
    edit: true,
  },
  {
    title: '비고',
    key: 'comment',
    editComponent: 'NInput',
    editRow: true,
    editRule: true,
    edit: true,
  },
];
