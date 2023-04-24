import { EnumEventName, EnumEventType } from '../enum/components';

export const EventTypeMap = {
    [EnumEventType.script]: '自定义脚本',
    [EnumEventType.pageFunction]: '页面方法',
    [EnumEventType.appFunction]: '应用方法',
};

export const EventNameMap = {
    [EnumEventName.click]: '单击事件',
    [EnumEventName.blur]: '失去焦点',
    [EnumEventName.change]: '改变事件',
    [EnumEventName.focus]: '获得焦点',
    [EnumEventName.hoverChange]: '悬浮改变',
    [EnumEventName.mouseLeave]: '鼠标离开',
    [EnumEventName.mouseOver]: '鼠标悬浮',
};
