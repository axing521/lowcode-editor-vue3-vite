import type { App } from 'vue';
import useAntdV from './antdv';
import useClipboard from './clipborad';
import useTDP from './tdp';
// import useVxeTable from './vxeTable';
export default function usePlugin(app: App) {
    useAntdV(app);
    // useVxeTable(app);
    useClipboard(app);
    useTDP(app);
}
