import { EnumSelectorName } from 'tdp-editor-types/enum/designer';
import type { TSelectorRender } from 'tdp-editor-types/interface/designer/selector';
import { EnumPropsValueType } from 'tdp-editor-types/enum/components';
import propsFactory from 'tdp-editor-utils/propsFactory';

export const name = EnumSelectorName.bindData;
export const render: TSelectorRender = (element, prop, options) => {
    return (
        <div>
            <a-input
                prefix="{{"
                suffix="}}"
                value={propsFactory.getPropsValue(element, prop.key)}
                onChange={(e: any) => {
                    propsFactory.setPropsValue(
                        element,
                        prop.key,
                        e.target.value,
                        EnumPropsValueType.expression
                    );
                }}
                onPressEnter={() => {
                    options.showParamsModal &&
                        options.showParamsModal(prop.key, EnumPropsValueType.expression);
                }}
            ></a-input>
        </div>
    );
};
