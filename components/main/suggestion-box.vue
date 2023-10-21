<template>
    <div class="flex flex-wrap mx-1 p-1 items-center">
        <div v-for="pictogram in pictograms" class="!m-0 object-contain h-12">
            <button @click="emit('suggestion', pictogram)" class="btn btn-primary">
              <span>{{ pictogram['pictograms'][pictogram['selected']]['keywords'][locale][0]['keyword'] }}</span>
              <img class="!m-0 aspect-square object-contain h-8 rounded-sm zoom-in" :src="pictogram['pictograms'][pictogram['selected']].external_alt_image.toString()"
                        :alt="pictogram['pictograms'][pictogram['selected']]['keywords'][locale][0]['keyword']"/>
            </button>
        </div>
    </div>
</template>
<script setup lang="ts">
const { locale } = useI18n()
const emit = defineEmits(['suggestion']);
import { getPictoFromPictohub } from '~/utils/pictohub';
const props = defineProps({
  pictograms: {
    type: Array<any>,
    required: true,
  },
});
const { pictograms } = toRefs(props);
const main = useMain();
const { textInput, pictogramsPropositions, suggestedPictograms } = storeToRefs(main);
const stimulusDatabase = useStimulusDatabase();
const { suggestions, suggestion } = storeToRefs(stimulusDatabase);
const config = useRuntimeConfig()

watch(suggestions, async (value) => {
  console.debug("[main] pictohub value", value)
  if (value.length == 0 || value == undefined) {
    suggestedPictograms.value = []
    return;
  }
  // Only get the first 5 elements
  value = value.slice(0, 5);
  let wordToPictogramPromises = value.map((suggestion: string) => {
    return getPictoFromPictohub(config, suggestion.toLocaleLowerCase(), 'en', [locale.value], 3);
  });
  console.debug("[main] pictohub wordsPromise", wordToPictogramPromises)
  let unfilteredPictograms = await Promise.all(wordToPictogramPromises);
  unfilteredPictograms = unfilteredPictograms.map((picto) => { return {'selected': 0, 'pictograms': picto}})
  // Remove the empty elements and only keep the first 3 elements
  suggestedPictograms.value = unfilteredPictograms.filter((picto: any) => (picto.pictograms != undefined && picto.pictograms[0]?.external_alt_image != undefined)).slice(0, 3);;
}, { immediate: true, deep: true });

watch(pictogramsPropositions, async (value) => {
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
