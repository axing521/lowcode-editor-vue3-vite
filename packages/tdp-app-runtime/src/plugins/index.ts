import type { App } from 'vue';
import type { Router } from 'vue-router';
import useAntdV from './antdv';
import useClipboard from './clipborad';
import useTDP from './tdp';
// import useVxeTable from './vxeTable';
export default function usePlugin(app: App, router: Router) {
    useAntdV(app);
    // useVxeTable(app);
    useClipboard(app);
    useTDP(app, router);
}
