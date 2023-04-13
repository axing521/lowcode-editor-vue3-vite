<template>
    <a-modal v-model:visible="visible" title="添加变量" :footer="null" :afterClose="onCloseModal">
        <a-form :model="formData">
            <a-form-item label="变量名">
                <a-input v-model:value="formData.name" />
            </a-form-item>
            <a-form-item label="作用域">
                <a-radio-group v-model:value="formData.scope">
                    <a-radio :value="EnumAppVarScope.Global">全局变量</a-radio>
                    <a-radio :value="EnumAppVarScope.Page">页面变量</a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item label="类型">
                <a-radio-group v-model:value="formData.type">
                    <a-radio :value="EnumAppVarType.Normal">普通</a-radio>
                    <a-radio :value="EnumAppVarType.DataSource">数据</a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item style="text-align: center">
                <a-button type="primary" @click="onCreate">创建</a-button>
                <a-button style="margin-left: 10px">取消</a-button>
            </a-form-item>
        </a-form>
    </a-modal>
</template>
<script setup lang="ts">
import { reactive, ref, watchEffect } from 'vue';
import { EnumAppVarScope, EnumAppVarType } from 'tdp-editor-types/src/enum/app/vars';
import { useVarControler } from 'tdp-editor-common/src/controller';
const props = defineProps<{
    visible?: boolean;
    scope?: EnumAppVarScope;
}>();
const emits = defineEmits<{
    (e: 'update:visible', visible: boolean): void;
}>();
// 显示弹窗
const visible = ref(props.visible);
// 构建form数据
const formData = reactive({
    name: '',
    scope: EnumAppVarScope.Global,
    type: EnumAppVarType.Normal,
});
watchEffect(() => {
    visible.value = props.visible;
    formData.scope = props.scope || EnumAppVarScope.Global;
});

// 创建变量
const onCreate = () => {
    const varController = useVarControler();
    const result = varController.addVar({
        name: formData.name,
        scope: formData.scope,
        type: formData.type,
        data: '',
    });
    if (result.success) {
        formData.name = '';
        formData.scope = EnumAppVarScope.Global;
        formData.type = EnumAppVarType.Normal;
    }
};
// 关闭弹窗
const onCloseModal = () => {
    emits('update:visible', false);
};
</script>
