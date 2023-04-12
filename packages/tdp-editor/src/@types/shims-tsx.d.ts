import Vue, { VNode } from 'vue';
import { IDesignerComponent } from 'tdp-editor-types/interface/designer';
import type AppVarController from 'tdp-editor-common/controller/AppVarController';
import type AppController from 'tdp-editor-common/controller/AppController';
import type EditorController from 'tdp-editor-common/controller/EditorController';
import type SelectorManager from '../selectors/SelectorManager';

declare global {
    namespace JSX {
        // tslint:disable no-empty-interface
        interface Element extends VNode {}
        // tslint:disable no-empty-interface
        interface ElementClass extends Vue {}
        interface IntrinsicElements {
            [elem: string]: any;
        }
        interface HTMLAttributes {
            slot: string;
        }
    }
}

declare module 'vue/types/options' {
    interface ComponentOptions<V extends Vue> {
        [elem: string]: any;
    }
}

declare module 'vue' {
    interface ComponentCustomProperties {
        $clipboard: (text: string) => void;
        $default_componentList: IDesignerComponent[];
        $custom_componentList: IDesignerComponent[];
        $AppController: typeof AppController;
        $AppVarController: typeof AppVarController;
        $EditorController: typeof EditorController;
        $selectorManager: typeof SelectorManager;
    }
}
