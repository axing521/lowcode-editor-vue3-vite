import API_Domain from '../apiDomain';
import { $fetch } from '../../request';
import type {
    IFormDetail,
    IFormAdd,
    IFormUpdate,
} from 'tdp-editor-types/src/interface/service/form';

type addFormResult = {
    formId: string;
};

const service = {
    getFormDetail: async (formId: string) => {
        const res = await $fetch<IFormDetail>({
            method: 'GET',
            url: `${API_Domain.formService}/api/v1.0/forms/${formId}`,
        });
        // 做一些错误处理
        if (res.success) {
            res.data = {} as IFormDetail;
        }
        return res;
    },
    addForm: async (form: IFormAdd) => {
        const res = await $fetch<addFormResult>({
            method: 'POST',
            url: `${API_Domain.formService}/api/v1.0/form`,
            data: form,
        });
        return res;
    },
    updateForm: async (form: IFormUpdate) => {
        const res = await $fetch<addFormResult>({
            method: 'PUT',
            url: `${API_Domain.formService}/api/v1.0/form`,
            data: form,
        });
        return res;
    },
    async addOrUpdateForm(form: IFormUpdate) {
        if (form.id) {
            return this.updateForm(form);
        } else {
            // @ts-ignore
            delete form.id;
            return this.addForm(form);
        }
    },
};

export default service;
