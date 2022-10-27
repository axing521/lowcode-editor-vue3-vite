import { EnumPropsValueType } from 'tdp-editor-types/enum/components';
import type { IDesignerComponent, IPropsConfig } from 'tdp-editor-types/interface/designer';
import propsFactory from 'tdp-editor-utils/propsFactory';

export default function sliderSelector(
    element: IDesignerComponent,
    props: IPropsConfig<{ k: any }>
) {
    return (
        <a-row>
            <a-col span={12}>
                <a-slider
                    value={propsFactory.getPropsValue(element, props.key)}
                    onChange={(value: string) =>
                        propsFactory.setPropsValue(
                            element,
                            props.key,
                            value,
                            EnumPropsValueType.number
                        )
                    }
                    min={props.sliderMin}
                    max={props.sliderMax}
                />
            </a-col>
            <a-col span={6}>
                <a-input-number
                    value={propsFactory.getPropsValue(element, props.key)}
                    onChange={(value: string) =>
                        propsFactory.setPropsValue(
                            element,
                            props.key,
                            value,
                            EnumPropsValueType.number
                        )
                    }
                    min={props.sliderMin}
                    max={props.sliderMax}
                    style="marginLeft: 5px"
                />
            </a-col>
        </a-row>
    );
}
