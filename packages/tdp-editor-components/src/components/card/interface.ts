import type { IComponentState } from 'tdp-editor-types/src/interface/app/components';
import type { EnumComponentType } from 'tdp-editor-types/src/enum/components';
export interface ICardState extends IComponentState<ICardProps> {
    type: EnumComponentType.card;
}
export type TFlexGridLayoutValue = 'row' | 'column';
export interface ICardProps {
    flexCard?: boolean;
    layout?: TFlexGridLayoutValue;
    wrap?: boolean;
}
