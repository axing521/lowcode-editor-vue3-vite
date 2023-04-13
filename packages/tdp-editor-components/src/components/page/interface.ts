import type { IComponentState } from 'tdp-editor-types/interface/app/components';
import type { EnumComponentType } from 'tdp-editor-types/enum/components';
export interface IPageState extends IComponentState<IPageProps> {
    type: EnumComponentType.button;
}

export interface IPageProps {
    title?: string;
}
