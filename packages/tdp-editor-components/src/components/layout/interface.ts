import type { IComponentState } from 'tdp-editor-types/src/interface/app/components';
import type { EnumComponentType } from 'tdp-editor-types/src/enum/components';
export interface ILayoutState extends IComponentState<ILayoutProps> {
    type: EnumComponentType.layout | EnumComponentType.page;
}

export interface ILayoutProps {
    showShadow?: boolean;
}
