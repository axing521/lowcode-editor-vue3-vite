import type { ISetupBaseProps } from 'tdp-editor-types/src/interface/app/components';

import { $log } from 'tdp-editor-common/src/utils';

export default function useBaseWatch(props: ISetupBaseProps) {
    $log('useBaseWatch >>>>>>>>>>>>', props);
}
