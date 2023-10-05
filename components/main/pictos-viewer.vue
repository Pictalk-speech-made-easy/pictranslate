<template>
    <div v-if="pictograms.length" class="flex items-center">
                <div class="flex flex-wrap mx-1 p-1 items-center">
                    <img tabindex="0" v-for="(picto, index) in pictograms" :key="picto.external_alt_image.toString()"
                        class="!m-0 aspect-square object-contain h-12 rounded-sm" :src="picto.external_alt_image.toString()"
                        :alt="picto.keywords[locale]">
                </div>
                
            </div>
</template>
<script setup lang="ts">
const { locale } = useI18n()
const props = defineProps({
  pictograms: {
    type: Object,
    required: true,
  },
});
</script>