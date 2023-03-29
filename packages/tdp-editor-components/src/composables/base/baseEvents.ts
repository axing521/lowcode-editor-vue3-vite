import { eventFactory } from 'tdp-editor-utils';
import type { EnumEventName } from 'tdp-editor-types/enum/components';
import type {
    ISetupBaseProps,
    TEventFunc,
    TEventsMapRaw,
} from 'tdp-editor-types/interface/app/components';
import { computed, getCurrentInstance } from 'vue';
export default function _useEvents(props: ISetupBaseProps) {
    // 处理过的原始事件map对象
    const eventsMapRaw = computed(() => {
        const _eventsMap: TEventsMapRaw = new Map();
        if (props.state && props.state.events && props.state.events.length) {
            props.state.events.forEach(eventInfo => {
                const eventFunc = new Function(
                    '$event',
                    '$info',
                    `try{${eventInfo.funcStr}}catch(e){console.warn(e);}`
                ) as TEventFunc;
                if (_eventsMap.has(eventInfo.eventName)) {
                    _eventsMap.get(eventInfo.eventName)!.push({
                        func: eventFunc,
                        eventType: eventInfo.eventType,
                        funcName: eventInfo.funcName,
                    });
                }
            });
        }
        return _eventsMap;
    });

    /**
     * 触发指定事件名的处理函数
     * @param params 要出发的事件
     */
    const triggerEvent = (params: {
        eventName: EnumEventName;
        $event?: any;
        extendParams?: Record<string, any>;
    }) => {
        const instance = getCurrentInstance();
        eventFactory.triggerEvent({
            eventName: params.eventName,
            eventsMapRaw: eventsMapRaw.value,
            instance: instance,
            $g: {},
            $p: {},
            $event: params.$event,
            extendParams: params.extendParams,
        });
    };
    return {
        eventsMapRaw,
        triggerEvent,
    };
}
