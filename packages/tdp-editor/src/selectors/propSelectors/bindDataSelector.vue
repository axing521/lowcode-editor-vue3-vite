<template>
    <div>
        <a-input prefix="{{" suffix="}}" v-model:value="_value"></a-input>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import type { IDesignerComponent, IPropsConfig } from 'tdp-editor-types/interface/designer';
export default defineComponent({
    name: EnumSelectorName.bindData,
});
</script>
<script lang="ts" setup>
import { computed } from 'vue';
import { EnumSelectorName } from 'tdp-editor-types/enum/designer';
import { EnumPropsValueType } from 'tdp-editor-types/enum/components';
import propsFactory from 'tdp-editor-utils/propsFactory';

const _props = defineProps<{
    element: IDesignerComponent;
    prop: IPropsConfig;
}>();

const _value = computed<string>({
    get(): string {
        const vv = propsFactory.getPropsValue(_props.element, _props.prop.key);
        return vv;
    },
    set(value: string) {
        console.log('value', value);
        propsFactory.setPropsValue(
            _props.element,
            _props.prop.key,
            value || '',
            EnumPropsValueType.string
        );
    },
});
</script>
