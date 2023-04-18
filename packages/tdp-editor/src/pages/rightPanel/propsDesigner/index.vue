<template>
    <div class="designer-props-panel">
        <div class="section">
            <div class="item">
                <div class="label">组件id</div>
                <div class="value">
                    <a-dropdown>
                        <template #overlay>
                            <a-menu>
                                <a-menu-item>
                                    <a-button @click="copyComponentId" type="link">
                                        <template #icon><CopyOutlined /></template>
                                        copy ID
                                    </a-button>
                                </a-menu-item>
                                <a-menu-item v-if="!isPage">
                                    <a-button @click="deleteComponent" type="link">
                                        <template #icon><DeleteFilled /></template>
                                        删除
                                    </a-button>
                                </a-menu-item>
                                <a-menu-item v-if="!isPage">
                                    <a-button @click="unselectComponent" type="link">
                                        <template #icon><UndoOutlined /></template>
                                        取消选中
                                    </a-button>
                                </a-menu-item>
                            </a-menu>
                        </template>
                        <a class="ant-dropdown-link" @click.prevent>
                            {{ componentId }}
                            <down-outlined />
                        </a>
                    </a-dropdown>
                </div>
            </div>
            <div class="item">
                <div class="label">组件类型</div>
                <div class="value">{{ componentType }}</div>
            </div>
        </div>
        <a-collapse expandIconPosition="right" :defaultActiveKey="['props', 'form', 'css']">
            <a-collapse-panel key="props" header="属性">
                <div class="section section-panel">
                    <template v-if="element">
                        <div
                            class="item"
                            v-for="prop in propsConfigs"
                            :data-props="prop.key"
                            :key="prop.key"
                        >
                            <template v-if="typeof prop.selector === 'string'">
                                <component
                                    :is="prop.selector"
                                    :state="element"
                                    :prop="prop"
                                ></component>
                            </template>
                            <template
                                v-else-if="
                                    typeof prop.selector === 'object' && 'name' in prop.selector
                                "
                            >
                                <component
                                    :is="prop.selector.name"
                                    :state="element"
                                    :prop="prop"
                                    :options="prop.selector.options"
                                ></component>
                            </template>
                            <template v-else>
                                <div></div>
                            </template>
                        </div>
                    </template>
                </div>
            </a-collapse-panel>
            <a-collapse-panel key="form" header="表单" v-if="showFormDesigner">
                <DesignerFormPanel :element="element" />
            </a-collapse-panel>
            <a-collapse-panel key="css" header="外观">
                <DesignerCssPanel :element="element" />
            </a-collapse-panel>
            <a-collapse-panel key="datasource" header="数据源" v-if="isPage">
                <DataSourcePanel :element="element" />
            </a-collapse-panel>
        </a-collapse>
    </div>
</template>
<script lang="ts">
import type { PropType } from 'vue';
import type { IDesignerComponent, IPropsConfig } from 'tdp-editor-types/src/interface/designer';

import { defineComponent, inject } from 'vue';
import { mapState } from 'pinia';
import { message } from 'ant-design-vue';
import { useEditorStore } from 'tdp-editor-common/src/stores/editorStore';
import { useEditorControler } from 'tdp-editor-common/src/controller';
import DesignerCssPanel from './cssDesigner/index.vue';
import DesignerFormPanel from './formDesigner';
import DataSourcePanel from './DataSourcePanel.vue';
import {
    EnumComponentGroup,
    EnumComponentType,
    EnumPropsValueType,
} from 'tdp-editor-types/src/enum/components';
import { DownOutlined, CopyOutlined, DeleteFilled, UndoOutlined } from '@ant-design/icons-vue';

export default defineComponent({
    name: 'designer-props-panel',
    components: {
        DesignerCssPanel,
        DesignerFormPanel,
        DownOutlined,
        CopyOutlined,
        DeleteFilled,
        UndoOutlined,
        DataSourcePanel,
    },
    props: {
        element: {
            required: false,
            type: Object as PropType<IDesignerComponent>,
        },
    },
    setup() {
        const unselectComponent = inject('unselectComponent');
        return {
            unselectComponent,
            EnumComponentType,
        };
    },
    computed: {
        ...mapState(useEditorStore, {
            componentList: 'componentList',
        }),
        isPage(): boolean {
            return Boolean(this.element && this.element.type === EnumComponentType.page);
        },
        showFormDesigner(): boolean {
            return Boolean(
                this.element &&
                    this.element.group === EnumComponentGroup.form &&
                    this.element.isFormer
            );
        },
        // 组件ID
        componentId(): string {
            return this.element && this.element.key ? this.element.key : '';
        },
        // 组件类型
        componentType(): string {
            if (this.element) {
                return `${this.element.type}(${this.element.label})`;
            } else return '';
        },
        // 当前组件的所有属性
        propsConfigs(): IPropsConfig[] {
            const comp = this.componentList.find(c => c.type === this.element!.type);
            return (comp && comp.propsConfigs) || [];
        },
    },
    data() {
        return {
            showPM: false,
            pmPropKey: '',
            pmPropValueType: EnumPropsValueType.expression,
        };
    },
    methods: {
        showParamsModal(propKey: string, propValueType: EnumPropsValueType) {
            this.pmPropKey = propKey;
            this.pmPropValueType = propValueType;
            this.showPM = true;
        },
        copyComponentId() {
            if (this.$clipboard && this.element) {
                this.$clipboard(this.element.key);
                message.success('复制成功');
            }
        },
        // 删除所选组件
        deleteComponent() {
            if (this.element) {
                document.getElementById('designer-main-action-box')!.style.display = 'none';
                const editorController = useEditorControler();
                editorController.deleteComponent({ id: this.element.key });
            }
        },
    },
});
</script>
<style lang="less">
@import url('/src/styles/var/index.less');
.designer-props-panel {
    position: relative;
    padding-bottom: 30px;
    .multipleSelectors {
        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-start;
        align-items: center;
        .selector {
            flex: 1;
            padding: 0 10px;
        }
        .check-btn {
            width: 30px;
        }
    }
    .ant-collapse-header {
        text-align: left;
        font-weight: 600;
    }
    .ant-collapse-content-box {
        padding: 0;
    }
    .selector-array-data {
        ul,
        li {
            margin: 0;
            padding: 0;
            list-style: none;
        }
        li.data-item {
            justify-content: flex-start !important;
            margin: 10px auto;
            .ant-input {
                width: 40% !important;
                margin-left: 10px;
            }
            .anticon-delete {
                cursor: pointer;
                color: @primary-color;
            }
            .anticon-delete:hover {
                cursor: pointer;
                color: red;
            }
        }
    }
}
</style>
