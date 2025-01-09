import { BasicColumn } from '@/components/Table';
export interface ListData {
  customerId: number;
  customerName: string;
  employeeName: string;
  countryName: string;
  customerType: string;
  createDate: string;
  comment: string;
}

export const columns: BasicColumn<ListData>[] = [
  {
    title: '고객번호',
    key: 'customerId',
  },
  {
    title: '고객명',
    key: 'customerName',
    editComponent: 'NInput',
    editRow: true,
    editRule: true,
    edit: true,
  },
  {
    title: '담당자명',
    key: 'employeeName',
    editComponent: 'NInput',
    editRow: true,
    editRule: true,
    edit: true,
  },
  {
    title: '국가명',
    key: 'countryName',
  },
  {
    title: '고객유형',
    key: 'customerType',
  },
  {
    title: '등록일',
    key: 'createDate',
    editComponent: 'NDatePicker',
    editRow: true,
    edit: true,
  },
  {
    title: '비고',
    key: 'comment',
  },
];
