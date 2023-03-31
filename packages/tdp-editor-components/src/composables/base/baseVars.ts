export default function useVars() {
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

    return {
        getExpression,
    };
}
