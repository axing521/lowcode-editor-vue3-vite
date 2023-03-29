import type { ComponentPublicInstance } from 'vue';
import type { EnumComponentType } from '../../enum/components';
import type { EnumRuleType } from '../../enum/components/form';
import type { IComponentState } from '../app/components';

export interface IFormInfo {
    formFieldName: string;
    rules?: IFormRules[];
}

export interface IFormField {
    key: string; // 组件id
    name: string; // 字段名
    type: EnumComponentType;
    state: IComponentState;
    instance: ComponentPublicInstance;
    rules: IFormRules[]; // 校验规则
}

export interface IFormRules {
    ruleType: EnumRuleType;
    message: string;
    regText?: string;
}

export type IFieldCallbackRule = (value: any) => string | boolean;
