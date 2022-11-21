import type { App } from 'vue';
import copy from 'copy-to-clipboard';
export default function useClipboard(app: App) {
    app.config.globalProperties.$clipboard = function (text: string) {
        console.log('copy text: ', text);
        copy(text);
    };
}
