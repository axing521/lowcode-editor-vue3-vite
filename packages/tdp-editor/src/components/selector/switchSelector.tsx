import { EnumPropsValueType } from 'tdp-editor-types/enum/components';
import type { IDesignerComponent, IPropsConfig } from 'tdp-editor-types/interface/designer';
import propsFactory from 'tdp-editor-utils/propsFactory';

export default function switchSelector(
    element: IDesignerComponent,
    props: IPropsConfig<{ k: any }>
) {
    return (
        <a-switch
            checked={propsFactory.getPropsValue(element, props.key)}
            onChange={(checked: boolean) => {
                propsFactory.setPropsValue(element, props.key, checked, EnumPropsValueType.boolean);
            }}
        />
    );
}
