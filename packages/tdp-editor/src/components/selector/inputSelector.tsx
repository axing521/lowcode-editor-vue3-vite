import { EnumPropsValueType } from 'tdp-editor-types/enum/components';
import type { IDesignerComponent, IPropsConfig } from 'tdp-editor-types/interface/designer';
import propsFactory from 'tdp-editor-utils/propsFactory';

export default function inputSelector(
    element: IDesignerComponent,
    props: IPropsConfig<{ k: any }>
) {
    return (
        <a-input
            value={propsFactory.getPropsValue(element, props.key)}
            onChange={(e: any) => {
                propsFactory.setPropsValue(
                    element,
                    props.key,
                    e.target.value,
                    EnumPropsValueType.string
                );
            }}
        ></a-input>
    );
}
