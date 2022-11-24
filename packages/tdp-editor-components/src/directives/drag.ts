import type { App } from 'vue';
export default function registerDirectiveDrag(app: App) {
    app.directive('fd-drag', {
        created(el, binding, vnode) {
            console.info('fd-drag created', el, binding, vnode);
        },
        mounted(el, binding, vnode) {
            console.info('fd-drag mounted', el, binding, vnode);
        },
        updated(el, binding, vnode) {
            console.info('fd-drag updated', el, binding, vnode);
        },
    });
}
