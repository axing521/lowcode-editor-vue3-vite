/**
 * Created by liuyc14 on 2017/10/16.
 */
import { EnumAppEnv } from 'tdp-editor-types/src/enum';

const __domain: Record<EnumAppEnv, any> = {
    [EnumAppEnv.local]: '',
    [EnumAppEnv.dev]: 'https://xxx.com',
    [EnumAppEnv.tst]: 'https://xxx.com',
    [EnumAppEnv.production]: 'https://xxx.com',
    [EnumAppEnv.uat]: 'https://xxx.com',
};

// 读取环境变量 VUE_APP_ENV
const getEnv = (): EnumAppEnv => {
    let env = EnumAppEnv.local;
    // @ts-ignore
    const runtimeEnv = import.meta.env.VITE_APP_ENV;
    if (runtimeEnv === EnumAppEnv.production) {
        env = EnumAppEnv.production;
    } else if (runtimeEnv === EnumAppEnv.dev) {
        env = EnumAppEnv.dev;
    } else if (runtimeEnv === EnumAppEnv.tst) {
        env = EnumAppEnv.tst;
    }
    return env;
};

const env = getEnv();

const API_Domain = {
    env: env,
    domain: __domain[env],
    getEnv: getEnv,
    apiRepService: __domain[env] + '/api-repo',
    uiDesigner: __domain[env] + '/uidesigner',
    formService: __domain[env] + '/form',
};

export default API_Domain;
