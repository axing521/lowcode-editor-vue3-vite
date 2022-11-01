import type { IDesignerComponent } from 'tdp-editor-types/interface/designer';
import { useEditorStore } from '../stores/editorStore';

export default class EditorController {
    private readonly $editorStore;
    constructor() {
        this.$editorStore = useEditorStore();
    }
    addCustomerComponents(list: IDesignerComponent[]) {
        this.$editorStore.addComponents({ list });
    }
    initComponentList(list: IDesignerComponent[]) {
        this.$editorStore.initComponentList({ list });
    }
}
