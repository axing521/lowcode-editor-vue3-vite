import { EnumPropsValueType } from 'tdp-editor-types/enum/components';
import type { IDesignerComponent, IPropsConfig } from 'tdp-editor-types/interface/designer';
import propsFactory from 'tdp-editor-utils/propsFactory';

export default function bindDataSelector(
    element: IDesignerComponent,
    props: IPropsConfig<{ k: any }>,
    other: {
        showParamsModal: (pmPropKey: string, pmPropValueType: EnumPropsValueType) => void;
    }
) {
    return (
        <div>
            <a-input
                prefix="{{"
                suffix="}}"
                value={propsFactory.getPropsValue(element, props.key)}
                onChange={(e: any) => {
                    propsFactory.setPropsValue(
                        element,
                        props.key,
                        e.target.value,
                        EnumPropsValueType.expression
                    );
                }}
                onPressEnter={() => {
                    other.showParamsModal(props.key, EnumPropsValueType.expression);
                }}
            ></a-input>
        </div>
    );
}
