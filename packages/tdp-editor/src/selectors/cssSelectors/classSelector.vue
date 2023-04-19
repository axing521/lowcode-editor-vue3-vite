<template>
    <div class="item">
        <div class="label">class类名</div>
        <div class="value">
            <a-select v-model:value="computed_classNames" mode="multiple">
                <a-select-option v-for="item in classNameList" :key="item" :value="item">
                    {{ item }}
                </a-select-option>
            </a-select>
        </div>
    </div>
</template>
<script setup lang="ts">
import { defineComponent, computed } from 'vue';
import type { IDesignerComponent } from 'tdp-editor-types/src/interface/designer';
import { useAppControler } from 'tdp-editor-common/src/controller';

const props = defineProps<{
    state?: IDesignerComponent;
}>();
const computed_classNames = computed({
    get(): string[] {
        return props.state?.classNames || [];
    },
    set(value: string[]): void {
        if (props.state) {
            const state = props.state;
            state.classNames = value;
        }
    },
});
const classNameList = computed(() => {
    const activePage = useAppControler().getActivePage();
    if (!activePage || !activePage.styles) return [];
    const regex = /\.([\w-]+)/g;
    const matches = activePage.styles.match(regex);
    if (matches && matches.length) {
        const filterSet = new Set<string>();
        matches.forEach(c => {
            const className = c.replace(regex, '$1');
            filterSet.add(className);
        });
        const result: string[] = [];
        filterSet.forEach(value => {
            result.push(value);
        });
        return result;
    } else {
        return [];
    }
});
</script>
<script lang="ts">
export default defineComponent({
    name: 'css-class-selector',
});
</script>
