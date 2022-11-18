import type {
    ISelectorSelectOptions,
    TSelectorRender,
} from 'tdp-editor-types/interface/designer/selector';
import { EnumPropsValueType } from 'tdp-editor-types/enum/components';
import propsFactory from 'tdp-editor-utils/propsFactory';
import { EnumSelectorName } from 'tdp-editor-types/enum/designer';

export const name = EnumSelectorName.select;
export const render: TSelectorRender<unknown, ISelectorSelectOptions> = (
    element,
    prop,
    options
) => {
    return (
        <a-select
            value={propsFactory.getPropsValue(element, prop.key)}
            onChange={(value: string) =>
                propsFactory.setPropsValue(element, prop.key, value, EnumPropsValueType.string)
            }
        >
            {options.items &&
                options.items.map(option => (
                    <a-select-option value={option.key}>{option.label}</a-select-option>
                ))}
        </a-select>
    );
};
