<template>
  <Transition name="fade">
    <div class="flex mx-auto p-1 items-center justify-center max-w-lg h-28 max-h-28" v-if="main.suggestedPictograms.length > 0">
      <TransitionGroup name="list">
        <div v-for="pictogram in main.suggestedPictograms"
          :key="pictogram['pictograms'][pictogram['selected']]['keywords'][options.locale][0]['keyword']">
          <button @click="onSuggestionConfirmed(pictogram)"
            class="aspect-square p-1 bg-blue-100 dark:bg-blue-900 rounded-lg mx-1 max-h-24">
            <img height="80px" crossorigin="anonymous" class="w-full rounded-sm zoom-in"
              :src="pictogram['pictograms'][pictogram['selected']].external_alt_image.toString()"
              :alt="pictogram['pictograms'][pictogram['selected']]['keywords'][options.locale][0]['keyword']" />
            <span class="text-sm tracking-wide font-normal dark:text-gray-200">{{
              pictogram['pictograms'][pictogram['selected']]['keywords'][options.locale][0]['keyword'].toUpperCase()
            }}</span>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Transition>
</template>
<script setup lang="ts">
import { useMain } from '~/store/main';
import { useStimulusDatabase } from '~/store/stiumulus-db';
import { useOptions } from '~/store/option';
import { getPictoFromPictohub } from '~/utils/pictohub';
const main = useMain();
const stimulusdb = useStimulusDatabase();
const options = useOptions();
const config = useRuntimeConfig()

watch(() => stimulusdb.suggestions, async (value) => {
  console.debug("[main] pictohub value", value)
  if (value.length == 0 || value == undefined) {
    main.suggestedPictograms = []
    return;
  }
  // Only get the first 5 elements
  value = value.slice(0, 5);
  let wordToPictogramPromises = value.map((suggestion: string) => {
    return getPictoFromPictohub(config, suggestion.toLocaleLowerCase(), 'en', [options.locale], 1); // Change the limit to 3 for example to have 3 pictograms per word
  });
  console.debug("[main] pictohub wordsPromise", wordToPictogramPromises)
  let unfilteredPictograms = await Promise.all(wordToPictogramPromises);
  unfilteredPictograms = unfilteredPictograms.map((picto) => { return { 'selected': 0, 'pictograms': picto } })
  // Remove the empty elements and only keep the first 3 elements
  main.suggestedPictograms = unfilteredPictograms.filter((picto: any) => (picto.pictograms != undefined && picto.pictograms[0]?.external_alt_image != undefined)).slice(0, 3); // Change the slice number to 3 for example to have 3 suggestions per word
}, { immediate: true, deep: true });

watch(() => main.pictogramsPropositions, async (value) => {
  console.log("[pictogram-viewer],", value)
  console.log("[pictogram-viewer] watch triggered")
  if (value.length == 0) {
    console.log("[pictogram-viewer] empty pictograms")
    stimulusdb.suggestion = '';
    stimulusdb.suggestions = [];
    return;
  }
  const picto = value[value.length - 1];
  console.debug("[pictogram-viewer] pictogram", picto)
  const stimulus = picto['pictograms'][picto['selected']]['keywords']['en'][0]['keyword']
  const response = await stimulusdb.getStimulus(stimulus)
  console.debug("[pictogram-viewer] response", value)
  if (response) {
    stimulusdb.suggestion = response[0]['word']
    stimulusdb.suggestions = response.map((r: any) => r['word'])
  }
}, { immediate: true, deep: true });

function onSuggestionConfirmed(pictogram: any) {
  const newWord = pictogram['pictograms'][0]['keywords'][options.locale][0]['keyword'].replace(' ', '-');
  main.pictogramsPropositions.push(pictogram);
  main.textInput += ' ' + newWord;
  console.debug("[main] suggestionConfirmed", pictogram);
}

</script>
<style scoped>
.list-enter-active {
  transition: all 0.5s ease-in-out;
  opacity: 1;
}

.list-leave-active {
  display: none;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s linear;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>
