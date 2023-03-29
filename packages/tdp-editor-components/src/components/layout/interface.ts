import type { IComponentState } from 'tdp-editor-types/interface/app/components';
import type { EnumComponentType } from 'tdp-editor-types/enum/components';
export interface ILayoutState extends IComponentState<ILayoutProps> {
    type: EnumComponentType.layout;
}

export interface ILayoutProps {
    showShadow?: boolean;
}
