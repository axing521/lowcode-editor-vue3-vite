import { EnumComponentGroup, EnumComponentType } from 'tdp-editor-types/src/enum/components';
import type {
    IDesignerComponent,
    registerComponentFunc,
} from 'tdp-editor-types/src/interface/designer';
import type { ICardProps } from './interface';
import Card from './Card.vue';
import { EnumSelectorName } from 'tdp-editor-types/src/enum/designer';
import type { ISelectorSelectOptions } from 'tdp-editor-types/src/interface/designer/selector';

export default Card;

export const register: registerComponentFunc = function () {
    const card: IDesignerComponent<ICardProps> = {
        key: '',
        label: '卡片',
        icons: 'Cards',
        group: EnumComponentGroup.layout,
        type: EnumComponentType.card,
        isFormer: true,
        order: 200,
        list: [],
        propsConfigs: [
            {
                key: 'flexCard',
                label: '弹性布局',
                selector: EnumSelectorName.switch,
            },
            {
                key: 'layout',
                label: '布局方式',
                selector: {
                    name: EnumSelectorName.select,
                    options: {
                        items: [
                            { key: 'row', label: '横向布局' },
                            { key: 'column', label: '纵向布局' },
                        ],
                    } as ISelectorSelectOptions,
                },
            },
            {
                key: 'wrap',
                label: '允许换行',
                selector: EnumSelectorName.switch,
            },
        ],
        cssConfigs: ['display', 'flex', 'width'],
    };
    return card;
};
