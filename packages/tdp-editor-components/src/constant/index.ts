import type { IComponentState } from 'tdp-editor-types/interface/app/components';
import type { PropType } from 'vue';

export const COMPONENTCOMMONPROPS = {
    state: {
        required: true,
        type: Object as PropType<IComponentState>,
        default: () => ({}),
    },
    parentId: {
        type: String,
        required: true,
        default: () => '',
    },
    pageData: {
        type: Object,
        required: true,
        default: () => ({}),
    },
    pageMethod: {
        type: Object,
        required: true,
        default: () => ({}),
    },
};
