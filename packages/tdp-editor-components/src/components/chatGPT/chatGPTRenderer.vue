<script setup lang="ts">
import { EnumComponentType } from 'tdp-editor-types/src/enum/components';
import {
    ClearOutlined,
    UserOutlined,
    CommentOutlined,
    SendOutlined,
    LoadingOutlined,
    BulbOutlined,
} from '@ant-design/icons-vue';
import { ref, defineComponent, watch } from 'vue';
import type { IComponentState } from 'tdp-editor-types/src/interface/app/components';
import type { IChatGPTProps } from './interface';
import { useBaseInject, useBaseLifecycle } from '../../composables/base';
import { $log } from 'tdp-editor-common/src/utils';
import { Configuration, OpenAIApi, type ChatCompletionRequestMessage } from 'openai';
import * as axios from 'axios';

const questionInput = ref('');
const qaList = ref<string[]>([]);
const fakeEnableContext = ref(false);
const fakeTheme = ref(false);
const myProgress = ref<HTMLElement | null>(null);
const myGPT = ref<HTMLElement | null>(null);
const enableCommentColor = ref({ color: '#ccc' });
const enableBulbColor = ref({ backgroundColor: 'orange' });
const enableClearColor = ref({ color: '#262626' });
const enableSpin = ref(false);

// 接收props
const allProps = defineProps<{
    state: IComponentState<IChatGPTProps>;
    parentId: string;
    props: IChatGPTProps;
    css: Record<string, any>;
}>();
watch(allProps, async (newVal, oldVal) => {
    if (newVal.props.theme) {
        myGPT.value?.classList.add('dark');
    } else {
        myGPT.value?.classList.remove('dark');
    }

    enableCommentColor.value.color = newVal.props.enableContext ? '#1890ff' : '#ccc';
    enableBulbColor.value.backgroundColor = allProps.props.theme ? '#ccc' : 'orange';

    fakeEnableContext.value = newVal.props.enableContext ? true : false;
    fakeTheme.value = newVal.props.theme ? true : false;

    // console.log("new: ", newVal.props.enableContext);
    // console.log("old: ", oldVal.props.enableContext);
});

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

// 配置chat网络请求request
let conservation: ChatCompletionRequestMessage[] = []; // 保存对话上下文

async function chat(APIKey: string, userQuery: string, model = 'gpt-3.5-turbo') {
    if (fakeEnableContext.value) {
        conservation.push({ role: 'user', content: userQuery });
    }

    const configuration = new Configuration({
        apiKey: APIKey,
    });

    const openai = new OpenAIApi(configuration);

    const completion = await openai.createChatCompletion(
        {
            model: model,
            messages: fakeEnableContext.value
                ? conservation
                : [{ role: 'user', content: userQuery }],
        },
        {
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
            },
            data: JSON.stringify({
                reset: false,
            }),
        }
    );
    // console.log(completion.data.choices);

    return {
        message: completion.data.choices[0].message,
    };
}
async function chatProxy(
    data: { content: string },
    proxyHost: string,
    proxyUrl: string,
    model = 'gpt-3.5-turbo'
) {
    const host = proxyHost;
    const service = axios.default.create({
        baseURL: host,
        timeout: 60000,
    });

    const request = (options: axios.AxiosRequestConfig<any>) => {
        //以post方式发起get请求
        if (options.method == 'get') {
            options.params = options.data;
        }
        return service(options);
    };

    const res = await request({
        method: 'get',
        url: proxyUrl,
        data,
    });
    /* console.log(res); */
    return res;
}

// 在交互窗口add Question方法
const addQuestion = (question: string) => {
    qaList.value.push(`${question}`);
    myGPT.value?.scrollTo(0, myGPT.value.scrollHeight);
};
// 在交互窗口add Answer方法
const addAnswer = (answer: any) => {
    qaList.value.push(`${answer}`);
    myGPT.value?.scrollTo(0, myGPT.value.scrollHeight);
};

// 用户点击发送按钮 或 按下回车键 的回调函数
async function onQuery() {
    // 用户输入不为空则发起网络请求
    if (questionInput.value?.trim() != '') {
        // 获取用户输入并清空输入框
        const query = questionInput.value;
        questionInput.value = '';

        // 交互窗口add Question
        addQuestion(query);

        // 显示加载动画
        myProgress.value?.classList.remove('hidden');

        // ensure apiKey
        if (allProps.props.apiKey) {
            //有APIKey
            // ensure GPTModel
            const model = allProps.props.gptModel == '' ? 'gpt-3.5-turbo' : allProps.props.gptModel;
            const answer = await chat(allProps.props.apiKey, query, model);
            /* if(answer.message == 'APIKey Error'){
                //提示APIKey错误
                console.log('APIKey Error')
            } */
            // console.log(answer);
            addAnswer(answer.message?.content);
        } else {
            // 提示APIKey为空
            // console.log('APIKey is empty')
            // 使用chatGPT代理
            if (allProps.props.proxy) {
                const proxyHost = 'https://' + allProps.props.proxy.split('/')[2];
                const proxyUrlIndex = allProps.props.proxy.indexOf(proxyHost);
                const proxyUrl = allProps.props.proxy.slice(proxyUrlIndex + proxyHost.length);
                const answer = await chatProxy({ content: query }, proxyHost, proxyUrl);
                addAnswer(answer.data.message.content);
            } else {
                // 提示chatGPT代理为空
                // console.log('chatGPT proxy is empty')
            }
        }

        // 隐藏加载动画
        myProgress.value?.classList.add('hidden');
    }
}

const clearHTML = () => {
    enableSpin.value = true;
    qaList.value = [];
    conservation = [];
    setTimeout(() => {
        enableSpin.value = false;
        enableClearColor.value.color = '#262626';
    }, 1000);
};

const toggleContext = () => {
    fakeEnableContext.value = !fakeEnableContext.value;
    // console.log(fakeEnableContext.value);
    enableCommentColor.value.color = fakeEnableContext.value ? '#1890ff' : '#ccc';
};

const toggleTheme = () => {
    fakeTheme.value = !fakeTheme.value;
    // console.log(fakeTheme.value, "theme")
    enableBulbColor.value.backgroundColor = fakeTheme.value ? '#ccc' : 'orange';
    fakeTheme.value ? myGPT.value?.classList.add('dark') : myGPT.value?.classList.remove('dark');
};

const setUserConfig = () => {};
</script>

<script lang="ts">
export default defineComponent({
    name: EnumComponentType.chatGPT,
});
</script>

<template>
    <div ref="myGPT" class="overflow-hidden">
        <div class="app-bar">
            <p>ChatGPT中文版: 交互窗口</p>
            <div class="funcButton">
                <a-button
                    shape="circle"
                    style="margin-right: 4px"
                    :style="enableBulbColor"
                    @click="toggleTheme"
                >
                    <template #icon><bulb-outlined /></template>
                </a-button>
                <a-button shape="circle" style="margin-right: 4px" @click="clearHTML">
                    <template #icon
                        ><clear-outlined :spin="enableSpin" :style="enableClearColor"
                    /></template>
                </a-button>
                <a-button shape="circle" style="margin-right: 4px" @click="toggleContext">
                    <template #icon><comment-outlined :style="enableCommentColor" /></template>
                </a-button>
                <a-button shape="circle" @click="setUserConfig">
                    <template #icon><user-outlined /></template>
                </a-button>
            </div>
        </div>

        <ul class="flex-1 overflow-y-auto" id="qa-list">
            <li v-for="(item, index) in qaList" :key="index">
                <div class="QA">
                    <p v-if="index % 2 == 0" id="QA">
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
                    <p v-else id="QA">
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
                    <div>{{ item }}</div>
                </div>
            </li>
        </ul>

        <div ref="myProgress" id="in-progress" class="progress hidden">
            <p>ChatGPT正在处理你的请求 ❤️</p>
            <loading-outlined :style="{ fontSize: '25px' }" />
        </div>

        <div id="myInput">
            <div class="flex-1">
                <textarea
                    type="text"
                    rows="2"
                    class="border p-2 w-full"
                    id="question-input"
                    placeholder="请输入问题..."
                    @keyup.enter="onQuery"
                    v-model="questionInput"
                ></textarea>
            </div>
            <a-button
                type="primary"
                size="large"
                id="ask-button"
                class="p-2 ml-5"
                @click="onQuery"
                @keydown.enter="onQuery"
            >
                <template #icon><send-outlined /></template>
            </a-button>
        </div>
    </div>
</template>

<style lang="less" scoped>
ul {
    list-style-type: none;
    margin-left: -20px;
}

#myInput {
    padding: 1rem;
    position: sticky;
    top: 72vh;
    width: 400px;
    display: flex;
    align-items: center;
    z-index: 10;
}
#QA {
    display: flex;
}

.overflow-hidden {
    overflow-y: scroll;
    overflow-x: hidden;
    height: 80vh;
    width: 420px;
    position: relative;
    border: 3px solid red;
}

.dark {
    background: #1e1e1e;
    color: white;
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
    height: 20%;
    align-items: center;
    z-index: 1000;
    // 内部元素水平居中
    display: flex;
    justify-content: center;
    flex-direction: column;
    text-align: center;

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
    display: none;
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
