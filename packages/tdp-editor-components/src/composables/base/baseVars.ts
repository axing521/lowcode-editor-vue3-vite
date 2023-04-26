import { useVarControler } from 'tdp-editor-common/src/controller';
export default function useVars() {
    const getExpression = (expression: string) => {
        const varController = useVarControler();
        const result = varController.evalVarValue({
            expression: expression,
        });
        if (result.success) {
            return result.value;
        } else {
            return undefined;
        }
    };

    return {
        getExpression,
    };
}
