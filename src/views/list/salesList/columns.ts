import { h } from 'vue';
import { NAvatar, NTag } from 'naive-ui';
import { BasicColumn } from '@/components/Table';
export interface ListData {
  id: number;
  name: string;
  sex: string;
  avatar: string;
  email: string;
  city: string;
  status: string;
  type: string;
  createDate: string;
}

// const sexMap = {
//   male: '男',
//   female: '女',
//   unknown: '未知',
// };

const statusMap = {
  close: '입금완료',
  refuse: '입금대기',
  pass: '판매완료',
};

export const columns: BasicColumn<ListData>[] = [
  {
    title: '인보이스 번호',
    key: 'id',
  },
  {
    title: '고객명',
    key: 'name',
  },
  {
    title: '담당자명',
    key: 'name',
  },
  {
    title: '제품명',
    key: 'name',
  },
  {
    title: '판매수량',
    key: 'email',
  },
  {
    title: '판매단가',
    key: 'city',
  },
  {
    title: '총 판매 금액(달러)',
    key: 'city',
  },
  {
    title: '총 판매 금액(원화)',
    key: 'city',
  },
  {
    title: '판매일',
    key: 'createDate',
  },
  {
    title: '입금일',
    key: 'createDate',
  },
  {
    title: '상태',
    key: 'status',
    render(record) {
      return h(
        NTag,
        {
          type:
            record.status === 'close'
              ? 'default'
              : record.status === 'refuse'
              ? 'error'
              : 'success',
        },
        {
          default: () => statusMap[record.status],
        }
      );
    },
  },
];
