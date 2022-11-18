import type { VNode } from 'vue';
import type { IDesignerComponent, IPropsConfig } from 'tdp-editor-types/interface/designer';
import propsFactory from 'tdp-editor-utils/propsFactory';
import { DeleteFilled } from '@ant-design/icons-vue';
import { EnumSelectorName } from 'tdp-editor-types/enum/designer';
import type { TSelectorRender } from 'tdp-editor-types/interface/designer/selector';

// 数组数据选择器
function arrayDataPropsSelector(
    element: IDesignerComponent,
    prop: IPropsConfig
): VNode[] | undefined {
    const data: any = propsFactory.getPropsValue(element, prop.key);
    if (data && data instanceof Array && data.length) {
        return data.map((d: any, index) => {
            return (
                <li class="data-item" key={index}>
                    <a-input
                        value={d.key}
                        placeholder="key"
                        onChange={(e: any) => (d.key = e.target.value)}
                    ></a-input>
                    <a-input
                        value={d.label}
                        placeholder="label"
                        onChange={(e: any) => (d.label = e.target.value)}
                    ></a-input>
                    <DeleteFilled
                        onClick={() => propsFactory.removePropsValue(element, prop.key, index)}
                    />
                </li>
            );
        });
    } else {
        return [];
    }
}

export const name = EnumSelectorName.arrayData;
export const render: TSelectorRender = (element, prop) => {
    return (
        <div class="selector-array-data">
            <ul>{arrayDataPropsSelector(element, prop)}</ul>
            <a-button
                type="primary"
                onClick={() => {
                    const data = (propsFactory.getPropsValue(element, prop.key) || []) as any[];
                    propsFactory.pushPropsValue(element, prop.key, {
                        key: `item${data.length}`,
                        label: `item${data.length}`,
                    });
                }}
            >
                添加
            </a-button>
        </div>
    );
};
