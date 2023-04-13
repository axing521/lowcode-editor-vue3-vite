import { defineAsyncComponent } from 'vue';
import { EnumSelectorName } from 'tdp-editor-types/src/enum/designer';
import type { ISelectorSliderOptions } from 'tdp-editor-types/src/interface/designer/selector';
import {
    EnumComponentGroup,
    EnumComponentType,
    EnumEventName,
    EnumEventType,
    EnumPropsValueType,
} from 'tdp-editor-types/src/enum/components';
import type {
    IDesignerComponent,
    registerComponentFunc,
} from 'tdp-editor-types/src/interface/designer';
import type { IRateProps } from './interface';
export default defineAsyncComponent(() => import('./rateRenderer.vue'));

export const register: registerComponentFunc = function () {
    const rate: IDesignerComponent<IRateProps> = {
        key: '',
        code: '',
        label: '评分',
        icons: 'Ratings',
        group: EnumComponentGroup.form,
        type: EnumComponentType.rate,
        isFormer: true,
        listGroup: 'business',
        order: 307,
        getDefaultProps: () => {
            return {
                label: {
                    type: EnumPropsValueType.string,
                    value: '',
                },
                defaultValue: {
                    type: EnumPropsValueType.number,
                    value: 3,
                },
            };
        },
        propsConfigs: [
            {
                key: 'count',
                label: 'star总数',
                selector: {
                    name: EnumSelectorName.slider,
                    options: {
                        max: 5,
                        min: 1,
                    } as ISelectorSliderOptions,
                },
            },
        ],
        eventConfigs: [
            { eventName: EnumEventName.hoverChange, eventTypes: [EnumEventType.script] },
            { eventName: EnumEventName.blur, eventTypes: [EnumEventType.script] },
        ],
    };
    return rate;
};
