<template>
    <a-modal
        :visible="visible"
        title="选择变量和方法"
        :width="800"
        :footer="null"
        @cancel="clickCancel"
    >
        <div class="params-modal">
            <div class="params-type">
                <ul>
                    <li @click="checkType('params' as any)">
                        <a-button :type="checkedType === 'params' ? 'primary' : 'link'">
                            页面变量
                        </a-button>
                    </li>
                    <li @click="checkType('function' as any)">
                        <a-button :type="checkedType === 'function' ? 'primary' : 'link'">
                            页面方法
                        </a-button>
                    </li>
                </ul>
            </div>
            <div class="params-list">
                <ul v-if="checkedType === 'params'">
                    <li v-for="item in paramsList" :key="item.name" @click="checkParam(item.name)">
                        <a-button :type="checkedParamName === item.name ? 'primary' : 'link'">
                            {{ item.name }}
                        </a-button>
                    </li>
                    <li>
                        <a-button type="link">添加变量</a-button>
                    </li>
                </ul>
                <ul v-else>
                    <li
                        v-for="item in functionsList"
                        :key="item.name"
                        @click="checkParam(item.name)"
                    >
                        <a-button :type="checkedParamName === item.name ? 'primary' : 'link'">
                            {{ item.name }}
                        </a-button>
                    </li>
                    <li>
                        <a-button type="link">添加方法</a-button>
                    </li>
                </ul>
            </div>
            <div class="p-value">
                <div id="fd_designer_paramsmodal_monaco"></div>
                <div id="fd_designer_paramsmodal_monaco_action">
                    <a-button type="link" @click="setParam">选择</a-button>
                    <a-button type="primary" @click="saveParamValue">保存</a-button>
                </div>
            </div>
        </div>
    </a-modal>
</template>
<style lang="less" scoped>
.params-modal {
    display: flex;
    flex-flow: row nowrap;
    height: 500px;
    justify-content: flex-start;
    align-items: flex-start;
    ul {
        margin: 0;
        padding: 0;
        li {
            list-style: none;
            height: 26px;
            line-height: 26px;
        }
    }
    .params-type {
        width: 100px;
        height: 100%;
        overflow: auto;
    }
    .params-list {
        flex: 1;
        height: 100%;
        overflow: auto;
    }
    .p-value {
        flex: 3;
        height: 100%;
        overflow: hidden;
    }
    #fd_designer_paramsmodal_monaco {
        width: 100%;
        height: 90%;
    }
    #fd_designer_paramsmodal_monaco_action {
        height: 10%;
        text-align: right;
        padding-top: 5px;
        padding-right: 20px;
    }
}
</style>
<script lang="ts">
import { defineComponent, nextTick } from 'vue';
import type { PropType } from 'vue';
import type { IDesignerComponent } from 'tdp-editor-types/src/interface/designer';
import { mapState } from 'pinia';
import * as monaco from 'monaco-editor';

import { useAppStore } from 'tdp-editor-common/src/stores/appStore';
import { useVarControler } from 'tdp-editor-common/src/controller';

let monacoEditor: monaco.editor.IStandaloneCodeEditor | undefined = undefined;

monaco.languages.registerCompletionItemProvider('javascript', {
    provideCompletionItems(model, position) {
        const varController = useVarControler();
        const lineContent = model.getLineContent(position.lineNumber);
        const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: 1,
            endColumn: 2,
        };
        const suggestions: monaco.languages.CompletionItem[] = [];
        if (lineContent.lastIndexOf('$info.$g.') === lineContent.length - 9) {
            const globalVars = varController.getGlobalVars();
            for (const varKey in globalVars) {
                if (Object.prototype.hasOwnProperty.call(globalVars, varKey)) {
                    suggestions.push({
                        label: varKey,
                        range,
                        kind: monaco.languages.CompletionItemKind['Property'],
                        insertText: varKey,
                    });
                }
            }
        } else if (lineContent.lastIndexOf('$info.$p.') === lineContent.length - 8) {
            const pageVars = varController.getCurrentPageVars();
            for (const varKey in pageVars) {
                if (Object.prototype.hasOwnProperty.call(pageVars, varKey)) {
                    suggestions.push({
                        label: varKey,
                        range,
                        kind: monaco.languages.CompletionItemKind['Property'],
                        insertText: varKey,
                    });
                }
            }
        }
        return {
            suggestions: [
                {
                    label: 'test',
                    kind: monaco.languages.CompletionItemKind['Property'],
                    insertText: 'test',
                    range,
                },
            ],
        };
    },
    triggerCharacters: ['.', ' '],
});
enum EnumParamType {
    params = 'params',
    function = 'function',
}
export default defineComponent({
    name: 'params-modal',
    props: {
        element: {
            required: false,
            type: Object as PropType<IDesignerComponent>,
        },
        visible: {
            required: true,
            type: Boolean,
        },
        eventIndex: {
            required: true,
            type: Number,
        },
    },
    computed: {
        ...mapState(useAppStore, {
            selectedPage: 'activePage',
        }),
        paramsList(): { name: string; value: any }[] {
            const result: { name: string; value: any }[] = [];
            const vars = useVarControler().getCurrentPageVars();
            if (!vars) return result;
            for (const varKey in vars) {
                if (Object.prototype.hasOwnProperty.call(vars, varKey)) {
                    const element = vars[varKey];
                    result.push({ name: varKey, value: element });
                }
            }
            return result;
        },
        functionsList(): any[] {
            const result = [];
            if (this.selectedPage) {
                const methods = this.selectedPage.props?.pageMethods.value;
                for (const key in methods) {
                    result.push({ name: key, value: methods[key] });
                }
            }
            return result;
        },
    },
    emits: {
        ['update:visible'](visible: boolean): boolean {
            return typeof visible === 'boolean';
        },
        paramChecked(paramInfo: { name: string; type: EnumParamType }) {
            return paramInfo;
        },
    },
    beforeUnmount() {
        if (monacoEditor) {
            monacoEditor.dispose();
        }
    },
    data() {
        return {
            // 标识用户选中的是 [变量] 还是 [方法]
            checkedType: EnumParamType.params,
            // 标识用户选中的 变量 或者 方法 名
            checkedParamName: '',
        };
    },
    methods: {
        initMonaco() {
            if (!monacoEditor) {
                monacoEditor = monaco.editor.create(
                    document.getElementById('fd_designer_paramsmodal_monaco')!,
                    {
                        language: 'javascript',
                        theme: 'vs',
                        value: '',
                        minimap: { enabled: true },
                    }
                );
            }
        },
        checkType(type: EnumParamType) {
            this.checkedType = type;
        },
        checkParam(name: string) {
            this.checkedParamName = name;
            if (!monacoEditor) return;
            if (this.checkedType === 'params') {
                const param = this.paramsList.find(p => p.name === name);
                monacoEditor.setValue(param!.value);
            } else if (this.checkedType === 'function') {
                const param = this.functionsList.find(f => f.name === name);
                monacoEditor.setValue(param!.value);
            }
        },
        saveParamValue() {
            if (
                monacoEditor &&
                this.element &&
                this.element.events &&
                this.element.events[this.eventIndex]
            ) {
                const value = monacoEditor.getValue();
                const eventInfo = this.element.events[this.eventIndex];
                eventInfo.funcStr = value;
            }
        },
        setParam() {
            this.$emit('paramChecked', {
                name: this.checkedParamName,
                type: this.checkedType,
            });
        },
        clickCancel() {
            this.$emit('update:visible', false);
        },
    },
    watch: {
        visible(val: boolean, oldVal: boolean) {
            if (val === true && val !== oldVal) {
                nextTick(() => {
                    this.initMonaco();
                });
            }
        },
        eventIndex(val: number, oldVal: number) {
            if (this.element && val > -1 && val !== oldVal) {
                if (monacoEditor && this.element.events && this.element.events[this.eventIndex]) {
                    const eventInfo = this.element.events[this.eventIndex];
                    monacoEditor.setValue(eventInfo.funcStr);
                }
            }
        },
    },
});
</script>
