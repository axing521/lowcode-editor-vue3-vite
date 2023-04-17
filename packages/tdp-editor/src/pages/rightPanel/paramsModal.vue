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
                <monaco-editor
                    ref="monacoRef"
                    :value="monacoValue"
                    language="javascript"
                    style="height: 96%"
                ></monaco-editor>
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
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import type { IDesignerComponent } from 'tdp-editor-types/src/interface/designer';
import { mapState } from 'pinia';

import { useAppStore } from 'tdp-editor-common/src/stores/appStore';
import { useVarControler } from 'tdp-editor-common/src/controller';
import MonacoEditor from '../../components/MonacoEditor.vue';
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
        eventId: {
            required: true,
            type: String,
        },
    },
    components: {
        MonacoEditor,
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
    data() {
        return {
            // 标识用户选中的是 [变量] 还是 [方法]
            checkedType: EnumParamType.params,
            // 标识用户选中的 变量 或者 方法 名
            checkedParamName: '',
            monacoValue: '',
        };
    },
    methods: {
        checkType(type: EnumParamType) {
            this.checkedType = type;
        },
        checkParam(name: string) {
            this.checkedParamName = name;
            if (this.checkedType === 'params') {
                const param = this.paramsList.find(p => p.name === name);
                this.monacoValue = param!.value;
            } else if (this.checkedType === 'function') {
                const param = this.functionsList.find(f => f.name === name);
                this.monacoValue = param!.value;
            }
        },
        saveParamValue() {
            const $monacoRef: any = this.$refs['monacoRef'];
            if (this.element && this.element.events && $monacoRef) {
                const eventInfo = this.element.events.find(c => c.eventId === this.eventId);
                if (eventInfo) eventInfo.funcStr = $monacoRef.getValue();
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
        eventId(val: string, oldVal: string) {
            if (this.element && val && val !== oldVal && this.element.events) {
                const event = this.element.events.find(c => c.eventId === val);
                if (event) {
                    this.monacoValue = event.funcStr || '';
                }
            }
        },
    },
});
</script>
