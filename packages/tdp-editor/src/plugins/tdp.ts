import { ref, reactive, computed, watch, watchEffect } from 'vue';
export default function useTDP() {
    window.$tdp = {
        App: {},
        Utils: {},
        vue: {
            ref,
            reactive,
            computed,
            watch,
            watchEffect,
        },
    };
}
