import type { IComponentState } from 'tdp-editor-types/src/interface/app/components';
import type { EnumComponentType } from 'tdp-editor-types/src/enum/components';
import type AppVar from 'tdp-editor-common/src/controller/AppVar';
export interface IPageState extends IComponentState<IPageProps> {
    type: EnumComponentType.page;
    vars?: Record<string, AppVar>;
    funcs?: Record<string, any>;
}

export interface IPageProps {
    title?: string;
}
