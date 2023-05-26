import type {
    IComponentState,
    IBaseFormItemProps,
} from 'tdp-editor-types/src/interface/app/components';
import type { EnumComponentType } from 'tdp-editor-types/src/enum/components';
export interface IRateState extends IComponentState<IRateProps> {
    type: EnumComponentType.rate;
}

export interface IRateProps extends IBaseFormItemProps {
    value?: number;
    defaultValue?: number;
    count?: number;
}
