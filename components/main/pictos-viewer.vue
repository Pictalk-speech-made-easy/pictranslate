<template>
    <div class="flex items-center min-h-[20vh] bg-base-100 mx-4 mt-2 shadow-xl rounded-xl bg-dotted-light">
                <div class="flex flex-wrap mx-1 p-1 items-center">
                  <div class="items-center" tabindex="0" v-for="(picto, index) in pictograms" crossorigin="anonymous" :key="picto['pictograms'][0].external_alt_image.toString()">
                    <div v-for="pictogram in picto['pictograms']">
                    <img 
                        class="!m-0 aspect-square object-contain h-12 rounded-sm zoom-in" :src="pictogram.external_alt_image.toString()"
                        :alt="pictogram['keywords'][locale][0]['keyword']"/>
                        <div class="mx-4 mt-2 shadow-xl rounded-xl">{{ pictogram['keywords'][locale][0]['keyword'] }}</div>
                      </div>
                    </div>
                </div>
                
            </div>
</template>
<script setup lang="ts">
const stimulusDatabase = useStimulusDatabase();
const { suggestion, suggestions } = storeToRefs(stimulusDatabase)
const { locale } = useI18n()
const props = defineProps({
  pictograms: {
    type: Array<any>,
    required: true,
  },
});

const { pictograms } = toRefs(props);

watch(pictograms, async (value) => {
  console.log("[pictogram-viewer],", value)
  console.log("[pictogram-viewer] watch triggered")
  if (value.length == 0) {
    console.log("[pictogram-viewer] empty pictograms")
    suggestion.value = '';
    suggestions.value = [];
    return;
  }
  const picto = value[value.length - 1];
  console.debug("[pictogram-viewer] pictogram",picto)
  const stimulus = picto['pictograms'][picto['selected']]['keywords']['en'][0]['keyword']
  const response = await stimulusDatabase.getStimulus(stimulus)
  console.debug("[pictogram-viewer] response",value)
  if (response) {
    suggestion.value = response[0]['word']
    suggestions.value = response.map((r: any) => r['word'])
  }
}, { immediate: true, deep: true });

</script>
<style scoped>
.bg-dotted-light{
  background-image: radial-gradient(#00000020 1px, transparent 0);
  background-size: 16px 16px;
}
@keyframes zoom-in {
  0% {
    transform: scale(0.5);
  }
  100% {
    transform: scale(1);
  }
}
.zoom-in{
  animation: zoom-in 0.1s ease-in-out;
}
</style>