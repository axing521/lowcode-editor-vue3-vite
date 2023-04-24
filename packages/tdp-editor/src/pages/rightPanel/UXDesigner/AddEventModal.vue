<template>
    <a-modal :visible="visible" title="添加事件" :width="800" :footer="null" @cancel="clickCancel">
        <a-form
            :model="formState"
            name="basic"
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 18 }"
            autocomplete="off"
            @finish="onFinish"
            @finishFailed="onFinishFailed"
        >
            <a-form-item
                label="事件"
                name="eventName"
                :rules="[{ required: true, message: '请选事件!' }]"
            >
                <a-select v-model:value="formState.eventName">
                    <a-select-option
                        v-for="event in props.eventList"
                        :key="event.key"
                        :value="event.key"
                    >
                        {{ event.label }}
                    </a-select-option>
                </a-select>
            </a-form-item>

            <a-form-item
                label="操作"
                name="eventType"
                :rules="[{ required: true, message: '请选择操作类型!' }]"
            >
                <a-select v-model:value="formState.eventType" @change="eventTypeChange">
                    <a-select-option v-for="event in eventTypeList" :key="event" :value="event">
                        {{ EventTypeMap[event] }}
                    </a-select-option>
                </a-select>
            </a-form-item>

            <a-form-item
                v-if="formState.eventType === EnumEventType.pageFunction"
                label="方法名"
                name="eventFuncName"
            >
                <a-select v-model:value="formState.eventFuncName">
                    <a-select-option v-for="name in pageFuncionList" :key="name" :value="name">
                        {{ name }}
                    </a-select-option>
                </a-select>
            </a-form-item>

            <a-form-item
                v-if="formState.eventType === EnumEventType.script"
                label="自定义脚本"
                name="eventFuncStr"
            >
                <monaco-editor
                    ref="monacoRef"
                    :value="formState.eventFuncStr"
                    language="javascript"
                    style="height: 320px"
                ></monaco-editor>
            </a-form-item>

            <a-form-item :wrapper-col="{ span: 24 }" style="text-align: center">
                <a-button type="primary" html-type="submit">提交</a-button>
            </a-form-item>
        </a-form>
    </a-modal>
</template>
<style lang="less" scoped></style>
<script lang="ts" setup>
import { shallowReactive, ref, computed, nextTick, watchEffect } from 'vue';
import type { IDesignerComponent } from 'tdp-editor-types/src/interface/designer';
import type { IComponentEvent } from 'tdp-editor-types/src/interface/app/components';
import { EnumEventType, type EnumEventName } from 'tdp-editor-types/src/enum/components';
import { eventFactory, utils } from 'tdp-editor-common/src';
import { EventTypeMap } from 'tdp-editor-types/src/constant/component';
import MonacoEditor from '../../../components/MonacoEditor.vue';
import { usePageControler } from 'tdp-editor-common/src/controller';

// 定义事件列表对象
type TEventList = {
    key: EnumEventName;
    label: string;
    types: EnumEventType[];
};
const props = defineProps<{
    element: IDesignerComponent;
    visible: boolean;
    eventList: TEventList[]; // 组件可绑定的事件配置
    event?: IComponentEvent;
}>();
const emits = defineEmits<{
    (e: 'update:visible', visible: boolean): void;
}>();

// 自定义脚本实例代码
const funcStrDemo = 'function demo(events) { \n    console.log("this is a demo", events); \n} \n';
// form表单数据
const formState = shallowReactive({
    eventName: '' as EnumEventName,
    eventType: '' as EnumEventType,
    eventFuncStr: '',
    eventFuncName: '',
});
// 编辑器实例
const monacoRef = ref<any>(null);

// 计算事件类型列表
const eventTypeList = computed(() => {
    let result: EnumEventType[] = [];
    const eventConfig = props.eventList.find(c => c.key === formState.eventName);
    if (eventConfig) {
        result = eventConfig.types;
    }
    return result;
});
// 计算页面方法列表
const pageFuncionList = computed(() => {
    const result: string[] = [];
    if (props.visible) {
        const pageController = usePageControler();
        const pageFunctionMap = pageController.getPageFunctionMap();
        pageFunctionMap.forEach((value, key) => {
            result.push(key);
        });
    }
    return result;
});

// 保存事件
const onFinish = () => {
    const event: IComponentEvent = {
        eventId: formState.eventName + '_' + utils.$randomWord(false, 10),
        eventName: formState.eventName,
        eventType: formState.eventType,
    };
    if (formState.eventType === EnumEventType.script) {
        if (monacoRef.value) event.funcStr = formState.eventFuncStr = monacoRef.value.getValue();
    } else if (formState.eventType === EnumEventType.pageFunction) {
        event.funcName = formState.eventFuncName;
    }
    eventFactory.pushEvent(props.element!, event);
    clickCancel();
};
const onFinishFailed = () => {};
// 关闭弹窗
const clickCancel = () => {
    emits('update:visible', false);
    resetFormState();
};
// 重置form表单数据
const resetFormState = () => {
    formState.eventName = '' as EnumEventName;
    formState.eventType = '' as EnumEventType;
    formState.eventFuncName = '';
    formState.eventFuncStr = '';
    if (monacoRef.value) {
        monacoRef.value.setValue(formState.eventFuncStr);
    }
};
// 事件操作类型变化事件
const eventTypeChange = (e?: EnumEventType) => {
    if (e === EnumEventType.script) {
        formState.eventFuncStr = funcStrDemo;
        nextTick(() => {
            if (monacoRef.value) {
                monacoRef.value.setValue(formState.eventFuncStr);
            }
        });
    }
};

watchEffect(() => {
    // 修改事件
    if (props.event) {
        formState.eventName = props.event.eventName;
        nextTick(() => {
            if (!props.event) return;
            formState.eventType = props.event.eventType;
            if (formState.eventType === EnumEventType.script) {
                formState.eventFuncStr = props.event.funcStr || '';
            } else if (formState.eventType === EnumEventType.pageFunction) {
                formState.eventFuncName = props.event.funcName || '';
            }
        });
    }
});
</script>
