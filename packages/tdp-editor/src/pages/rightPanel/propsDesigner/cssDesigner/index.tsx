import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import { mapState } from 'pinia';
import * as monaco from 'monaco-editor';
import './index.less';
import type { IDesignerComponent } from 'tdp-editor-types/src/interface/designer';
import { cssFactory } from 'tdp-editor-common/src';
import CssBoxDesigner from '../cssBoxDesigner.vue';
import CssWidthSelector from '../../../../selectors/cssSelectors/widthSelector';
import CssColorSelector from '../../../../selectors/cssSelectors/colorSelector';
import { useEditorStore } from 'tdp-editor-common/src/stores/editorStore';

let monacoEditor: monaco.editor.IStandaloneCodeEditor | undefined = undefined;

export default defineComponent({
    name: 'designer-css-panel',
    components: {
        CssWidthSelector,
        CssColorSelector,
        CssBoxDesigner,
    },
    props: {
        element: {
            type: Object as PropType<IDesignerComponent>,
            required: false,
        },
    },
    data() {
        return {
            showMonaco: false,
        };
    },
    computed: {
        ...mapState(useEditorStore, {
            componentList: 'componentList',
        }),
    },
    methods: {
        initMonaco() {
            if (!monacoEditor) {
                monacoEditor = monaco.editor.create(
                    document.getElementById('fd_css_designer_monaco')!,
                    {
                        language: 'css',
                        value: cssFactory.getCssValue(this.element!, 'styleText') || '',
                        minimap: { enabled: true },
                    }
                );
            } else {
                monacoEditor.setValue(cssFactory.getCssValue(this.element!, 'styleText') || '');
            }
        },
        openMonaco() {
            this.showMonaco = true;
            setTimeout(() => {
                this.initMonaco();
            }, 200);
        },
        closeMonaco() {
            this.showMonaco = false;
        },
        saveMonaco() {
            this.showMonaco = false;
            if (monacoEditor) {
                const styleText = monacoEditor.getValue();
                cssFactory.setCssValue(this.element!, 'styleText', styleText);
            }
        },
        renderCssList() {
            if (!this.element) return null;
            const componentList = this.componentList as IDesignerComponent[];
            const comp = componentList.find(c => c.type === this.element!.type);
            if (this.element && comp && comp.cssConfigs) {
                return comp.cssConfigs.map(c => {
                    if (c === 'position') {
                        return (
                            <div class="item">
                                <div class="label">定位</div>
                                <div class="value">
                                    <a-select
                                        value={cssFactory.getCssValue(this.element!, 'position')}
                                        onChange={(value: string) =>
                                            cssFactory.setCssValue(this.element!, 'position', value)
                                        }
                                    >
                                        <a-select-option value="">请选择</a-select-option>
                                        <a-select-option value="relative">相对定位</a-select-option>
                                        <a-select-option value="absolute">绝对定位</a-select-option>
                                        <a-select-option value="fixed">fixed</a-select-option>
                                    </a-select>
                                </div>
                            </div>
                        );
                    } else if (c === 'textAlign') {
                        return (
                            <div class="item">
                                <div class="label">内容对齐</div>
                                <div class="value">
                                    <a-select
                                        value={cssFactory.getCssValue(this.element!, 'textAlign')}
                                        onChange={(value: string) =>
                                            cssFactory.setCssValue(
                                                this.element!,
                                                'textAlign',
                                                value
                                            )
                                        }
                                    >
                                        <a-select-option value="">请选择</a-select-option>
                                        <a-select-option value="left">左对齐</a-select-option>
                                        <a-select-option value="center">居中</a-select-option>
                                        <a-select-option value="right">右对齐</a-select-option>
                                    </a-select>
                                </div>
                            </div>
                        );
                    } else if (c === 'display') {
                        return (
                            <div class="item">
                                <div class="label">显示类型</div>
                                <div class="value">
                                    <a-select
                                        value={cssFactory.getCssValue(this.element!, 'display')}
                                        onChange={(value: string) =>
                                            cssFactory.setCssValue(this.element!, 'display', value)
                                        }
                                    >
                                        <a-select-option value="">请选择</a-select-option>
                                        <a-select-option value="flex">flex</a-select-option>
                                        <a-select-option value="block">块元素</a-select-option>
                                        <a-select-option value="inline-block">
                                            行内块元素
                                        </a-select-option>
                                        <a-select-option value="inline">行内元素</a-select-option>
                                    </a-select>
                                </div>
                            </div>
                        );
                    } else if (c === 'width') {
                        return (
                            <div class="item">
                                <div class="label">宽度</div>
                                <div class="value">
                                    <css-width-selector
                                        element={this.element}
                                        propertyName="width"
                                    />
                                </div>
                            </div>
                        );
                    } else if (c === 'height') {
                        return (
                            <div class="item">
                                <div class="label">高度</div>
                                <div class="value">
                                    <css-width-selector
                                        element={this.element}
                                        propertyName="height"
                                    />
                                </div>
                            </div>
                        );
                    } else if (c === 'backgroundColor') {
                        return (
                            <div class="item">
                                <div class="label">背景色</div>
                                <div class="value">
                                    <css-color-selector
                                        element={this.element}
                                        propertyName="backgroundColor"
                                    />
                                </div>
                            </div>
                        );
                    }
                });
            }
        },
    },
    render() {
        return (
            <div class="designer-css-panel">
                <div class="section">
                    <div class="item">
                        <div class="label">边距</div>
                        <div class="value">
                            <css-box-designer element={this.element} />
                        </div>
                    </div>
                    {this.renderCssList()}
                    <div class="item">
                        <div class="label">css代码</div>
                        <div class="value">
                            <a-button onClick={this.openMonaco}>编辑</a-button>
                        </div>
                    </div>
                </div>
                <div id="fd_css_monaco_box" style={{ display: this.showMonaco ? 'block' : 'none' }}>
                    <div class="box-buttons">
                        <a-button type="link" onClick={this.closeMonaco}>
                            关闭
                        </a-button>
                        <a-button type="primary" onClick={this.saveMonaco}>
                            确定
                        </a-button>
                    </div>
                    <div id="fd_css_designer_monaco"></div>
                </div>
            </div>
        );
    },
});
