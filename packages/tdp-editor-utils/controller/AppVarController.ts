import type { App } from 'vue';

export default class AppVarController {
    private readonly $app: App;
    constructor(app: App) {
        this.$app = app;
    }
}
