import type { ISelectorSliderOptions, TSelectorRender } from 'tdp-editor-types/interface/designer/selector';
import { EnumSelectorName } from 'tdp-editor-types/enum/designer';

export const name = EnumSelectorName.slider;
export const render: TSelectorRender<unknown, ISelectorSliderOptions> = (
    element,
    prop,
    options
) => {
    return (
        <a-row>
            <a-col span={12}>
                <a-slider
                    v-model:value={element.props![prop.key].value}
                    min={options.min}
                    max={options.max}
                />
            </a-col>
            <a-col span={6}>
                <a-input-number
                    v-model:value={element.props![prop.key].value}
                    min={options.min}
                    max={options.max}
                    style="marginLeft: 5px"
                />
            </a-col>
        </a-row>
    );
};
