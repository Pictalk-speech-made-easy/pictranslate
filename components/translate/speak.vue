<template>
    <button type="button" class="dark:bg-slate-800">
        <svg v-if="props.animated" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="0" class="fill-primary">
                <animate id="svgSpinnersPulse30" fill="freeze" attributeName="r" begin="0;svgSpinnersPulse32.begin+0.4s"
                    calcMode="spline" dur="1.2s" keySplines=".52,.6,.25,.99" values="0;11" />
                <animate fill="freeze" attributeName="opacity" begin="0;svgSpinnersPulse32.begin+0.4s" calcMode="spline"
                    dur="1.2s" keySplines=".52,.6,.25,.99" values="1;0" />
            </circle>
            <circle cx="12" cy="12" r="0" class="fill-primary dark:fill-blue-900">
                <animate id="svgSpinnersPulse31" fill="freeze" attributeName="r" begin="svgSpinnersPulse30.begin+0.4s"
                    calcMode="spline" dur="1.2s" keySplines=".52,.6,.25,.99" values="0;11" />
                <animate fill="freeze" attributeName="opacity" begin="svgSpinnersPulse30.begin+0.4s" calcMode="spline"
                    dur="1.2s" keySplines=".52,.6,.25,.99" values="1;0" />
            </circle>
            <circle cx="12" cy="12" r="0" class="fill-primary dark:fill-blue-900">
                <animate id="svgSpinnersPulse32" fill="freeze" attributeName="r" begin="svgSpinnersPulse30.begin+0.8s"
                    calcMode="spline" dur="1.2s" keySplines=".52,.6,.25,.99" values="0;11" />
                <animate fill="freeze" attributeName="opacity" begin="svgSpinnersPulse30.begin+0.8s" calcMode="spline"
                    dur="1.2s" keySplines=".52,.6,.25,.99" values="1;0" />
            </circle>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24">
            <path class="fill-primary"
                d="M3 9h4l5-5v16l-5-5H3V9zm18 3a9.003 9.003 0 0 1-7 8.777V18.71a7.003 7.003 0 0 0 0-13.42V3.223c4.008.91 7 4.494 7 8.777zm-4 0a5.001 5.001 0 0 1-3 4.584V7.416c1.766.772 3 2.534 3 4.584z" />
        </svg>
    </button>
</template>
<script setup lang="ts">
const props = defineProps<{
    animated: boolean
}>()
</script>