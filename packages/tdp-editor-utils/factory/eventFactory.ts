import type { ComponentInternalInstance } from 'vue';
import type {
    IComponentState,
    IComponentEvent,
    TEventsMapRaw,
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
        $p: Record<string, any>;
        instance: ComponentInternalInstance | null;
        $event?: any;
        extendParams?: Record<string, any>;
    }) {
        const events = params.eventsMapRaw.get(params.eventName);
        const $info = Object.assign(
            {},
            {
                comp: params.instance,
                $g: params.$g,
                $p: params.$p,
            },
            params.extendParams
        );
        if (events) {
            events.forEach(event => {
                event.func.call(params.instance, params.$event, $info);
            });
        }
    },
};

export default EventFactory;
