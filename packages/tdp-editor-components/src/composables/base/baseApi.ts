// import type { ISetupBaseProps } from 'tdp-editor-types/src/interface/app/components';
import { useDatasourceControler } from 'tdp-editor-common/src/controller';

export default function useBaseApi() {
    // 触发指定的api
    async function triggerApi(params: { datasourceKey: string }) {
        const dsController = useDatasourceControler();
        return await dsController.triggerDatasourceByKey(params.datasourceKey);
    }

    return {
        triggerApi,
    };
}
