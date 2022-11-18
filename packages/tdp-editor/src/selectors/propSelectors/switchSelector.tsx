import { EnumSelectorName } from 'tdp-editor-types/enum/designer';
import type { TSelectorRender } from 'tdp-editor-types/interface/designer/selector';
import { EnumPropsValueType } from 'tdp-editor-types/enum/components';
import propsFactory from 'tdp-editor-utils/propsFactory';

export const name = EnumSelectorName.switch;
export const render: TSelectorRender = (element, prop) => {
    return (
        <a-switch
            checked={propsFactory.getPropsValue(element, prop.key)}
            onChange={(checked: boolean) => {
                propsFactory.setPropsValue(element, prop.key, checked, EnumPropsValueType.boolean);
            }}
        />
    );
};
