import type {
    IComponentState,
    IBaseFormItemProps,
} from 'tdp-editor-types/interface/app/components';
import type { EnumComponentType } from 'tdp-editor-types/enum/components';
export interface IRateState extends IComponentState<IRateState> {
    type: EnumComponentType.rate;
}

export interface IRateProps extends IBaseFormItemProps {
    value?: number;
    defaultValue?: number;
    count?: number;
}
