import type { IDesignerComponent } from 'tdp-editor-types/interface/designer';
// import { EnumCssProerty, EnumSelectorName } from 'tdp-editor-types/enum/designer';
// import { EnumComponentGroup } from 'tdp-editor-types/enum/components';
import LycButton from './LycButton';
import LycInput from './LycInput';

export const customList: IDesignerComponent[] = [
    // {
    //     code: '',
    //     group: EnumComponentGroup.lib,
    //     key: '',
    //     label: 'antd下拉框',
    //     type: 'ASelect',
    //     listGroup: 'high',
    //     propsConfigs: [
    //         { key: 'placeholder', label: '默认文字', selector: EnumSelectorName.input },
    //         { key: 'disabled', label: '禁用', selector: EnumSelectorName.switch },
    //         { key: 'options', label: '静态数据', selector: EnumSelectorName.arrayData },
    //         { key: 'allowClear', label: '支持清空', selector: EnumSelectorName.switch },
    //     ],
    //     cssConfigs: [EnumCssProerty.width],
    // },
    // // 添加divider
    // {
    //     code: '',
    //     group: EnumComponentGroup.lib,
    //     key: '',
    //     label: 'antd分割线',
    //     type: 'ADivider',
    //     listGroup: 'high',
    //     propsConfigs: [
    //         { key: 'dashed', label: '虚线', selector: EnumSelectorName.switch },
    //         {
    //             key: 'type',
    //             label: '方向',
    //             selector: EnumSelectorName.select,
    //             selectOptions: [
    //                 { key: 'horizontal', label: '水平' },
    //                 { key: 'vertical', label: '垂直' },
    //             ],
    //         },
    //     ],
    //     cssConfigs: [EnumCssProerty.width, EnumCssProerty.height, EnumCssProerty.backgroundColor],
    // },
    // 添加自定义组件LycButton
    LycButton.componentConfig,
    LycInput.componentConfig,
];
