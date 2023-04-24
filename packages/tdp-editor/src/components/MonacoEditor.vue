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

monaco.languages.registerCompletionItemProvider('javascript', {
    provideCompletionItems(model, position) {
        const varController = useVarControler();
        const lineContent = model.getLineContent(position.lineNumber);
        const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: 1,
            endColumn: 2,
        };
        const suggestions: monaco.languages.CompletionItem[] = [];
        if (lineContent.lastIndexOf('$info.$g.') === lineContent.length - 9) {
            const globalVars = varController.getGlobalVars();
            for (const varKey in globalVars) {
                if (Object.prototype.hasOwnProperty.call(globalVars, varKey)) {
                    suggestions.push({
                        label: varKey,
                        range,
                        kind: monaco.languages.CompletionItemKind['Property'],
                        insertText: varKey,
                    });
                }
            }
        } else if (lineContent.lastIndexOf('$info.$p.') === lineContent.length - 8) {
            const pageVars = varController.getCurrentPageVars();
            for (const varKey in pageVars) {
                if (Object.prototype.hasOwnProperty.call(pageVars, varKey)) {
                    suggestions.push({
                        label: varKey,
                        range,
                        kind: monaco.languages.CompletionItemKind['Property'],
                        insertText: varKey,
                    });
                }
            }
        }
        return {
            suggestions: [
                {
                    label: 'test',
                    kind: monaco.languages.CompletionItemKind['Property'],
                    insertText: 'test',
                    range,
                },
            ],
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
