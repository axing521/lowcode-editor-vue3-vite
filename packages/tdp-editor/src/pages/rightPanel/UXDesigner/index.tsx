import { defineComponent } from 'vue';
import { mapState } from 'pinia';
import type { PropType } from 'vue';
import type { IDesignerComponent } from 'tdp-editor-types/interface/designer';
import './index.less';

import { DeleteOutlined } from '@ant-design/icons-vue';
import { EnumEventName, EnumEventType } from 'tdp-editor-types/enum/components';
import { eventFactory } from 'tdp-editor-utils';
import pm from '../paramsModal.vue';
import { useEditorStore } from 'tdp-editor-utils/stores/editorStore';

type TEventList = {
    key: EnumEventName,
    label: EnumEventName,
    types: EnumEventType[]
};

export default defineComponent({
    name: 'designer-ux-panel',
    components: {
        pm,
        DeleteOutlined,
    },
    props: {
        element: {
            type: Object as PropType<IDesignerComponent>,
            required: false,
        },
    },
    data() {
        return {
            showPm: false,
            eventIndex: 0,
        };
    },
    computed: {
        ...mapState(useEditorStore, {
            componentList: 'componentList',
        }),
        // 当前组件的所有属性
        eventConfigs() {
            if (!this.element) return [];
            const comp = this.componentList.find(c => c.type === this.element!.type);
            return (comp && comp.eventConfigs) || [];
        },
        eventList(): TEventList[] {
            if (this.element && this.eventConfigs) {
                const eventList: TEventList[] = [];
                this.eventConfigs.forEach(config => {
                    eventList.push({
                        key: config.eventName,
                        label: config.eventName,
                        types: config.eventTypes
                    });
                });
                return eventList;
            }
            else {
                return [];
            }
        }
    },
    methods: {
        // 添加事件
        addEvent() {
            if (!this.eventList.length) return false;
            eventFactory.pushEvent(this.element!, {
                eventName: this.eventList[0].key,
                eventType: EnumEventType.script,
                funcName: '',
                funcStr: '',
            });
        },
        deleteEvent(index: number) {
            eventFactory.removeEvent(this.element!, index);
        },
        showParamsModal(index: number) {
            this.eventIndex = index;
            this.showPm = true;
        },
        onParamCheck(paramInfo: any) {
            if (this.element && this.element.events) {
                if (paramInfo.type !== 'function') {
                    alert('事件只能绑定方法，请重新选择!');
                    return;
                }
                this.element!.events[this.eventIndex].funcName = paramInfo.name;
                this.showPm = false;
            }
        },
        renderEventList() {
            if (this.element && this.element.events) {
                return this.element.events.map((event, index) => {
                    return (
                        <div class="item">
                            <div class="label">
                                <a-select v-model:value={event.eventName}>
                                    {this.eventList.map(name => (
                                        <a-select-option value={name.key}>
                                            {name.label}
                                        </a-select-option>
                                    ))}
                                </a-select>
                            </div>
                            <div class="value">
                                {!event.funcName ? (
                                    <a-button onClick={() => this.showParamsModal(index)}>
                                        选择方法
                                    </a-button>
                                ) : (
                                    <span>{event.funcName}</span>
                                )}
                                <delete-outlined onClick={() => this.deleteEvent(index)} />
                            </div>
                        </div>
                    );
                });
            } else return undefined;
        },
    },
    render() {
        return (
            <div class="designer-ux-panel">
                <div class="section ux">
                    <h3>事件绑定</h3>
                    {this.renderEventList()}
                </div>
                <a-button type="primary" class="btn-add-event" onClick={this.addEvent}>
                    添加
                </a-button>
                <pm
                    v-model:visible={this.showPm}
                    element={this.element}
                    eventIndex={this.eventIndex}
                    forceRender={true}
                    onParamCheck={(info: any) => this.onParamCheck(info)}
                />
            </div>
        );
    },
});

