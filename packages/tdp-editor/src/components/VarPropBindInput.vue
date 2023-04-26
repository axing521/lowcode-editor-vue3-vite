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
            @select="onSelect"
        >
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
import { useVarControler } from 'tdp-editor-common/src/controller';

interface IData {
    varName: string;
    varPath: string;
}
const varController = useVarControler();
const ArrayFuncs = Object.getOwnPropertyNames(Array.prototype);

const props = defineProps<{
    value?: string;
}>();

const emits = defineEmits<{
    (e: 'change', value: string): void;
}>();

const inputBindValue = ref('');
const options = ref<
    {
        label: string;
        value: string;
    }[]
>([]);
const getSuggest = (queryString: string, cb: (data: IData[]) => void) => {
    const result: IData[] = [];
    if (!queryString || queryString === '$') {
        const globalVars = varController.getGlobalVars();
        const pageVars = varController.getCurrentPageVars();
        for (const key in globalVars) {
            result.push({
                varPath: `$g.${key}`,
                varName: key,
            });
        }
        if (pageVars) {
            for (const key in pageVars) {
                result.push({
                    varName: key,
                    varPath: `$p.${key}`,
                });
            }
        }
    } else if (queryString.lastIndexOf('.') === queryString.length - 1) {
        const _queryString = queryString.substring(0, queryString.length - 1);
        const bindValue = varController.evalVarValue({
            expression: _queryString,
        });
        if (bindValue.success && Array.isArray(bindValue.value)) {
            ArrayFuncs.forEach(k => {
                result.push({
                    varName: k,
                    varPath: `${queryString}${k}`,
                });
            });
        } else if (
            bindValue.success &&
            typeof bindValue.value === 'object' &&
            JSON.stringify(bindValue.value) !== '{}'
        ) {
            Object.keys(bindValue.value).forEach(k => {
                result.push({
                    varName: k,
                    varPath: `${queryString}${k}`,
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
        options.value = data.map(c => {
            return {
                label: c.varName,
                value: c.varPath,
            };
        });
    });
};
/**
 * autoComplete组件选中变量时，触发change事件
 * @param value 变量path
 */
const onSelect = (value: string) => {
    emits('change', value);
};
/**
 * 按下回车时，触发change事件
 */
const onPressEnter = () => {
    emits('change', inputBindValue.value);
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
        options.value = data.map(c => {
            return {
                label: c.varName,
                value: c.varPath,
            };
        });
    });
};
watchEffect(() => {
    if (props.value) {
        inputBindValue.value = props.value;
    }
});
</script>
<style lang="less">
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
