<template>
  <n-card :bordered="false">
    <BasicForm @register="register" @submit="handleSubmit" @reset="handleReset">
      <template #statusSlot="{ model, field }">
        <n-input v-model:value="model[field]" />
      </template>
    </BasicForm>
  </n-card>
  <n-card :bordered="false" class="mt-3">
    <BasicTable
      :columns="columns"
      :request="loadDataTable"
      :row-key="(row:ListData) => row.id"
      ref="actionRef"
      :actionColumn="actionColumn"
      @edit-end="editEnd"
      @edit-change="onEditChange"
      @update:checked-row-keys="onCheckedRow"
      :scroll-x="1090"
      :striped="true"
    >
      <template #tableTitle>
        <n-button type="primary" @click="addTable">
          <template #icon>
            <n-icon>
              <PlusOutlined />
            </n-icon>
          </template>
          인보이스 등록
        </n-button>
      </template>

      <template #toolbar> </template>
    </BasicTable>

    <n-modal v-model:show="showModal" :show-icon="false" preset="dialog" title="매출 등록">
      <n-form
        :model="formParams"
        :rules="rules"
        ref="formRef"
        label-placement="left"
        :label-width="120"
        class="py-4"
      >
        <n-form-item label="인보이스 번호" path="invoiceNo">
          <n-input placeholder="MING20250107" v-model:value="formParams.invoiceNo" />
        </n-form-item>
        <n-form-item label="고객명" path="customer">
          <n-select
            :options="customerList"
            placeholder="고객을 선택하세요."
            v-model:value="formParams.customer"
            filterable
          />
        </n-form-item>
        <n-form-item label="제품명" path="product">
          <n-select
            :options="productList"
            placeholder="제품을 선택하세요."
            v-model:value="formParams.product"
            filterable
          />
        </n-form-item>
        <n-form-item label="통화" path="currency">
          <n-radio-group v-model:value="formParams.currency">
            <n-radio-button
              v-for="cur in currency"
              :key="cur.value"
              :value="cur.value"
              :label="cur.label"
            />
          </n-radio-group>
        </n-form-item>
        <n-form-item label="판매수량" path="quantity">
          <n-input-number
            placeholder="수량을 입력하세요."
            v-model:value="formParams.quantity"
            clearable
          />
        </n-form-item>
        <n-form-item label="판매단가" path="unitPrice">
          <n-input-number placeholder="판매단가를 입력하세요." v-model:value="formParams.unitPrice">
            <template #prefix>{{ currencyPrefix }}</template>
          </n-input-number>
        </n-form-item>
        <n-form-item label="판매일" path="date">
          <n-date-picker
            type="datetime"
            placeholder="날짜를 선택하세요."
            v-model:value="formParams.date"
          />
        </n-form-item>
      </n-form>

      <template #action>
        <n-space style="margin-right: auto">
          <n-upload
            action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f"
            @before-upload="beforeUpload"
          >
            <n-button type="error">엑셀 업로드</n-button>
          </n-upload>
        </n-space>
        <n-space>
          <n-button @click="() => (showModal = false)">취소</n-button>
          <n-button type="info" :loading="formBtnLoading" @click="confirmForm">등록</n-button>
        </n-space>
      </template>
    </n-modal>
  </n-card>
</template>

<script lang="ts" setup>
  import { computed, h, reactive, ref } from 'vue';
  import { BasicTable, TableAction } from '@/components/Table';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { getTableList } from '@/api/table/list';
  import { columns, ListData } from './columns';
  import { PlusOutlined } from '@vicons/antd';
  import { useRouter } from 'vue-router';
  import { type FormRules } from 'naive-ui';

  const currentEditKeyRef = ref('');

  const currency = [
    { value: 'KRW', label: '원', symbol: '₩' },
    { value: 'USD', label: '달러', symbol: '$' },
    { value: 'EUR', label: '유로', symbol: '€' },
    { value: 'GBP', label: '파운드', symbol: '£' },
  ];

  const currencyPrefix = computed(() => {
    const selectedCurrency = currency.find((cur) => cur.value === formParams.currency);
    return selectedCurrency ? selectedCurrency.symbol : '₩';
  });

  const customerList = [
    {
      label: '고객1',
      value: 1,
    },
    {
      label: '고객2',
      value: 2,
    },
    {
      label: '고객3',
      value: 3,
    },
  ];

  const productList = [
    {
      label: '제품1',
      value: 1,
    },
    {
      label: '제품2',
      value: 2,
    },
    {
      label: '제품3',
      value: 3,
    },
  ];

  const rules: FormRules = {
    invoiceNo: {
      required: true,
      trigger: ['blur', 'input'],
      message: '인보이스 번호를 입력하세요.',
    },
    customer: {
      required: true,
      trigger: ['blur', 'change'],
      message: '고객명을 선택하세요.',
    },
    product: {
      type: 'number',
      required: true,
      trigger: ['blur', 'change'],
      message: '제품을 선택하세요.',
    },
    currency: {
      required: true,
      trigger: ['blur', 'change'],
      message: '결제 통화를 선택하세요.',
    },
    quantity: {
      type: 'number',
      required: true,
      trigger: ['blur', 'input'],
      message: '수량을 입력하세요.',
    },
    unitPrice: {
      type: 'number',
      required: true,
      trigger: ['blur', 'input'],
      message: '단가를 입력하세요.',
    },
    date: {
      type: 'number',
      required: true,
      trigger: ['blur', 'change'],
      message: '판매일을 입력하세요.',
    },
  };

  const schemas: FormSchema[] = [
    {
      field: 'name',
      // labelMessage: '这是一个提示',
      component: 'NInput',
      label: '고객명',
      componentProps: {
        placeholder: '고객명을 입력하세요.',
        // placeholder: '请输入姓名',
        // onInput: (e: any) => {
        //   console.log(e);
        // },
      },
      // rules: [{ required: true, message: '请输入姓名', trigger: ['blur'] }],
    },
    {
      field: 'type',
      component: 'NSelect',
      label: '제품명',
      componentProps: {
        filterable: true,
        placeholder: '유형을 선택하세요.',
        options: [
          {
            label: '상품1',
            value: 1,
          },
          {
            label: '상품2',
            value: 2,
          },
        ],
        onUpdateValue: (e: any) => {
          console.log(e);
        },
      },
    },
    {
      field: 'makeDate',
      component: 'NDatePicker',
      label: '판매일',
      defaultValue: new Date(),
      componentProps: {
        type: 'daterange',
        clearable: true,
        onUpdateValue: (e: any) => {
          console.log(e);
        },
      },
    },
    // {
    //   field: 'makeTime',
    //   component: 'NTimePicker',
    //   label: '停留时间',
    //   componentProps: {
    //     clearable: true,
    //     onUpdateValue: (e: any) => {
    //       console.log(e);
    //     },
    //   },
    // },
    // {
    //   field: 'status',
    //   label: '状态',
    //   //插槽
    //   slot: 'statusSlot',
    // },
    // {
    //   field: 'makeProject',
    //   component: 'NCheckbox',
    //   label: '预约项目',
    //   componentProps: {
    //     placeholder: '请选择预约项目',
    //     options: [
    //       {
    //         label: '种牙',
    //         value: 1,
    //       },
    //       {
    //         label: '补牙',
    //         value: 2,
    //       },
    //       {
    //         label: '根管',
    //         value: 3,
    //       },
    //     ],
    //     onUpdateChecked: (e: any) => {
    //       console.log(e);
    //     },
    //   },
    // },
    {
      field: 'makeSource',
      component: 'NRadioGroup',
      label: '고객유형',
      componentProps: {
        defaultValue: 1,
        options: [
          {
            label: '전체',
            value: 1,
          },
          {
            label: '신규',
            value: 2,
          },
        ],
        onUpdateChecked: (e: any) => {
          console.log(e);
        },
      },
    },
  ];

  const router = useRouter();
  const formRef: any = ref(null);
  const actionRef = ref();

  const showModal = ref(false);
  const formBtnLoading = ref(false);
  const formParams = reactive({
    invoiceNo: '',
    customer: null,
    product: null,
    currency: null,
    quantity: '',
    unitPrice: '',
    date: null,
  });

  // const actionColumn = reactive({
  //   width: 150,
  //   title: '액션',
  //   key: 'action',
  //   fixed: 'right',
  //   render(record) {
  //     return h(TableAction as any, {
  //       style: 'button',
  //       actions: [
  //         {
  //           label: '대기중',
  //           onClick: handleDelete.bind(null, record),
  //           ifShow: () => {
  //             return true;
  //           },
  //           auth: ['basic_list'],
  //         },
  //         {
  //           label: '완료',
  //           onClick: handleEdit.bind(null, record),
  //           ifShow: () => {
  //             return true;
  //           },
  //           auth: ['basic_list'],
  //         },
  //       ],
  //     });
  //   },
  // });

  const actionColumn = reactive({
    width: 150,
    title: '액션',
    key: 'action',
    fixed: 'right',
    align: 'center',
    render(record) {
      return h(TableAction, {
        style: 'button',
        actions: createActions(record),
      });
    },
  });

  function createActions(record) {
    if (!record.editable) {
      return [
        {
          label: '편집',
          onClick: handleEdit.bind(null, record),
        },
      ];
    } else {
      return [
        {
          label: '저장',
          onClick: handleSave.bind(null, record),
        },
        {
          label: '취소',
          onClick: handleCancel.bind(null, record),
        },
      ];
    }
  }

  async function handleSave(record) {
    console.log('handleSave::: ', record);
    const pass = await record.onEdit?.(false, true);
    if (pass) {
      currentEditKeyRef.value = '';
    }
  }

  function handleCancel(record) {
    currentEditKeyRef.value = '';
    record.onEdit?.(false, false);
  }

  const [register, { getFieldsValue }] = useForm({
    gridProps: { cols: '1 s:1 m:2 l:3 xl:4 2xl:4' },
    labelWidth: 100,
    schemas,
  });

  function addTable() {
    showModal.value = true;
  }

  const loadDataTable = async (res) => {
    return await getTableList({ ...getFieldsValue(), ...res });
  };

  function onCheckedRow(rowKeys) {
    console.log(rowKeys);
  }

  function reloadTable() {
    actionRef.value.reload();
  }

  function confirmForm(e) {
    e.preventDefault();
    formBtnLoading.value = true;
    formRef.value.validate((errors) => {
      if (!errors) {
        window['$message'].success('新建成功');
        setTimeout(() => {
          showModal.value = false;
          reloadTable();
        });
      } else {
        window['$message'].error('请填写完整信息');
      }
      formBtnLoading.value = false;
    });
  }

  // function handleEdit(record: Recordable) {
  //   console.log('点击了编辑', record);
  //   router.push({ name: 'basic-info', params: { id: record.id } });
  // }

  function handleEdit(record) {
    currentEditKeyRef.value = record.key;
    record.onEdit?.(true);
  }

  function handleDelete(record: Recordable) {
    console.log('点击了删除', record);
    window['$message'].info('点击了删除');
  }

  function handleSubmit(values: Recordable) {
    console.log(values);
    reloadTable();
  }

  function handleReset(values: Recordable) {
    console.log(values);
  }

  function editEnd({ value }) {
    console.log('editEnd::: ',value);
  }

  function onEditChange({ column, value, record }) {
    if (column.key === 'id') {
      record.editValueRefs.name4.value = `${value}`;
    }
    console.log(column);
    console.log('value::', value);
    console.log('record::', record);

    // 변경된 record를 저장해야함

  }
</script>

<style lang="less" scoped></style>
