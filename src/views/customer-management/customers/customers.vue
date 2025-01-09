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
      :row-key="(row:ListData) => row.customerId"
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
          고객 등록
        </n-button>
      </template>

      <template #toolbar> </template>
    </BasicTable>

    <n-modal v-model:show="showModal" :show-icon="false" preset="dialog" title="고객 등록">
      <n-form
        :model="formParams"
        :rules="rules"
        ref="formRef"
        label-placement="left"
        :label-width="120"
        class="py-4"
      >
        <n-form-item label="고객명" path="customerName">
          <n-input placeholder="MING20250107" v-model:value="formParams.customerName" />
        </n-form-item>

        <n-form-item label="국가" path="customer">
          <n-select
            :options="countryList"
            placeholder="국가를 선택하세요."
            v-model:value="formParams.customer"
            filterable
          />
        </n-form-item>

        <n-form-item label="담당자" path="product">
          <n-select
            :options="productList"
            placeholder="제품을 선택하세요."
            v-model:value="formParams.product"
            filterable
          />
        </n-form-item>

        <n-form-item label="등록일" path="date">
          <n-date-picker
            type="datetime"
            placeholder="날짜를 선택하세요."
            v-model:value="formParams.date"
          />
        </n-form-item>
      </n-form>

      <template #action>
<!--        <n-space style="margin-right: auto">-->
<!--          <n-upload-->
<!--            action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f"-->
<!--            @before-upload="beforeUpload"-->
<!--          >-->
<!--            <n-button type="error">엑셀 업로드</n-button>-->
<!--          </n-upload>-->
<!--        </n-space>-->
        <n-space>
          <n-button @click="() => (showModal = false)">취소</n-button>
          <n-button type="info" :loading="formBtnLoading" @click="confirmForm">등록</n-button>
        </n-space>
      </template>
    </n-modal>
  </n-card>
</template>

<script lang="ts" setup>
  import { computed, h, onMounted, reactive, ref } from 'vue';
  import { BasicTable, TableAction } from '@/components/Table';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { getTableList } from '@/api/table/list';
  import { columns, ListData } from './columns';
  import { PlusOutlined } from '@vicons/antd';
  import { useRouter } from 'vue-router';
  import { type FormRules } from 'naive-ui';
  import { Alova } from '@/utils/http/alova';

  const currentEditKeyRef = ref('');

  // 국가명 리스트
  const countryList = ref<Array<{ label: string; value: string }>>([]);
  const loading = ref(false); // 로딩 상태

  const fetchCustomerList = async () => {
    loading.value = true;
    try {
      const response: any = await Alova.Get('https://restcountries.com/v3.1/all', {
        meta: {
          isReturnNativeResponse: true,
        },
      });
      // 국가명을 정렬하여 셀렉트 옵션 구성
      countryList.value = response
        .map((country) => ({
          label: country.translations?.kor?.common || country.name.common, // 한국어 이름
          value: country.cca2, // 국가 코드
        }))
        .sort((a, b) => a.label.localeCompare(b.label));
    } catch (error) {
      console.error('국가명 리스트를 가져오는 중 오류가 발생했습니다:', error);
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    fetchCustomerList();
  });

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
    customerName: {
      required: true,
      trigger: ['blur', 'input'],
      message: '고객명을 입력하세요.',
    },
    countryName: {
      required: true,
      trigger: ['blur', 'change'],
      message: '국가명을 선택하세요.',
    },
    employeeName: {
      type: 'number',
      required: true,
      trigger: ['blur', 'change'],
      message: '직원명을 선택하세요.',
    },
    createdDt: {
      required: true,
      trigger: ['blur', 'change'],
      message: '결제 통화를 선택하세요.',
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
    customerName: null,
    countryName: null,
    employeeName: null,
    createDate: null,
  });

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
    console.log('editEnd::: ', value);
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
