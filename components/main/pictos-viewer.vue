<template>
    <div class="flex items-center min-h-[80px] bg-base-100 mx-4 mt-2 shadow-xl rounded-xl bg-dotted-light dark:bg-dotted-dark">
                <div class="flex flex-wrap mx-1 p-1 items-center">
                    <img tabindex="0" v-for="(picto, index) in pictograms" :key="picto.external_alt_image.toString()"
                        class="!m-0 aspect-square object-contain h-12 rounded-sm" :src="picto.external_alt_image.toString()"
                        :alt="picto.keywords[locale]">
                </div>
                
            </div>
</template>
<script setup lang="ts">
const stimulusDatabase = useStimulusDatabase();
const { locale } = useI18n()
const props = defineProps({
  pictograms: {
    type: Object,
    required: true,
  },
});

const { pictograms } = toRefs(props);

watch(pictograms, async (value) => {
  if (value.length == 0) {
    return;
  }
  const picto = value[value.length - 1];
  console.log("[pictogram-viewer] pictogram",picto)
  const stimulus = picto['keywords']['en'][0]['keyword']
  const response = await stimulusDatabase.getStimulus(stimulus)
  console.log("[pictogram-viewer] response",value)
  if (response) {
    stimulusDatabase.suggestion = response[0]['word']
  }
});

</script>
<style scoped>
.bg-dotted-light{
  background-image: radial-gradient(#00000020 1px, transparent 0);
  background-size: 16px 16px;
}
.bg-dotted-dark{
  background-image: radial-gradient(#ffffff80 1px, transparent 0);
  background-size: 16px 16px;
}
</style>