import type { ComponentInternalInstance, ComponentPublicInstance } from 'vue';
import type {
    IComponentState,
    IComponentEvent,
    TEventsMapRaw,
    TEventsMap,
} from 'tdp-editor-types/interface/app/components';
import type { EnumEventName } from 'tdp-editor-types/enum/components';

const EventFactory = {
    getEventByIndex: (state: IComponentState, index: number) => {
        if (state && state.events && state.events[index]) {
            return state.events[index];
        } else return undefined;
    },
    getEventsByName: (state: IComponentState, eventName: EnumEventName) => {
        if (state && state.events) {
            return state.events.filter(event => event.eventName === eventName);
        } else return [];
    },
    pushEvent: (state: IComponentState, event: IComponentEvent) => {
        if (state && event) {
            if (state.events) {
                state.events.push(event);
            } else {
                state.events = [event];
            }
        }
    },
    // 删除某个event
    removeEvent(state: IComponentState, index: number): void {
        if (state && state.events && state.events.length > index) {
            state.events.splice(index, 1);
        }
    },
    // 触发某个事件的所有处理函数
    triggerEvent(params: {
        eventName: EnumEventName;
        eventsMapRaw: TEventsMapRaw;
        $g: Record<string, any>;
        $p?: Record<string, any>;
        comps?: Map<string, ComponentPublicInstance>;
        instance: ComponentInternalInstance | null;
        $event?: any;
        extendParams?: Record<string, any>;
    }) {
        // 从原始事件对象中查找是否有对应的事件
        const events = params.eventsMapRaw[params.eventName];
        const instance = params.instance && params.instance.proxy;
        // 没找到事件直接退出
        if (!events) return;
        // 封装额外参数对象
        const $info = Object.assign(
            {},
            {
                comps: params.comps || new Map(),
                comp: instance,
                $g: params.$g,
                $p: params.$p,
            },
            params.extendParams
        );
        // 循环执行每个处理函数
        events.forEach(event => {
            event.func.call(instance, params.$event, $info);
        });
    },
    /**
     * 将事件原始对象转化为可以直接绑定的事件对象
     * @param params 参数
     * @returns 返回转化后的事件对象
     */
    formatEventsMapRaw(params: {
        eventsMapRaw: TEventsMapRaw;
        $g: Record<string, any>;
        $p?: Record<string, any>;
        comps?: Map<string, ComponentPublicInstance>;
        instance: ComponentInternalInstance | null;
        extendParams?: Record<string, any>;
    }) {
        // 定义转化后的事件对象
        const _eventsMap: TEventsMap = {} as TEventsMap;
        const instance = params.instance && params.instance.proxy;
        // 循环每个事件
        Object.keys(params.eventsMapRaw).forEach(eventName => {
            // 获取传入的对应事件的额外参数
            const eventParmas =
                params.extendParams && params.extendParams[eventName]
                    ? params.extendParams[eventName]
                    : undefined;
            // 获取事件对应的具体信息(是一个数组)
            const eventInfo = params.eventsMapRaw[eventName as EnumEventName];
            // 封装额外参数对象
            const $info = Object.assign(
                {},
                {
                    comps: params.comps || new Map(),
                    comp: instance,
                    $g: params.$g,
                    $p: params.$p,
                },
                eventParmas
            );
            _eventsMap[eventName as EnumEventName] = function ($event: any) {
                eventInfo.forEach(e => {
                    e.func.call(instance, $event, $info);
                });
            };
        });
        return _eventsMap;
    },
};

export default EventFactory;
