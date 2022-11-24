<template>
    <a-modal
        :visible="props.visible"
        title="新建页面"
        :width="800"
        :footer="null"
        @cancel="clickCancel"
    >
        <div class="new-page-modal">
            <template v-if="step === -1">
                <div class="form-item">
                    <div class="label">页面名称:</div>
                    <div class="value">
                        <a-input v-model:value="pageName"></a-input>
                    </div>
                </div>
                <div class="form-item">
                    <div class="label">页面编码:</div>
                    <div class="value">
                        <a-input v-model:value="pageCode"></a-input>
                    </div>
                </div>
                <div class="form-item">
                    <div class="label">页面类型:</div>
                    <div class="value">
                        <div
                            class="type-item"
                            v-for="item in pageTypeList"
                            :key="item.key"
                            :class="{ selected: item.selected }"
                            @click.stop="clickPageType(item.key)"
                        >
                            <div class="item-icon"></div>
                            <div class="item-info">
                                <div class="item-title">{{ item.title }}</div>
                                <div class="item-des">{{ item.des }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
            <template v-else-if="step > -1">
                <!-- <ImportCSV v-model="step" ref="$csvRef" /> -->
                <span ref="$csvRef">导入csv文件</span>
            </template>
            <div class="buttons">
                <a-button v-if="step > -1" @click="clickPre">上一步</a-button>
                <a-button @click="clickCancel">取消</a-button>
                <a-button v-if="step !== 0" type="primary" @click="clickOk">
                    {{ okButtonText }}
                </a-button>
            </div>
        </div>
    </a-modal>
</template>
<style lang="less">
.new-page-modal {
    position: relative;
    .form-item {
        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-start;
        align-items: center;
        line-height: 44px;
        transition: all 0.3s;
        .label {
            width: 80px;
            flex: 0 0 auto;
        }
        .value {
            flex: 1;
            display: flex;
            flex-flow: row nowrap;
            justify-content: space-between;
            align-items: center;
        }
        .type-item {
            width: 49%;
            display: flex;
            flex-flow: row wrap;
            justify-content: flex-start;
            align-items: center;
            border-radius: 4px;
            cursor: pointer;
            border: 1px solid #e1e1e1;
            &.selected {
                border-color: #1890ff;
            }
            .item-icon {
                width: 80px;
                height: 50px;
                flex: 0 0 auto;
                margin: 10px;
                background-color: salmon;
            }
            .item-info {
                flex: 1;
                line-height: 22px;
            }
        }
    }
    .buttons {
        margin-top: 20px;
        text-align: right;
        button + button {
            margin-left: 10px;
        }
    }
}
</style>
<script lang="ts" setup>
import { ref, reactive, computed } from 'vue';
import type { IPageStoreState } from 'tdp-editor-types/interface/store';
import { useEditorControler } from 'tdp-editor-utils/controller';

enum EnumPageType {
    emptyForm = 'emptyForm',
    csvOrExcel = 'csvOrExcel',
}
const $emit = defineEmits<{
    (e: 'update:visible', visible: boolean): void;
}>();
const props = defineProps<{
    visible?: boolean;
}>();

const $csvRef = ref(null);
const step = ref(-1);
const pageName = ref('');
const pageCode = ref('');
const pageType = ref(EnumPageType.emptyForm);
const pageTypeList = reactive([
    {
        key: EnumPageType.emptyForm,
        title: '新建表单',
        des: '基于空白页面创建表单',
        selected: true,
    },
    {
        key: EnumPageType.csvOrExcel,
        title: '从CSV/Excel导入',
        des: '导入现有数据创建表单',
        selected: false,
    },
]);
// 确定按钮文本
const okButtonText = computed(() => {
    if (pageType.value === EnumPageType.emptyForm) {
        return '确定';
    } else if (step.value >= 2) {
        return '确定';
    } else {
        return '下一步';
    }
});
// 切换要添加的页面类型
const clickPageType = (type: EnumPageType) => {
    pageType.value = type;
    pageTypeList.forEach(t => {
        t.selected = t.key === type;
    });
};
// 上一步点击事件
const clickPre = () => {
    if (step.value > -1) step.value--;
};
// 确定按钮点击事件
const clickOk = () => {
    const editorController = useEditorControler();
    // 创建空form
    if (pageType.value === EnumPageType.emptyForm) {
        editorController.addPage({
            page: {
                label: pageName.value,
                code: pageCode.value,
            } as IPageStoreState,
        });
        $emit('update:visible', false);
        resetForm();
    }
    // 从csv导入
    else {
        if (step.value < 2) {
            step.value++;
        } else {
            if ($csvRef.value) {
                const form = ($csvRef.value as any).getFormDesign();
                editorController.importCsvData({
                    pageName: pageName.value,
                    pageCode: pageCode.value,
                    data: form,
                });
            }
            $emit('update:visible', false);
            resetForm();
        }
    }
};
// 重置form表单数据
const resetForm = () => {
    pageName.value = '';
    pageCode.value = '';
    pageType.value = EnumPageType.emptyForm;
    step.value = -1;
};
// 取消事件
const clickCancel = () => {
    step.value = -1;
    $emit('update:visible', false);
};
</script>
