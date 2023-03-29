import type { IComponentState } from 'tdp-editor-types/interface/app/components';
import type { EnumComponentType } from 'tdp-editor-types/enum/components';
export interface IFormState extends IComponentState<IFormProps> {
    type: EnumComponentType.form;
}

export interface IFormProps {
    formId?: string;
    formContentId?: string;
    disable?: boolean;
    readonly?: boolean;
    name?: string;
    topTitle?: boolean;
}
