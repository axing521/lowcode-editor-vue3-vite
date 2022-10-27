import type { App } from 'vue';
import DirectiveDrag from './drag';
export default function registerDirectives(app: App) {
    DirectiveDrag(app);
}
