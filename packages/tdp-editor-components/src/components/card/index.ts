import { EnumComponentGroup, EnumComponentType } from 'tdp-editor-types/src/enum/components';
import type {
    IDesignerComponent,
    registerComponentFunc,
} from 'tdp-editor-types/src/interface/designer';
import type { ICardProps } from './interface';
import Card from './Card.vue';

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
    };
    return card;
};
