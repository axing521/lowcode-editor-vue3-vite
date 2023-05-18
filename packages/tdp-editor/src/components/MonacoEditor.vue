<template>
    <div id="tdp-monaco-editor"></div>
</template>
<style lang="less">
#tdp-monaco-editor {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    text-align: left;
}
</style>
<script setup lang="ts">
import { onBeforeUnmount, onMounted, watch } from 'vue';
import * as monaco from 'monaco-editor';
import { useVarControler } from 'tdp-editor-common/src/controller';

let monacoEditor: monaco.editor.IStandaloneCodeEditor | undefined = undefined;

monaco.languages.typescript.javascriptDefaults.addExtraLib(`
    interface ITDP {
        App: {
            changePage(pageKey: string): void;
        };
        Utils: any;
        vue: {
            ref: Function;
            reactive: Function;
            computed: Function;
            watch: Function;
            watchEffect: Function;
        };
    };
    declare var $tdp: ITDP;
`);

monaco.languages.registerCompletionItemProvider('javascript', {
    provideCompletionItems(model, position) {
        const varController = useVarControler();
        const lineContent = model.getLineContent(position.lineNumber);
        const word = model.getWordUntilPosition(position);
        const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
        };
        const suggestions: monaco.languages.CompletionItem[] = [];
        if (lineContent.match(/\$g\.$/)) {
            const globalVars = varController.getGlobalVars();
            for (const varKey in globalVars) {
                if (Object.prototype.hasOwnProperty.call(globalVars, varKey)) {
                    suggestions.push({
                        label: varKey,
                        range,
                        kind: monaco.languages.CompletionItemKind.Field,
                        insertText: varKey,
                    });
                }
            }
        } else if (lineContent.match(/\$p\.$/)) {
            const pageVars = varController.getCurrentPageVars();
            for (const varKey in pageVars) {
                if (Object.prototype.hasOwnProperty.call(pageVars, varKey)) {
                    suggestions.push({
                        label: varKey,
                        range,
                        kind: monaco.languages.CompletionItemKind.Field,
                        insertText: varKey,
                    });
                }
            }
        }
        return {
            suggestions: suggestions,
        };
    },
    triggerCharacters: ['.', ' '],
});
const props = defineProps<{
    value: string;
    language: 'javascript' | 'typescript' | 'css' | 'json';
}>();
watch(
    () => props.value,
    (value, oldValue) => {
        if (!value && monacoEditor) {
            monacoEditor.setValue('');
        } else if (value !== oldValue && monacoEditor) {
            monacoEditor.setValue(value);
        }
    }
);
watch(
    () => props.language,
    (value, oldValue) => {
        if (monacoEditor && value !== oldValue) {
            monacoEditor.dispose();
            initMonaco();
        }
    }
);
onMounted(() => {
    initMonaco();
});
onBeforeUnmount(() => {
    if (monacoEditor) {
        monacoEditor.dispose();
    }
});

const initMonaco = () => {
    if (!monacoEditor) {
        monacoEditor = monaco.editor.create(document.getElementById('tdp-monaco-editor')!, {
            language: props.language,
            theme: 'vs',
            value: props.value || '',
            minimap: { enabled: false },
            automaticLayout: true,
            fontSize: 15,
        });
    }
};

const getMonacoValue = () => {
    if (!monacoEditor) return '';
    return monacoEditor.getValue();
};
const setMonacoValue = (value: string) => {
    if (!monacoEditor) return '';
    return monacoEditor.setValue(value);
};

defineExpose({
    getValue: getMonacoValue,
    setValue: setMonacoValue,
});
</script>
