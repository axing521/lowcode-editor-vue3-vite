/**
 * 演示如何使用tdp-editor-runtime
 */
import { createRuntime } from './runtime';

const testData = {
    appStore: {
        mode: 'runtime',
        pages: [
            {
                key: 'PageRenderer_xvzKR7HSp115BZkY',
                code: '',
                label: '表单1',
                icons: 'flex',
                type: 'PageRenderer',
                group: '-1',
                list: [
                    {
                        key: 'FdForm_adNCEwuCQvmeXGHa',
                        code: '',
                        label: '表单',
                        icons: 'form',
                        group: '0',
                        type: 'FdForm',
                        isForm: true,
                        order: 200,
                        list: [
                            {
                                key: 'FdButton_lRfLNBMBn8hdRCDV',
                                code: '',
                                label: '按钮',
                                icons: 'button',
                                group: '2',
                                type: 'FdButton',
                                isForm: true,
                                order: 302,
                                name: 'FdButton_lRfLNBMBn8hdRCDV',
                                list: [],
                                formInfo: { formFieldName: 'FdButton_lRfLNBMBn8hdRCDV', rules: [] },
                                props: {
                                    text: { type: 'string', value: '按钮' },
                                    htmlType: { type: 'string', value: 'button' },
                                },
                            },
                        ],
                        name: 'FdForm_adNCEwuCQvmeXGHa',
                    },
                    {
                        key: 'FdForm_IFXxkcFsksfVO8Y5',
                        code: '',
                        label: '表单',
                        icons: 'form',
                        group: '0',
                        type: 'FdForm',
                        isForm: true,
                        order: 200,
                        list: [
                            {
                                key: 'FdRate_YfXzVxXrmAwnBY4Y',
                                code: '',
                                label: '评分',
                                icons: 'Ratings',
                                group: '2',
                                type: 'FdRate',
                                isForm: true,
                                listGroup: 'business',
                                order: 307,
                                name: 'FdRate_YfXzVxXrmAwnBY4Y',
                                list: [],
                                formInfo: { formFieldName: 'FdRate_YfXzVxXrmAwnBY4Y', rules: [] },
                                props: {
                                    label: { type: 'string', value: '' },
                                    defaultValue: { type: 'number', value: 3 },
                                },
                            },
                        ],
                        name: 'FdForm_IFXxkcFsksfVO8Y5',
                    },
                ],
            },
        ],
        pageForms: {},
        activePage: {
            key: 'PageRenderer_xvzKR7HSp115BZkY',
            code: '',
            label: '表单1',
            icons: 'flex',
            type: 'PageRenderer',
            group: '-1',
            list: [
                {
                    key: 'FdForm_adNCEwuCQvmeXGHa',
                    code: '',
                    label: '表单',
                    icons: 'form',
                    group: '0',
                    type: 'FdForm',
                    isForm: true,
                    order: 200,
                    list: [
                        {
                            key: 'FdButton_lRfLNBMBn8hdRCDV',
                            code: '',
                            label: '按钮',
                            icons: 'button',
                            group: '2',
                            type: 'FdButton',
                            isForm: true,
                            order: 302,
                            name: 'FdButton_lRfLNBMBn8hdRCDV',
                            list: [],
                            formInfo: { formFieldName: 'FdButton_lRfLNBMBn8hdRCDV', rules: [] },
                            props: {
                                text: { type: 'string', value: '按钮' },
                                htmlType: { type: 'string', value: 'button' },
                            },
                        },
                    ],
                    name: 'FdForm_adNCEwuCQvmeXGHa',
                },
                {
                    key: 'FdForm_IFXxkcFsksfVO8Y5',
                    code: '',
                    label: '表单',
                    icons: 'form',
                    group: '0',
                    type: 'FdForm',
                    isForm: true,
                    order: 200,
                    list: [
                        {
                            key: 'FdRate_YfXzVxXrmAwnBY4Y',
                            code: '',
                            label: '评分',
                            icons: 'Ratings',
                            group: '2',
                            type: 'FdRate',
                            isForm: true,
                            listGroup: 'business',
                            order: 307,
                            name: 'FdRate_YfXzVxXrmAwnBY4Y',
                            list: [],
                            formInfo: { formFieldName: 'FdRate_YfXzVxXrmAwnBY4Y', rules: [] },
                            props: {
                                label: { type: 'string', value: '' },
                                defaultValue: { type: 'number', value: 3 },
                            },
                        },
                    ],
                    name: 'FdForm_IFXxkcFsksfVO8Y5',
                },
            ],
        },
    },
};

const tdpRuntime = createRuntime({
    container: '#app',
});

setTimeout(() => {
    tdpRuntime.setRuntimeJson(testData.appStore as any);
}, 5000);
