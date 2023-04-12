import { computed, getCurrentInstance } from 'vue';
import type { EnumEventName } from 'tdp-editor-types/enum/components';
import type {
    ISetupBaseProps,
    TEventFunc,
    TEventsMapRaw,
} from 'tdp-editor-types/interface/app/components';
import { eventFactory } from 'tdp-editor-common';
import { useVarControler } from 'tdp-editor-common/controller';
import useBaseInject from './baseInject';

type TExtendParams = () => Record<string, any>;
/**
 * 注册组件事件对象
 * @param props 组件的属性
 * @param extendParams 自定义事件扩展参数
 * @returns 返回事件封装对象和方法等
 */
export default function _useEvents(props: ISetupBaseProps, extendParams?: TExtendParams) {
    const instance = getCurrentInstance();
    const varController = useVarControler();
    const { getPageComponentsMap } = useBaseInject();

    // 处理funcStr的原始事件map对象
    const eventsMapRaw = computed(() => {
        const _eventsMap: TEventsMapRaw = {} as TEventsMapRaw;
        if (props.state && !props.state.events) return _eventsMap;
        props.state.events!.forEach(eventInfo => {
            const eventFunc = new Function(
                '$event',
                '$info',
                `try{${eventInfo.funcStr}}catch(e){console.warn(e);}`
            ) as TEventFunc;
            if (_eventsMap[eventInfo.eventName]) {
                _eventsMap[eventInfo.eventName].push({
                    func: eventFunc,
                    eventType: eventInfo.eventType,
                    funcName: eventInfo.funcName,
                });
            } else {
                _eventsMap[eventInfo.eventName] = [
                    {
                        func: eventFunc,
                        eventType: eventInfo.eventType,
                        funcName: eventInfo.funcName,
                    },
                ];
            }
        });
        return _eventsMap;
    });
    // 可直接绑定到vue组件的事件对象
    const eventsMap = computed(() => {
        const _extendParams = extendParams ? extendParams() : undefined;
        return eventFactory.formatEventsMapRaw({
            eventsMapRaw: eventsMapRaw.value,
            comps: getPageComponentsMap(),
            instance: instance,
            $g: varController.getGlobalVars(),
            $p: varController.getCurrentPageVars(),
            extendParams: _extendParams,
        });
    });

    /**
     * 触发指定事件名的处理函数
     * @param params 要出发的事件
     */
    const triggerEvent = (params: {
        eventName: EnumEventName;
        $event?: any; // vue事件原始$event对象
        extendParams?: Record<string, any>;
    }) => {
        eventFactory.triggerEvent({
            eventName: params.eventName,
            eventsMapRaw: eventsMapRaw.value,
            comps: getPageComponentsMap(),
            instance: instance,
            $g: varController.getGlobalVars(),
            $p: varController.getCurrentPageVars(),
            $event: params.$event,
            extendParams: params.extendParams,
        });
    };
    return {
        eventsMapRaw,
        eventsMap,
        triggerEvent,
    };
}
