<script lang="ts">
export default defineComponent({
    name: EnumComponentType.chatGPT,
});
</script>
<script setup lang="ts">
import { EnumComponentType, EnumPropsValueType } from 'tdp-editor-types/src/enum/components';
import { ref, defineComponent, computed } from 'vue';
import type { IComponentState } from 'tdp-editor-types/src/interface/app/components';
import type { IChatGPTProps } from './interface';
import { useBaseLifecycle } from '../../composables/base';
import { Configuration, OpenAIApi, type ChatCompletionRequestMessage } from 'openai';
import { $fetch } from 'tdp-editor-common/src/request';
import { setPropValue } from 'tdp-editor-common/src/factory/propsFactory';

// 接收props
const allProps = defineProps<{
    state: IComponentState<IChatGPTProps>;
    parentId: string;
    props: IChatGPTProps;
    css: Record<string, any>;
}>();

// 注册组件统一的生命周期事件（必须）
useBaseLifecycle(allProps);

const questionInput = ref('');
const qaList = ref<string[]>([]);
const myProgress = ref<HTMLElement | null>(null);
const myGPT = ref<HTMLElement | null>(null);
const enableClearColor = ref({ color: '#262626' });
const enableSpin = ref(false);
const isShow = ref(false);

// 配置chat网络请求request
let conservation: ChatCompletionRequestMessage[] = []; // 保存对话上下文

const enableBulbColor = computed({
    get() {
        return allProps.props.theme ? '#ccc' : 'orange';
    },

    set(val) {
        if (val == '#ccc') {
            setPropValue(allProps.state, 'theme', true, EnumPropsValueType.boolean);
        } else {
            setPropValue(allProps.state, 'theme', false, EnumPropsValueType.boolean);
        }
    },
});

const enableCommentColor = computed({
    get() {
        return allProps.props.enableContext ? '#1890ff' : '#ccc';
    },

    set(val) {
        if (val == '#ccc') {
            setPropValue(allProps.state, 'enableContext', false, EnumPropsValueType.boolean);
        } else {
            setPropValue(allProps.state, 'enableContext', true, EnumPropsValueType.boolean);
        }
    },
});

const isDark = computed(() => {
    return allProps.props.theme ? 'dark' : '';
});

const toggleContext = () => {
    enableCommentColor.value = enableCommentColor.value == '#ccc' ? '#1890ff' : '#ccc';
};

const toggleTheme = () => {
    enableBulbColor.value = enableBulbColor.value == '#ccc' ? 'orange' : '#ccc';
};

const clearHTML = () => {
    enableSpin.value = true;
    qaList.value = [];
    conservation = [];
    setTimeout(() => {
        enableSpin.value = false;
        enableClearColor.value.color = '#262626';
    }, 1000);
};

// 设置用户配置（包括APIKey，Proxy，Model），待完成
const setUserConfig = () => {};

async function chat(APIKey: string, userQuery: string, model = 'gpt-3.5-turbo') {
    if (allProps.props.enableContext) {
        conservation.push({ role: 'user', content: userQuery });
    }

    const configuration = new Configuration({
        apiKey: APIKey,
    });

    const openai = new OpenAIApi(configuration);

    const completion = await openai.createChatCompletion(
        {
            model: model,
            messages: allProps.props.enableContext
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
    const res = await $fetch({
        method: 'get',
        url: proxyUrl,
        data,
        baseURL: proxyHost,
        timeout: 60000,
    });

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
        isShow.value = true;

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
        isShow.value = false;
    }
}
</script>

<template>
    <div ref="myGPT" :class="isDark" class="overflow-hidden">
        <div class="app-bar">
            <p>ChatGPT中文版: 交互窗口</p>
            <div class="funcButton">
                <a-button
                    shape="circle"
                    style="margin-right: 4px"
                    :style="{ backgroundColor: enableBulbColor }"
                    @click="toggleTheme"
                >
                    <svg
                        t="1683615499923"
                        class="icon svg-1"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        p-id="124351"
                        width="32"
                        height="32"
                    >
                        <path
                            d="M517.366995 850.079518c-173.220663 0-341.614633-102.281648-500.741146-304.302955L0 524.586452l14.464643-22.713246c2.032563-3.303558 51.395538-80.453467 135.908985-159.260301 50.001045-46.697487 102.153005-84.261307 154.943035-111.796101C372.705126 195.666332 441.225648 177.013065 509.118392 175.109146c178.165709-4.821548 348.077668 104.561206 505.053266 325.107135l14.974071 21.071759-14.08386 21.699538c-1.90392 3.046271-48.601407 74.232281-129.816442 147.579497-47.968482 43.399075-98.350312 78.549548-149.488563 104.561206-65.098613 33.123055-131.849005 51.400683-198.213467 54.441809a356.871719 356.871719 0 0 1-20.176402 0.514573z m-423.339096-329.429548c143.653307 174.491658 291.361447 259.509387 439.702513 252.912563 126.265889-5.588261 232.355377-78.17391 298.977126-138.070191 48.982191-44.032 84.765588-87.940503 103.547497-112.938453-136.54191-183.872322-279.428503-275.116382-424.857085-271.308542-128.164663 3.298412-238.056844 81.091538-307.724865 145.809367-51.904965 48.09198-89.844422 96.441246-109.64004 123.600402z m420.925749 155.452462c-89.587136 0-162.553568-72.966432-162.553568-162.553568 0-89.592281 72.966432-162.558714 162.553568-162.558713s162.553568 72.966432 162.553568 162.553568-72.966432 162.558714-162.553568 162.558713z m0-248.97608c-47.716342 0-86.417367 38.706171-86.417367 86.417367 0 47.716342 38.701025 86.417367 86.417367 86.417366 47.711196 0 86.417367-38.701025 86.417367-86.417366 0-47.711196-38.706171-86.417367-86.417367-86.417367z"
                            p-id="124352"
                        ></path>
                    </svg>
                </a-button>
                <a-button shape="circle" style="margin-right: 4px" @click="clearHTML">
                    <svg
                        t="1683615526200"
                        class="icon svg-1"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        p-id="124547"
                        width="32"
                        height="32"
                    >
                        <path
                            d="M192.86737988 326.4344871a43.1382795 43.1382795 0 0 1 42.6484865 36.18615267l0.56289598 7.01792012v532.63091849a27.8011989 27.8011989 0 0 0 22.15762209 27.15789024l5.57047382 0.56289599h496.76642138a27.65499293 27.65499293 0 0 0 27.17250962-22.12107l0.55558629-5.60702592V370.98366203c0-23.91210211 19.29928158-43.20407279 43.21138249-43.20407279a43.1382795 43.1382795 0 0 1 42.6484877 36.18615144l0.56289477 7.01792135v531.31505754c-0.19006896 59.19908265-45.57993119 108.05404316-103.36811963 113.6025867l-10.96550052 0.5190342H263.79954737c-59.30142803 0-108.09059525-45.30213866-113.62451698-103.16343008l-0.52634389-10.98743201V369.64587079c0-23.91941181 19.29928158-43.21138247 43.21138248-43.21138369z m425.44680383 0.38013793a43.1382795 43.1382795 0 0 1 42.64848771 36.18615267l0.56289599 7.01792012v390.17444391c0 23.94134331-19.32121187 43.40145145-43.2113837 43.40145143a43.1382795 43.1382795 0 0 1-42.64848648-36.18615144l-0.56289599-7.01792135v-390.37182255c0-23.90479121 19.29928158-43.20407279 43.21138247-43.20407279z m-212.81843639 0a43.1382795 43.1382795 0 0 1 42.64848771 36.18615267l0.56289477 7.01792012v390.17444391c0 23.94134331-19.32121187 43.40145145-43.21138248 43.40145143a43.1382795 43.1382795 0 0 1-42.6484877-36.18615144l-0.56289479-7.01792135v-390.37182255c0-23.90479121 19.29928158-43.20407279 43.20407159-43.20407279zM690.20400572 7.58697043c58.9505313 0 107.3741824 45.30213866 112.87155446 103.16343008l0.5117233 10.9874308-0.0584836 63.18321512 169.6728472 0.0146206c19.1311429 0 35.30891203 12.35446443 41.01097245 29.53374864l1.63751526 6.65240401 0.56289478 7.01792014a43.1382795 43.1382795 0 0 1-36.18615145 42.6557974l-7.01792014 0.56289599H50.79104202A43.14559041 43.14559041 0 0 1 7.58697043 228.13973982a43.1382795 43.1382795 0 0 1 36.18615145-42.64848771l7.01792014-0.56289477 169.57781271-0.0146206 0.03655211-63.18321512c0-55.5950881 39.81207749-101.95722544 92.4684112-112.08934832l10.69501888-1.53516988L334.55626892 7.58697043h355.6477368z m0 86.42276496h-355.6477368c-13.28287653 0-24.54810109 9.605779-27.15789023 22.17955359l-0.57020569 5.54854233-0.07310419 63.18321512h410.38751699l0.0292412-63.18321512c0-13.66301324-9.0648133-24.64313556-21.46313952-27.17982053l-5.50468176-0.54827539z"
                            p-id="124548"
                        ></path>
                    </svg>
                </a-button>
                <a-button shape="circle" style="margin-right: 4px" @click="toggleContext">
                    <svg
                        t="1683615861789"
                        :style="{ fill: enableCommentColor }"
                        class="icon svg-1"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        p-id="125277"
                        width="32"
                        height="32"
                    >
                        <path
                            d="M856.505458 0.568889H167.753956C106.714453 0.568889 56.888889 50.139591 56.888889 111.306524v798.082845c0 61.039502 49.698133 110.733084 110.865067 110.733084h688.624071c61.034951 0 110.733084-49.566151 110.733084-110.728533V111.301973C967.111111 50.139591 917.540409 0.568889 856.505458 0.568889z m48.29184 908.693049c0 26.760533-21.786169 48.423822-48.29184 48.423822H167.753956c-26.633102 0-48.296391-21.79072-48.296392-48.423822V111.306524c0-26.633102 21.663289-48.296391 48.296392-48.296391h688.624071c26.628551 0 48.296391 21.79072 48.296391 48.296391v797.955414h0.12288zM259.372373 308.692764a30.182969 30.182969 0 0 1-30.201173-30.201173v-2.038898a30.182969 30.182969 0 0 1 30.201173-30.201173 30.182969 30.182969 0 0 1 30.201174 30.201173v2.038898c0 16.693476-13.635129 30.201173-30.201174 30.201173z m0 170.370845a30.182969 30.182969 0 0 0-30.201173 30.201173v1.911467a30.182969 30.182969 0 0 0 30.201173 30.201173 30.182969 30.182969 0 0 0 30.201174-30.201173v-1.911467c0-16.693476-13.635129-30.201173-30.201174-30.201173z m0 232.93952a30.182969 30.182969 0 0 0-30.201173 30.201173v1.911467a30.182969 30.182969 0 0 0 30.201173 30.201173 30.182969 30.182969 0 0 0 30.201174-30.201173v-1.911467c0-16.693476-13.635129-30.201173-30.201174-30.201173z m505.382685-403.310365H368.448853a30.182969 30.182969 0 0 1-30.201173-30.201173v-2.038898a30.182969 30.182969 0 0 1 30.205724-30.201173h396.301654a30.182969 30.182969 0 0 1 30.201173 30.201173v2.038898c0.12288 16.693476-13.507698 30.201173-30.201173 30.201173z m0 170.370845H368.448853a30.182969 30.182969 0 0 0-30.201173 30.201173v1.911467a30.182969 30.182969 0 0 0 30.205724 30.201173h396.301654a30.182969 30.182969 0 0 0 30.201173-30.201173v-1.911467c0.12288-16.693476-13.507698-30.201173-30.201173-30.201173z m0 232.93952H368.448853a30.182969 30.182969 0 0 0-30.201173 30.201173v1.911467a30.182969 30.182969 0 0 0 30.205724 30.201173h396.301654a30.182969 30.182969 0 0 0 30.201173-30.201173v-1.911467c0.12288-16.693476-13.507698-30.201173-30.201173-30.201173z"
                            p-id="125278"
                        ></path>
                    </svg>
                </a-button>
                <a-button shape="circle" @click="setUserConfig">
                    <svg
                        t="1683615825948"
                        class="icon svg-1"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        p-id="125079"
                        width="32"
                        height="32"
                    >
                        <path
                            d="M519.90528 0C373.87776 0 255.0784 117.26336 255.0784 261.43232l0.43008 15.01696c4.30592 74.7008 40.6528 143.488 101.1712 190.47936l8.43776 6.528-9.92256 3.93728c-170.55232 67.328-280.78592 227.584-280.78592 408.2688v89.17504c0 21.248 17.50528 38.5024 39.0144 38.5024h311.93088l6.4-6.35904v-64.29184l-6.4-6.35904-272.96768-0.03584 0.05632-50.63168c0-167.20896 114.01728-311.30624 278.2208-351.8464l4.85376-6.17472V429.60384l-3.39968-5.61664C370.85696 391.68 333.11232 329.7536 333.11232 261.43232c0-101.6832 83.7888-184.44288 186.79296-184.44288s186.8032 82.75456 186.8032 184.44288c0 61.95712-31.06816 118.96832-83.1488 153.20576l3.5328 11.66336h94.976c42.22464-48.35328 62.66368-105.92256 62.66368-164.864C784.73216 117.26336 665.92768 0 519.90528 0z"
                            p-id="125080"
                        ></path>
                        <path
                            d="M768 508.82048a46.42304 46.42304 0 0 1 42.49088 27.55072l2.2528 6.2976 1.20832 5.8368 54.04672 0.06656c7.38304 0 14.58688 1.74592 21.0432 5.0176l6.1952 3.7632 5.57056 4.72576a46.01344 46.01344 0 0 1 13.01504 25.344l0.57856 7.26016v357.76512c0 12.22656-4.8896 23.9616-13.5936 32.60416a46.50496 46.50496 0 0 1-25.50784 12.93312l-7.30112 0.57344H508.0064c-23.49056 0-42.9056-17.34656-45.9776-39.85408l-0.42496-6.25664v-357.76512c0-12.23168 4.8896-23.9616 13.5936-32.60416a46.50496 46.50496 0 0 1 25.50784-12.93312l7.30112-0.57344 53.98528-0.06656 1.26976-5.8368a46.34624 46.34624 0 0 1 31.67232-31.99488l6.77376-1.4336 6.2976-0.41984H768z m-206.01344 92.22144h-47.616v345.04704h347.19744V601.0368h-47.616l-1.20832 5.89824a46.35648 46.35648 0 0 1-38.4512 33.4336l-6.29248 0.41984h-160c-21.3504 0-39.34208-14.336-44.74368-33.85344l-1.26976-5.89824z m199.552-39.81312h-147.2v27.09504h147.2v-27.09504z"
                            p-id="125081"
                        ></path>
                        <path
                            d="M750.33088 685.5936c35.96288 35.7376 35.96288 92.02176 0 127.75936-11.4688 11.39712-24.02816 18.80064-39.23456 23.20384l-4.34688 0.96256v23.46496l19.93216 0.0512 6.4 6.35904v33.25952l-6.4 6.35904-19.93216-0.04096 0.04096 19.54304-6.4 6.36416h-33.46432l-6.4-6.36416-0.04608-89.1904-4.4544-1.31072a83.88608 83.88608 0 0 1-17.74592-9.03168l-8.38656-6.24128-8.12544-7.38816c-35.96288-35.7376-35.96288-92.02176 0-127.75936s92.60032-35.7376 128.5632 0z m-95.61088 32.74752c-17.8176 17.70496-17.8176 44.55936 0 62.26432 17.8176 17.71008 44.84096 17.71008 62.65856 0 17.8176-17.70496 17.8176-44.55936 0-62.26432-17.38752-17.28-45.5936-16.95744-62.65856 0z"
                            p-id="125082"
                        ></path>
                    </svg>
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

        <div ref="myProgress" id="in-progress" class="progress" v-show="isShow">
            <p class="align-1">
                ChatGPT正在处理你的请求 ❤️
                <br />
                <br />
                <svg
                    t="1683626800025"
                    style="width: 20px; height: 20px"
                    class="load"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="126809"
                    width="32"
                    height="32"
                >
                    <path
                        d="M876.864 782.592c3.264 0 6.272-3.2 6.272-6.656 0-3.456-3.008-6.592-6.272-6.592-3.264 0-6.272 3.2-6.272 6.592 0 3.456 3.008 6.656 6.272 6.656z m-140.544 153.344c2.304 2.432 5.568 3.84 8.768 3.84a12.16 12.16 0 0 0 8.832-3.84 13.76 13.76 0 0 0 0-18.56 12.224 12.224 0 0 0-8.832-3.84 12.16 12.16 0 0 0-8.768 3.84 13.696 13.696 0 0 0 0 18.56zM552.32 1018.24c3.456 3.648 8.32 5.76 13.184 5.76a18.368 18.368 0 0 0 13.184-5.76 20.608 20.608 0 0 0 0-27.968 18.368 18.368 0 0 0-13.184-5.824 18.368 18.368 0 0 0-13.184 5.76 20.608 20.608 0 0 0 0 28.032z m-198.336-5.76c4.608 4.8 11.072 7.68 17.6 7.68a24.448 24.448 0 0 0 17.536-7.68 27.456 27.456 0 0 0 0-37.248 24.448 24.448 0 0 0-17.536-7.68 24.448 24.448 0 0 0-17.6 7.68 27.52 27.52 0 0 0 0 37.184z m-175.68-91.84c5.76 6.08 13.824 9.6 21.952 9.6a30.592 30.592 0 0 0 22.016-9.6 34.368 34.368 0 0 0 0-46.592 30.592 30.592 0 0 0-22.016-9.6 30.592 30.592 0 0 0-21.952 9.6 34.368 34.368 0 0 0 0 46.592z m-121.152-159.36c6.912 7.36 16.64 11.648 26.368 11.648a36.736 36.736 0 0 0 26.432-11.584 41.28 41.28 0 0 0 0-55.936 36.736 36.736 0 0 0-26.432-11.584 36.8 36.8 0 0 0-26.368 11.52 41.28 41.28 0 0 0 0 56zM12.736 564.672a42.88 42.88 0 0 0 30.784 13.44 42.88 42.88 0 0 0 30.784-13.44 48.128 48.128 0 0 0 0-65.216 42.88 42.88 0 0 0-30.72-13.44 42.88 42.88 0 0 0-30.848 13.44 48.128 48.128 0 0 0 0 65.216z m39.808-195.392a48.96 48.96 0 0 0 35.2 15.36 48.96 48.96 0 0 0 35.2-15.36 54.976 54.976 0 0 0 0-74.56 48.96 48.96 0 0 0-35.2-15.424 48.96 48.96 0 0 0-35.2 15.424 54.976 54.976 0 0 0 0 74.56zM168.32 212.48c10.368 11.008 24.96 17.408 39.68 17.408 14.592 0 29.184-6.4 39.552-17.408a61.888 61.888 0 0 0 0-83.84 55.104 55.104 0 0 0-39.616-17.408c-14.656 0-29.248 6.4-39.616 17.408a61.888 61.888 0 0 0 0 83.84zM337.344 124.8c11.52 12.16 27.712 19.264 43.968 19.264 16.256 0 32.448-7.04 43.968-19.264a68.672 68.672 0 0 0 0-93.184 61.248 61.248 0 0 0-43.968-19.264 61.248 61.248 0 0 0-43.968 19.264 68.736 68.736 0 0 0 0 93.184z m189.632-1.088c12.672 13.44 30.528 21.248 48.448 21.248s35.712-7.808 48.384-21.248a75.584 75.584 0 0 0 0-102.464A67.392 67.392 0 0 0 575.36 0c-17.92 0-35.776 7.808-48.448 21.248a75.584 75.584 0 0 0 0 102.464z m173.824 86.592c13.824 14.592 33.28 23.104 52.736 23.104 19.584 0 39.04-8.512 52.8-23.104a82.432 82.432 0 0 0 0-111.744 73.472 73.472 0 0 0-52.8-23.168c-19.52 0-38.912 8.512-52.736 23.168a82.432 82.432 0 0 0 0 111.744z m124.032 158.528c14.976 15.872 36.032 25.088 57.216 25.088 21.12 0 42.24-9.216 57.152-25.088a89.344 89.344 0 0 0 0-121.088 79.616 79.616 0 0 0-57.152-25.088c-21.184 0-42.24 9.216-57.216 25.088a89.344 89.344 0 0 0 0 121.088z m50.432 204.032c16.128 17.088 38.784 27.008 61.632 27.008 22.784 0 45.44-9.92 61.568-27.008a96.256 96.256 0 0 0 0-130.432 85.76 85.76 0 0 0-61.568-27.072c-22.848 0-45.44 9.984-61.632 27.072a96.192 96.192 0 0 0 0 130.432z"
                        fill="#262626"
                        p-id="126810"
                    ></path>
                </svg>
            </p>
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
                <svg
                    t="1683613930320"
                    :style="{ width: '30px', height: '30px' }"
                    class="icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="40703"
                    width="32"
                    height="32"
                >
                    <path
                        d="M991.936 90.368a34.496 34.496 0 0 0-46.08-15.424L47.808 520.96a34.496 34.496 0 0 0 5.12 63.808l302.08 94.976 46.464-57.6-246.592-77.44L831.36 208.512l-361.856 438.016a25.28 25.28 0 0 0-2.24 3.136l-41.856 51.968v215.68c0 19.008 15.36 34.304 34.368 34.304 19.072 0 34.368-15.36 34.368-34.368v-194.176l328.64 103.104c3.84 1.152 7.68 1.728 11.52 1.6a34.56 34.56 0 0 0 34.816-28.16l125.888-687.488a34.368 34.368 0 0 0-3.008-21.76zM808.32 749.76L542.464 666.24l361.408-437.568-95.488 521.088z"
                        fill="#ffffff"
                        p-id="40704"
                    ></path>
                </svg>
            </a-button>
        </div>
    </div>
</template>

<style lang="less" scoped>
@keyframes loading {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
.load {
    animation: loading 1s linear infinite;
}

.align-1 {
    // 内部元素纵向排列，并且水平居中，并且上下间隔为 1rem
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 1rem;
}

.svg-1 {
    vertical-align: middle;
    width: 15px;
    height: 15px;
}

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

.overflow-y-auto {
    overflow-y: auto;
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
</style>
