import type { IDesignerComponent } from 'tdp-editor-types/interface/designer';
import { EnumAppEnv } from 'tdp-editor-types/enum';
import { EnumComponentGroup } from 'tdp-editor-types/enum/components';
import { utils } from 'tdp-editor-common';

export const $log = process.env.VITE_APP_ENV === EnumAppEnv.production ? () => {} : console.log;
export const $warn = process.env.VITE_APP_ENV === EnumAppEnv.production ? () => {} : console.warn;
export const $error = process.env.VITE_APP_ENV === EnumAppEnv.production ? () => {} : console.error;

export const newComponentJson = (originData: IDesignerComponent) => {
    const newId = utils.$getUUID(originData.type);
    // eslint-disable-next-line
            const { eventConfigs, propsConfigs, cssConfigs, getDefaultCss, getDefaultProps, ...newProps } = originData;
    const newComponent = {
        ...newProps,
        key: newId,
        name: newId,
        list: [],
    };
    // 如果添加的组件是form组件，追加formInfo属性
    if (originData.group === EnumComponentGroup.form) {
        newComponent.formInfo = {
            formFieldName: newId,
            rules: [],
        };
    }
    // 设置默认属性
    if (getDefaultProps && typeof getDefaultProps === 'function') {
        newComponent.props = getDefaultProps();
    }
    // 设置默认样式
    if (getDefaultCss && typeof getDefaultCss === 'function') {
        newComponent.css = getDefaultCss();
    }
    return newComponent;
};
