import Vue, { VNode } from 'vue';
import { IDesignerComponent } from 'tdp-editor-types/src/interface/designer';
import type AppVarController from 'tdp-editor-common/src/controller/AppVarController';
import type AppController from 'tdp-editor-common/src/controller/AppController';
import type EditorController from 'tdp-editor-common/src/controller/EditorController';

declare module 'vue' {
    interface ComponentCustomProperties {
        $clipboard: (text: string) => void;
        $default_componentList: IDesignerComponent[];
        $custom_componentList: IDesignerComponent[];
        $AppController: AppController;
        $AppVarController: AppVarController;
        $EditorController: EditorController;
    }
}
