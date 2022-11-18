import { EnumSelectorName } from 'tdp-editor-types/enum/designer';
import type { TSelectorRender } from 'tdp-editor-types/interface/designer/selector';
import { EnumPropsValueType } from 'tdp-editor-types/enum/components';
import propsFactory from 'tdp-editor-utils/propsFactory';

export const name = EnumSelectorName.input;
export const render: TSelectorRender = (element, prop) => {
    return (
        <a-input
            value={propsFactory.getPropsValue(element, prop.key)}
            onChange={(e: any) => {
                propsFactory.setPropsValue(
                    element,
                    prop.key,
                    e.target.value,
                    EnumPropsValueType.string
                );
            }}
        ></a-input>
    );
};
