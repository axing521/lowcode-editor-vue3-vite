import { defineComponent } from 'vue';
import { mapState } from 'pinia';
import { useEditorStore } from 'tdp-editor-common/src/stores/editorStore';
import { useAppStore } from 'tdp-editor-common/src/stores/appStore';
import './index.less';
import DesignerUXPanel from './UXDesigner/DesignerUxPanel.vue';
import DatasourcePanel from './UXDesigner/DatasourcePanel.vue';
import DesignerPropsPanel from './propsDesigner/index.vue';

export default defineComponent({
    name: 'editor-right-panel',
    components: {
        DesignerPropsPanel,
        DatasourcePanel,
        DesignerUXPanel,
    },
    computed: {
        ...mapState(useEditorStore, {
            selectedComponent: 'selectedComponent',
        }),
        ...mapState(useAppStore, {
            activePage: 'activePage',
        }),
    },
    render() {
        const selectedComponent = this.selectedComponent || this.activePage;
        return (
            <a-tabs class="editor-right-box">
                <a-tab-pane key="props" tab="属性">
                    {/*// @ts-ignore */}
                    <DesignerPropsPanel element={selectedComponent} />
                </a-tab-pane>
                <a-tab-pane key="ux" tab="高级">
                    {/*// @ts-ignore */}
                    <DesignerUXPanel element={selectedComponent} />
                    <datasource-panel element={selectedComponent} />
                </a-tab-pane>
            </a-tabs>
        );
    },
});
