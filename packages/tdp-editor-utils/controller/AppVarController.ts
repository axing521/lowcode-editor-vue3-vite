import type { App } from 'vue';
import type { Pinia } from 'pinia';
export default class AppVarController {
    private readonly $app: App;
    private readonly $pinia: Pinia;
    constructor(app: App, pinia: Pinia) {
        this.$app = app;
        this.$pinia = pinia;
    }
}
