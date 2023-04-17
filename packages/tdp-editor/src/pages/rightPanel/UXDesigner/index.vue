<template>
    <div class="designer-ux-panel">
        <div class="section ux">
            <h3>事件绑定</h3>
            <div class="item" v-for="(event, index) in elementBindEvents" :key="event.eventId">
                <div class="label">
                    <a-select v-model:value="event.eventName">
                        <a-select-option v-for="e in eventList" :key="e.key" :value="e.key">
                            {{ e.label }}
                        </a-select-option>
                    </a-select>
                </div>
                <div class="value">
                    <a-button @click="showParamsModal(event.eventId)"> 选择方法 </a-button>
                    <delete-outlined @click="deleteEvent(index)" />
                </div>
            </div>
        </div>
        <a-button type="primary" class="btn-add-event" @click="addEvent"> 添加 </a-button>
        <params-modal
            v-model:visible="showPm"
            :element="props.element"
            :eventId="eventId"
            @param-checked="onParamCheck"
        />
    </div>
</template>
<style lang="less">
.designer-ux-panel {
    position: relative;
    .btn-add-event {
        margin-top: 10px;
    }
    .section.ux > .item {
        > .label {
            width: 120px;
            .ant-select {
                width: 90%;
            }
        }
        .value {
            .anticon {
                margin-left: 10px;
                cursor: pointer;
                &:hover {
                    color: red;
                }
            }
        }
    }
}
</style>
<script setup lang="ts">
import { defineComponent, ref, computed } from 'vue';
import type { IDesignerComponent } from 'tdp-editor-types/src/interface/designer';

import { DeleteOutlined } from '@ant-design/icons-vue';
import { EnumEventName, EnumEventType } from 'tdp-editor-types/src/enum/components';
import { eventFactory, utils } from 'tdp-editor-common/src';
import ParamsModal from '../paramsModal.vue';
import { useEditorStore } from 'tdp-editor-common/src/stores/editorStore';

type TEventList = {
    key: EnumEventName;
    label: EnumEventName;
    types: EnumEventType[];
};
const props = defineProps<{
    element?: IDesignerComponent;
}>();
const editorStore = useEditorStore();
const showPm = ref(false);
const eventId = ref('');
const componentList = editorStore.componentList;
const eventConfigs = computed(() => {
    if (!props.element) return [];
    const comp = componentList.find(c => c.type === props.element!.type);
    return (comp && comp.eventConfigs) || [];
});
const eventList = computed(() => {
    if (props.element && eventConfigs.value) {
        const eventList: TEventList[] = [];
        eventConfigs.value.forEach(config => {
            eventList.push({
                key: config.eventName,
                label: config.eventName,
                types: config.eventTypes,
            });
        });
        return eventList;
    } else {
        return [];
    }
});
const elementBindEvents = computed(() => {
    if (props.element && props.element.events) {
        return props.element.events;
    } else {
        return [];
    }
});
// 添加事件
const addEvent = () => {
    if (!eventList.value.length) return false;
    eventFactory.pushEvent(props.element!, {
        eventId: props.element?.type + '_' + utils.$randomWord(false, 10),
        eventName: eventList.value[0].key,
        eventType: EnumEventType.script,
        funcName: '',
        funcStr: '',
    });
};
const deleteEvent = (index: number) => {
    eventFactory.removeEvent(props.element!, index);
};
const showParamsModal = (_eventId: string) => {
    eventId.value = _eventId;
    showPm.value = true;
};
const onParamCheck = (paramInfo: any) => {
    if (props.element && props.element.events) {
        if (paramInfo.type !== 'function') {
            alert('事件只能绑定方法，请重新选择!');
            return;
        }
        props.element!.events.find(c => c.eventId === eventId.value)!.funcName = paramInfo.name;
        showPm.value = false;
    }
};
</script>
<script lang="ts">
export default defineComponent({
    name: 'designer-ux-panel',
});
</script>
