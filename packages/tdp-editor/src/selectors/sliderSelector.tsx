import type { ISliderSelectorOptions } from 'tdp-editor-types/interface/designer/selector';
import { EnumPropsValueType } from 'tdp-editor-types/enum/components';
import type { IDesignerComponent, IPropsConfig } from 'tdp-editor-types/interface/designer';
import propsFactory from 'tdp-editor-utils/propsFactory';

export default function sliderSelector(
    element: IDesignerComponent,
    props: IPropsConfig<{ k: any }>,
    options: ISliderSelectorOptions
) {
    console.log('sliderSelector', element, props, options);
    return (
        <a-row>
            <a-col span={12}>
                <a-slider
                    v-model:value={element.props![props.key].value}
                    min={options.min}
                    max={options.max}
                />
            </a-col>
            <a-col span={6}>
                <a-input-number
                    v-model:value={element.props![props.key].value}
                    min={options.min}
                    max={options.max}
                    style="marginLeft: 5px"
                />
            </a-col>
        </a-row>
    );
}
