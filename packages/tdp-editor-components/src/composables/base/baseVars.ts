import useBaseInject from './baseInject';

export default function useVars() {
    const injects = useBaseInject();
    // 用于express表达式中的变量
    const { pageMethods } = injects;
    const getExpression = (expression: string) => {
        let result: any = undefined;
        try {
            result = eval(expression);
        } catch {
            //console.error(e);
            result = null;
        }
        return result;
    };
    const getFunction = (functionName: string) => {
        const $function = pageMethods[functionName];
        let result: any = new Function();
        if ($function) {
            result = $function();
        }
        return result;
    };

    return {
        getExpression,
        getFunction,
    };
}
