<script setup lang="ts">
import { EnumComponentType } from 'tdp-editor-types/src/enum/components';
import {
    ClearOutlined,
    UserOutlined,
    CommentOutlined,
    SendOutlined,
    LoadingOutlined,
} from '../../../../tdp-editor/node_modules/@ant-design/icons-vue';
import { defineComponent } from 'vue';
import type { IComponentState } from 'tdp-editor-types/src/interface/app/components';
import type { IChatGPTProps } from './interface';
import { useBaseInject, useBaseLifecycle } from '../../composables/base';
import { $log } from 'tdp-editor-common/src/utils';

// 接收props
const allProps = defineProps<{
    state: IComponentState<IChatGPTProps>;
    parentId: string;
    props: IChatGPTProps;
    css: Record<string, any>;
}>();

// 注册组件统一的声明周期事件（必须）
useBaseLifecycle(allProps);

// 使组件可以处理自定义事件（可选）
/* const eventRaw = useBaseEvents(allProps, () => ({
    click: {
        apiKey: allProps.props.apiKey,
    },
})); */

// 使用inject方法( 可选 )
const { getAppMode } = useBaseInject();
// 获取当前运行状态
$log(getAppMode()); // 打印 当前的运行状态;
</script>

<script lang="ts">
export default defineComponent({
    name: EnumComponentType.chatGPT,
});
</script>

<template>
    <div class="overflow-hidden">
        <div class="app-bar">
            <p>ChatGPT中文版: 交互窗口</p>
            <div class="funcButton">
                <a-button shape="circle" style="margin-right: 4px">
                    <template #icon><clear-outlined /></template>
                </a-button>
                <a-button shape="circle" style="margin-right: 4px">
                    <template #icon><comment-outlined /></template>
                </a-button>
                <a-button shape="circle">
                    <template #icon><user-outlined /></template>
                </a-button>
            </div>
        </div>

        <div class="flex-1 overflow-y-auto" id="qa-list">
            <div class="QA">
                <p class="font-bold mb-5 flex">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="user-icon"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                    </svg>
                    You
                </p>
                <div>${html}</div>
            </div>

            <div class="QA">
                <p class="font-bold mb-5 flex">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="user-icon"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z"
                        />
                    </svg>
                    ChatGPT
                </p>
                <div>${marked.parse(message.value)}</div>
            </div>
        </div>

        <div id="in-progress" class="progress hidden">
            <p>ChatGPT正在处理你的请求 ❤️</p>
            <loading-outlined />
            <div class="loader"></div>
        </div>

        <div class="p-4 flex items-center">
            <div class="flex-1">
                <textarea
                    type="text"
                    rows="2"
                    class="border p-2 w-full"
                    id="question-input"
                    placeholder="请输入问题..."
                ></textarea>
            </div>
            <a-button type="primary" size="large" id="ask-button" class="p-2 ml-5">
                <template #icon><send-outlined /></template>
            </a-button>
        </div>
    </div>
</template>

<style lang="less" scoped>
.overflow-hidden {
    overflow: hidden;
    height: 90vh;
    position: relative;
    border-color: aqua;
    border-style: solid;
}

.QA {
    margin-top: 10px;
}

.user-icon {
    width: 2rem;
    height: 2rem;
    margin-right: 0.5rem;
}

.progress {
    height: 80%;
    align-items: center;

    p {
        margin-top: 60%;
    }
}

.flex-1 {
    display: flex;
    width: 90%;
    margin-top: 2px;
    flex-direction: column;
}

.app-bar {
    background: grey;
    color: white;
    padding: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 400px;

    p {
        font-size: 1.5rem;
        text-align: left;
        margin-top: 0;
        margin-bottom: 0;
        margin-left: 0;
    }
}

.flex {
    display: flex;
}

.flex-col {
    flex-direction: column;
}

.h-screen {
    height: 100vh;
}

.overflow-y-auto {
    overflow-y: auto;
}

.p-4 {
    padding: 1rem;
    position: absolute;
    bottom: 0;
    width: 100%;
}

.items-center {
    align-items: center;
}

.hidden {
    display: block;
}

.border {
    border: 1px solid #ccc;
}

.w-full {
    width: 100%;
}

.ml-5 {
    margin-left: 0.625rem; // 10px / 16px
}

#ask-button {
    color: white;
    border: none;
    border-radius: 4px;
}
</style>
