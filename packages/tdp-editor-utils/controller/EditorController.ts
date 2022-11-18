import type { IDesignerComponent } from 'tdp-editor-types/interface/designer';
import type { App } from 'vue';
import { useEditorStore } from '../stores/editorStore';

export default class EditorController {
    private readonly $editorStore = useEditorStore();
    private readonly $app: App;
    constructor(app: App) {
        this.$app = app;
    }
    addCustomerComponents(list: IDesignerComponent[]) {
        this.$editorStore.addComponents({ list });
    }
    initComponentList(list: IDesignerComponent[]) {
        this.$editorStore.initComponentList({ list });
    }
}
