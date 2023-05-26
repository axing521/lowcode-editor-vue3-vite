import type { IComponentState } from 'tdp-editor-types/src/interface/app/components';
import type { EnumComponentType } from 'tdp-editor-types/src/enum/components';
export interface ITextState extends IComponentState<ITextProps> {
    type: EnumComponentType.button;
}

export interface ITextProps {
    text?: string;
}
