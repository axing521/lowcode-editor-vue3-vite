<template>
    <form
        :class="{
            ['fd-form']: true,
            ['top-title']: allProps.props.topTitle,
        }"
        ref="formRef"
        :id="allProps.state.key"
        :style="css"
        @submit.prevent="submitForm"
    >
        <fd-layout :state="allProps.state"></fd-layout>
    </form>
</template>
<script lang="ts">
export default defineComponent({
    name: EnumComponentType.form,
});
</script>
<script lang="ts" setup>
import { provide, ref, getCurrentInstance, defineComponent } from 'vue';
import { useBaseInject, useBaseLifecycle } from '../../composables/base';
import { useFormInject } from '../../composables/form';
import { getFdFormRef, getFdFormFields } from 'tdp-editor-types/src/constant/injectKeys';
import { forms } from 'tdp-editor-common/src/service';
import { funcFactory, propsFactory, utils } from 'tdp-editor-common/src';
import { EnumComponentType } from 'tdp-editor-types/src/enum/components';
import { EnumServiceResultStatus } from 'tdp-editor-types/src/enum/request';
import { EnumAppMode } from 'tdp-editor-types/src/enum';

import type { IServiceResult } from 'tdp-editor-types/src/interface/request';
import type { IFormField } from 'tdp-editor-types/src/interface/app/form';
import type { ICompBaseProps } from 'tdp-editor-types/src/interface/app/components';
import type { IFormProps, IFormState } from './interface';

const allProps = defineProps<ICompBaseProps<IFormProps, IFormState>>();
// 注册公共声明周期事件
useBaseLifecycle(allProps);
const { getAppMode } = useBaseInject();
const { formSubmited } = useFormInject();
// 存储所有字段信息
const formFields: IFormField[] = [];
// form提交数据是否校验通过
const valid = ref(false);
// form实例
const formRef = ref<HTMLFormElement | null>(null);

// 提供全局方法，获取form实例
provide(getFdFormRef, () => {
    return getCurrentInstance()?.proxy;
});
// 提供全局方法，获取form的字段集合
provide(getFdFormFields, () => {
    return formFields;
});

// 提交form表单
const submitForm = async () => {
    if (formRef.value) {
        valid.value = formRef.value.validate();
        if (valid.value) {
            const submitData = {} as any;
            formFields.forEach(f => {
                submitData[f.key] = propsFactory.getPropsValue(f.state, 'value');
            });
            const ff = funcFactory.init();
            const appInfo = ff.getAppInfo();
            let res: IServiceResult;
            if (getAppMode() === EnumAppMode.add) {
                res = await forms.formDataService.addFormData({
                    projectId: appInfo.projectId,
                    appId: appInfo.appId,
                    formId: allProps.props.formId || '',
                    content: submitData,
                });
            } else {
                res = await forms.formDataService.updateFormData({
                    id:
                        utils.$getQueryString('formContentId') ||
                        localStorage.getItem('fd_formContentId') ||
                        '',
                    content: submitData,
                });
            }
            if (res.status === EnumServiceResultStatus.success) {
                formSubmited && formSubmited(true, '');
            } else {
                formSubmited && formSubmited(false, res.message);
            }
        } else {
            formSubmited && formSubmited(false, '验证失败');
        }
    }
};
</script>
<style lang="less">
@import '../../styles/var/index.less';

@prefixName: ~'@{prefix-className}';
.@{prefixName}-form {
    position: relative;
    text-align: left;
    .error--text {
        color: #ff5252 !important;
    }
    .col-submit {
        margin: 12px auto;
        text-align: center;
        button {
            margin-right: 10px;
        }
    }
}
</style>
