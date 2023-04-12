import { defineComponent } from 'vue';
import { mapState } from 'pinia';
import { useEditorStore } from 'tdp-editor-common/stores/editorStore';
import { useAppStore } from 'tdp-editor-common/stores/appStore';
import './index.less';
import DesignerUXPanel from './UXDesigner';
import DesignerPropsPanel from './propsDesigner/index.vue';
import DesignerDataPanel from './dataDesigner';

export default defineComponent({
    name: 'editor-right-panel',
    components: {
        DesignerPropsPanel,
        DesignerDataPanel,
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
                    {/*// @ts-ignore */}
                    <DesignerDataPanel element={selectedComponent} />
                </a-tab-pane>
            </a-tabs>
        );
    },
});
