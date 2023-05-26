<template>
    <div class="var-prop-wrapper">
        <a
            class="anticon anticon-close-circle ant-input-textarea-clear-icon"
            v-show="!!inputBindValue"
            @click="onTextareaClear"
        >
            <svg
                viewBox="64 64 896 896"
                data-icon="close-circle"
                width="1em"
                height="1em"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
                class=""
            >
                <path
                    d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 0 1-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z"
                ></path>
            </svg>
        </a>
        <a-auto-complete
            class="var-prop-bind-container"
            ref="propBind"
            v-model:value="inputBindValue"
            :options="options"
            style="width: 100%"
            defaultActiveFirstOption
            @blur="onACBlur"
            @search="onSearch"
        >
            <template #option="item">
                <template v-if="item.options">
                    <span class="auto-group-name">{{ item.label }}</span>
                </template>
                <template v-else>
                    <span class="auto-item-name">{{ item.label }}</span>
                </template>
            </template>
            <a-textarea
                ref="ac-textarea"
                placeholder="输入表达式"
                class="custom-ac-textarea"
                :autoSize="{ minRows: 2, maxRows: 6 }"
                @pressEnter.prevent="onPressEnter"
                @focus="onFocus"
                @clear="onTextareaClear"
            />
        </a-auto-complete>
    </div>
</template>
<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { useDatasourceControler, useVarControler } from 'tdp-editor-common/src/controller';

interface IOption {
    label: string;
    value: string;
    options?: IOption[];
}
const varController = useVarControler();
const ArrayFuncs = Object.getOwnPropertyNames(Array.prototype);

const props = defineProps<{
    dsKey?: string;
    value?: string;
}>();

const emits = defineEmits<{
    (e: 'change', value: string): void;
}>();

const inputBindValue = ref('');
const options = ref<IOption[]>([]);
const getSuggest = (queryString: string, cb: (data: IOption[]) => void) => {
    const result: IOption[] = [];
    if (!queryString || queryString === '$') {
        const globalVars = varController.getGlobalVars();
        const pageVars = varController.getCurrentPageVars();
        const globalVarList: IOption[] = [];
        for (const key in globalVars) {
            globalVarList.push({
                value: `$g.${key}`,
                label: key,
            });
        }
        // 添加全局变量展示
        if (globalVarList.length) {
            result.push({
                value: '$g',
                label: '全局变量',
                options: globalVarList,
            });
        }
        const pageVarList: IOption[] = [];
        for (const key in pageVars) {
            pageVarList.push({
                value: `$p.${key}`,
                label: key,
            });
        }
        // 添加页面变量展示
        if (pageVarList.length) {
            result.push({
                value: '$p',
                label: '页面变量',
                options: pageVarList,
            });
        }
        if (props.dsKey) {
            const dsController = useDatasourceControler();
            const ds = dsController.getDSByKey(props.dsKey);
            if (ds.item) {
                result.push({
                    value: '$ds',
                    label: '已绑定数据源',
                    options: [
                        {
                            value: '$ds',
                            label: ds.item.name,
                        },
                    ],
                });
            }
        }
    } else if (queryString.lastIndexOf('.') === queryString.length - 1) {
        const _queryString = queryString.substring(0, queryString.length - 1);
        const bindValue = varController.evalVarValue({
            expression: _queryString,
            dsKey: props.dsKey,
        });
        if (bindValue.success && Array.isArray(bindValue.value)) {
            ArrayFuncs.forEach(k => {
                result.push({
                    value: `${queryString}${k}`,
                    label: k,
                });
            });
        } else if (
            bindValue.success &&
            typeof bindValue.value === 'object' &&
            JSON.stringify(bindValue.value) !== '{}'
        ) {
            Object.keys(bindValue.value).forEach(k => {
                result.push({
                    value: `${queryString}${k}`,
                    label: k,
                });
            });
        }
    }
    cb(result);
    return result;
};

/**
 * autoComplete组件搜索值发生变化时，触发search事件
 * @param searchText 用户输入内容
 */
const onSearch = (searchText: string) => {
    getSuggest(searchText, data => {
        options.value = data;
    });
};
/**
 * 按下回车时，触发change事件
 */
const onPressEnter = () => {
    setTimeout(() => {
        emits('change', inputBindValue.value);
    }, 300);
};
/**
 * 失去交点时，触发change事件
 */
const onACBlur = () => {
    emits('change', inputBindValue.value);
};
const onTextareaClear = (e: Event) => {
    // 清空事件
    inputBindValue.value = '';
    emits('change', '');
    if (e.target) {
        (e.target as HTMLTextAreaElement).blur();
        options.value = [];
    }
};
const onFocus = () => {
    getSuggest(inputBindValue.value, data => {
        options.value = data;
    });
};
watchEffect(() => {
    if (props.value) {
        inputBindValue.value = props.value;
    }
});
</script>
<style lang="less">
@import url('/src/styles/var/color.less');
.var-prop-wrapper {
    position: relative;
    > .ant-input-textarea-clear-icon {
        position: absolute;
        width: 6px;
        height: 6px;
        top: 2px;
        right: 11px;
        color: rgba(0, 0, 0, 0.3) !important;
        z-index: 7;
        &:hover {
            color: rgba(0, 0, 0, 0.5) !important;
            font-size: 14px;
        }
    }
}
span.auto-group-name {
    font-weight: 600;
}
.ant-select-item-option-active {
    background-color: @primary-2 !important;
}
.var-prop-bind-container {
    position: relative;
    .ant-select-selection__rendered > ul {
        padding: 0;
    }
    .ant-select-selection-search {
        position: relative;
        &::before,
        &::after {
            display: block;
            position: absolute;
            width: 5px;
            height: 15px;
            z-index: 1;
            color: #aaa;
        }
        &::before {
            content: '{{';
            top: 4px;
            left: 2px;
        }
        &::after {
            content: '}}';
            bottom: 12px;
            right: 6px;
        }
        .custom-ac-textarea {
            color: gray;
        }
    }
}
</style>
