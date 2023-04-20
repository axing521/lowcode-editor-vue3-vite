import type { IFetchAsyncResult } from 'tdp-editor-types/src/interface/request';
import type { EnumApiType } from 'tdp-editor-types/src/enum/components';
import { apiFactory, request } from 'tdp-editor-common/src';
import { apiDomain } from 'tdp-editor-common/src/service';
import type { ISetupBaseProps } from 'tdp-editor-types/src/interface/app/components';

export default function useBaseApi(props: ISetupBaseProps) {
    // 触发指定的api
    async function triggerApi(params: {
        name?: string;
        apiType?: EnumApiType;
    }): Promise<IFetchAsyncResult<any> | null> {
        let res: IFetchAsyncResult<any> | null = null;
        if (params.name) {
            const api = apiFactory.getApiValueByName(props.state, params.name);
            if (api) {
                res = await request.$fetch({
                    url: `${apiDomain.domain}${api.path}`,
                    method: api.method,
                });
            }
        } else if (params.apiType) {
            const apiArray = apiFactory.getApiValueByType(props.state, params.apiType);
            if (apiArray.length) {
                const api = apiArray[0];
                res = await request.$fetch({
                    url: `${apiDomain.domain}${api.path}`,
                    method: api.method,
                });
            }
        }
        return res;
    }

    return {
        triggerApi,
    };
}
