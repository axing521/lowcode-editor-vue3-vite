<template>
    <div class="css-box-selector">
        <div class="outer">
            <span>Margin</span>
            <div>
                <div v-for="(margin, index) in marginValue" :key="index">
                    <div class="slot-area" :class="'slot-' + index">
                        <input
                            class="margin-padding-input"
                            :value="getValue(margin)"
                            @change="setValue(margin, $event)"
                        />
                    </div>
                </div>
            </div>
            <div class="inner">
                <span>Padding</span>
                <div>
                    <div v-for="(padding, index) in paddingValue" :key="index">
                        <div class="slot-area" :class="'slot-' + index">
                            <input
                                class="margin-padding-input"
                                :value="getValue(padding)"
                                @change="setValue(padding, $event)"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import type { IDesignerComponent } from 'tdp-editor-types/src/interface/designer';
import type { TCssStyleName } from 'tdp-editor-types/src/interface/app/components';
import { getCss, setCss } from 'tdp-editor-common/src/factory/cssFactory';

export default defineComponent({
    name: 'css-box-selector',
    props: {
        state: {
            type: Object as PropType<IDesignerComponent>,
            required: false,
        },
    },
    data() {
        return {
            marginValue: [
                'marginTop',
                'marginRight',
                'marginBottom',
                'marginLeft',
            ] as TCssStyleName[],
            paddingValue: [
                'paddingTop',
                'paddingRight',
                'paddingBottom',
                'paddingLeft',
            ] as TCssStyleName[],
        };
    },
    methods: {
        getValue(key: TCssStyleName) {
            let value = getCss(this.state!, key) || '';
            value = (value as string).replace('px', '');
            return value || 'auto';
        },
        setValue(key: TCssStyleName, $event: Event) {
            // @ts-ignore
            const value = $event.target?.value;
            const _value = isNaN(Number(value)) ? value : value + 'px';
            setCss(this.state!, key, _value);
        },
    },
});
</script>

<style lang="less" scoped>
.css-box-selector {
    width: 252px;
    color: #7a94b5;
    font-size: 10px;
    .outer {
        height: 153px;
        border: 1px solid #aebdd0;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        background: url('../../assets/image_magin.svg');
        background-size: 100% 100%;
        background-repeat: no-repeat;
        span {
            position: absolute;
            top: 0;
            left: 2px;
            font-size: 8px;
        }
        .slot-area {
            position: absolute;
            display: flex;
            .margin-padding-input {
                border: 0px solid #dce2e9;
                border-radius: 2px;
                background-color: #fafafa;
                outline: none;
                width: 40px;
                height: 20px;
                text-align: center;
            }
            .margin-padding-input:focus,
            .margin-padding-input:hover {
                border-width: 1px;
                background-color: #fff;
                border: 1px solid #7a94b5;
            }
        }
        .slot-0 {
            top: 4px;
            left: 50%;
            transform: translateX(-50%);
        }
        .slot-1 {
            right: 3px;
            top: 50%;
            transform: translateY(-50%);
        }
        .slot-2 {
            bottom: 4px;
            left: 50%;
            transform: translateX(-50%);
        }
        .slot-3 {
            left: 4px;
            top: 50%;
            transform: translateY(-50%);
        }
        .inner {
            width: 59%;
            height: 54%;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            background-image: url('../../assets/image_padding.svg');
            background-size: 100% 100%;
            background-repeat: no-repeat;
        }
    }
}
</style>
