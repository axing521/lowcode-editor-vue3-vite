import { createApp as createVueApp } from 'vue';
import App from './App.vue';
import createRouter from './router';
// 引入editor
import editor from 'tdp-editor/src/main';

const app = createVueApp(App);
const router = createRouter();
app.use(router);

console.log('demo app', app);

router.isReady().then(() => {
    app.mount('#app');
    editor.createEditor({
        container: '#demo-body',
    });
});
