import type { App } from 'vue';
import type { IDesignerComponent } from 'tdp-editor-types/interface/designer';
import { EnumComponentType } from 'tdp-editor-types/enum/components';
// 遍历所有组件信息 , '!../components/page/**'
const components = import.meta.glob(['../components/*/index.(ts|tsx)'], {
    eager: true,
});
/**
 * 自动注册组件
 * @returns 返回组件列表
 */
const register = (app: App): IDesignerComponent[] => {
    const componentList: IDesignerComponent[] = [];
    Object.keys(components).map(module => {
        const componentFile = components[module] as unknown as any;
        const register = componentFile.register;
        if (register) {
            const $register = register();
            const isMultiple = $register instanceof Array;
            let registers = [];
            if (isMultiple) {
                registers = $register;
            } else {
                registers = [$register];
            }
            registers.forEach((c: any) => {
                // page不注册全局组件
                if (c.type !== EnumComponentType.page) {
                    app.component(
                        c.type,
                        isMultiple ? componentFile[c.type] : componentFile.default
                    );
                }
                componentList.push(c);
            });
        }
    });
    const result = componentList.sort((a, b) => (a.order || 0) - (b.order || 0));
    return result;
};

export default register;
