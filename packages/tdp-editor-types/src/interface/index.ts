import type { IDesignerComponent } from './designer';

export interface IPageModuleState extends IDesignerComponent {
    apiDatas?: any[];
    eventsDatas?: any[];
    nodes?: any[];
}
