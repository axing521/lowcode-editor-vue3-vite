import type { App } from 'vue';
export default function registerDirectiveDrag(app: App) {
    app.directive('fd-drag', {
        created(el, binding, vnode) {
            console.log('fd-drag created', el, binding, vnode);
        },
        mounted(el, binding, vnode) {
            console.log('fd-drag mounted', el, binding, vnode);
        },
        updated(el, binding, vnode) {
            console.log('fd-drag updated', el, binding, vnode);
        },
    });
}
