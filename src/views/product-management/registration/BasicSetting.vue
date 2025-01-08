<template>
  <n-grid cols="2 s:2 m:2 l:3 xl:3 2xl:3" responsive="screen">
    <n-grid-item>
      <n-form :label-width="80" :model="formValue" :rules="rules" ref="formRef">

        <n-form-item label="제품명" path="productName">
          <n-input v-model:value="formValue.productName" placeholder="제품명을 입력하세요." />
        </n-form-item>

        <n-form-item label="기본 단가" path="standardPrice">
          <n-input-number
            tooltip="기본 단가를 입력하세요."
            placeholder="기본 단가를 입력하세요."
            v-model:value="formValue.standardPrice"
            clearable
          />
        </n-form-item>

        <n-form-item label="자사제품 여부" path="ourProducts">
          <n-radio-group v-model:value="formValue.ourProducts" name="ourProducts">
            <n-space>
              <n-radio :value="1">자사</n-radio>
              <n-radio :value="0">타사</n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>

        <n-form-item label="비고" path="comment">
          <n-input v-model:value="formValue.comment" type="textarea" placeholder="특이사항을 작성해주세요." />
        </n-form-item>

        <div>
          <n-space>
            <n-button type="primary" @click="formSubmit">제품 등록</n-button>
          </n-space>
        </div>
      </n-form>
    </n-grid-item>
  </n-grid>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { useMessage } from 'naive-ui';

  const rules = {
    productName: {
      required: true,
      message: '제품명을 입력하세요.',
      trigger: 'blur',
    },
    standardPrice: {
      required: false,
      message: '단가를 입력하세요.',
      trigger: 'blur',
    },
    ourProducts: {
      required: true,
      trigger: 'input',
    },
    comment: {
      required: false,
      trigger: 'input',
    },
  };
  const formRef: any = ref(null);
  const message = useMessage();

  const formValue = reactive({
    productName: '',
    standardPrice: '',
    ourProducts: '',
    comment: '',
  });

  function formSubmit() {
    formRef.value.validate((errors) => {
      if (!errors) {
        message.success('验证成功');
      } else {
        message.error('验证失败，请填写完整信息');
      }
    });
  }
</script>
