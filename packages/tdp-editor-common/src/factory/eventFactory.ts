import type { ComponentInternalInstance } from 'vue';
import type {
    IComponentState,
    IComponentEvent,
    TEventsMapRaw,
    TEventsMap,
} from 'tdp-editor-types/src/interface/app/components';
import type { EnumEventName } from 'tdp-editor-types/src/enum/components';

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
    removeEventById(state: IComponentState, eventId: string): void {
        if (state && state.events && state.events.length) {
            const eventIndex = state.events.findIndex(e => e.eventId === eventId);
            if (eventIndex >= 0) state.events.splice(eventIndex, 1);
        }
    },
    // 触发某个事件的所有处理函数
    triggerEvent(params: {
        eventName: EnumEventName;
        eventsMapRaw: TEventsMapRaw;
        $g: Record<string, any>;
        $p?: Record<string, any>;
        instance: ComponentInternalInstance | null;
        $event?: any;
        extendParams?: Record<string, any>;
    }) {
        // 从原始事件对象中查找是否有对应的事件
        const funcs = params.eventsMapRaw[params.eventName];
        const instance = params.instance && params.instance.proxy;
        // 没找到事件直接退出
        if (!funcs) return;

        // 循环执行每个处理函数
        funcs.forEach(func => {
            func.call({
                $g: params.$g,
                $p: params.$p,
                $event: {
                    e: params.$event,
                    instance,
                    data: params.extendParams,
                },
            });
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
            const funcs = params.eventsMapRaw[eventName as EnumEventName];
            // 封装额外参数对象
            _eventsMap[eventName as EnumEventName] = function ($event: any) {
                funcs.forEach(func => {
                    func.call({
                        $g: params.$g,
                        $p: params.$p,
                        $event: {
                            e: $event,
                            instance,
                            data: eventParmas,
                        },
                    });
                });
            };
        });
        return _eventsMap;
    },
};

export default EventFactory;
