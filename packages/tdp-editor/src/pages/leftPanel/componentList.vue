<script lang="tsx">
import { defineComponent } from 'vue';
import { mapState } from 'pinia';

import { message as $message } from 'ant-design-vue/es';
import { PlusCircleOutlined } from '@ant-design/icons-vue';
import type { IDesignerComponent } from 'tdp-editor-types/src/interface/designer';
import { useEditorStore } from 'tdp-editor-common/src/stores/editorStore';
import { useAppStore } from 'tdp-editor-common/src/stores/appStore';
import { utils } from 'tdp-editor-common/src';
import { newComponentJson } from 'tdp-editor-common/src/stores/editorStore';

const delayError = utils.$getDelayFunction((message: string) => {
    $message.warn(message);
}, 200);

type componentMenu = {
    name: string;
    components: IDesignerComponent[];
};

export default defineComponent({
    name: 'designer-component-list',
    components: {
        PlusCircleOutlined,
    },
    computed: {
        ...mapState(useEditorStore, ['componentList', 'selectedComponent']),
        ...mapState(useAppStore, ['activePage']),
        componentGroup() {
            const group = [] as componentMenu[];
            this.componentList
                .filter(c => c.showInList !== false)
                .forEach(c => {
                    const groupItem = group.find(g => g.name === (c.listGroup || 'normal'));
                    if (groupItem) {
                        groupItem.components.push(c);
                    } else {
                        group.push({
                            name: c.listGroup || 'normal',
                            components: [c],
                        });
                    }
                });
            return group;
        },
    },
    methods: {
        getGroupName(name: string) {
            if (name === 'business') {
                return '业务组件';
            } else if (name === 'high') {
                return '高级组件';
            } else {
                return '普通组件';
            }
        },
        dragStart(): void {
            const actionBox = document.getElementById('designer-main-action-box');
            if (actionBox) {
                actionBox.style.display = 'none';
            }
        },
        // 判断哪些组件可以拖动到设计面板
        dragMove(e: any): boolean {
            const toDesignerPanel = e.to && e.to.className === 'main-panel-container';
            const dragElement = (e.draggedContext && e.draggedContext.element) || {};
            // 如果向容器拖入非容器组件
            if (toDesignerPanel && !dragElement.box) {
                delayError('请拖入容器组件');
                return false;
            }
            const element = e.draggedContext.element;
            useEditorStore().setDragComponent({
                component: element,
            });
            return true;
        },
        // 向设计面板拖入组件时，生成新的id
        dragCloneData(originData: IDesignerComponent) {
            return newComponentJson(originData);
        },
        // 双击向选中组件中添加组件
        doubleClickComponent(originData: IDesignerComponent) {
            const parent = this.selectedComponent ? this.selectedComponent : this.activePage;
            const newComponent = newComponentJson(originData);
            useEditorStore().doubleAddComponent({
                parent: parent as any,
                component: newComponent,
            });
        },
        dragableSlots_item(records: IDesignerComponent[]) {
            const lis: any[] = [];
            records.forEach(c => {
                lis.push(
                    <li
                        class="li-component"
                        data-compType={c.type}
                        key={c.type}
                        data-compGroup={c.group}
                        title={c.label}
                    >
                        <div class="comp-icon">
                            <i class={`iconfont ${c.icons}`} />
                        </div>
                        <div class="comp-name">
                            {c.label}
                            <a-button
                                class={'btn-add'}
                                type="primary"
                                shape="circle"
                                v-slots={{
                                    icon: () => <plus-circle-outlined />,
                                }}
                                size="small"
                                onClick={() => this.doubleClickComponent(c)}
                            ></a-button>
                        </div>
                    </li>
                );
            });
            return lis;
        },
    },
    render() {
        return (
            <ul class="fd-ul-component">
                <h3>组件</h3>
                <a-collapse activeKey={this.componentGroup.map(g => g.name)}>
                    {this.componentGroup.map(group => (
                        <a-collapse-panel key={group.name} header={this.getGroupName(group.name)}>
                            <div class="components">
                                {this.dragableSlots_item(group.components)}
                            </div>
                        </a-collapse-panel>
                    ))}
                </a-collapse>
            </ul>
        );
    },
});
</script>
<style lang="less">
ul.fd-ul-component {
    text-align: left;
    .components {
        display: flex;
        flex-flow: row wrap;
        justify-content: flex-start;
        align-items: flex-start;
        li.li-component {
            padding-left: 20px;
            position: relative;
            height: 60px;
            box-sizing: border-box;
            cursor: move;
            width: 33.33%;
            margin-bottom: 20px;
            padding-left: 2px;
            padding-right: 2px;
            text-align: center;
            padding: 0;
            color: #111111;
            // background-color:rgba(38, 132, 252, 0.5);
            border-radius: 4px;
            &.active {
                opacity: 0.6;
            }
            i.iconfont {
                font-size: 30px;
                color: rgba(38, 132, 252, 0.5);
                vertical-align: middle;
            }
            .comp-icon {
                height: 40px;
                line-height: 40px;
            }
            .comp-name {
                height: 20px;
                line-height: 20px;
            }
            .btn-add {
                position: absolute;
                display: none;
                font-size: 16px;
                left: 50%;
                top: 20px;
                transform: translateX(-50%) translateY(-50%);
            }
            &:hover {
                .btn-add {
                    display: block;
                }
            }
        }
    }
}
</style>
