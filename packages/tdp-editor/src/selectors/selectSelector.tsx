import { EnumPropsValueType } from 'tdp-editor-types/enum/components';
import type { IDesignerComponent, IPropsConfig } from 'tdp-editor-types/interface/designer';
import propsFactory from 'tdp-editor-utils/propsFactory';

export default function selectSelector(
    element: IDesignerComponent,
    props: IPropsConfig<{ k: any }>
) {
    return (
        <a-select
            value={propsFactory.getPropsValue(element, props.key)}
            onChange={(value: string) =>
                propsFactory.setPropsValue(element, props.key, value, EnumPropsValueType.string)
            }
        >
            {props.selectOptions &&
                props.selectOptions.map(option => (
                    <a-select-option value={option.key}>{option.label}</a-select-option>
                ))}
        </a-select>
    );
}
