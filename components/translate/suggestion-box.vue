
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
// import { useStimulusDatabase } from '~/store/stiumulus-db';
import { useGramDatabase } from '~/store/gram-db';

import { useOptions } from '~/store/option';
const main = useMain();
// const stimulusdb = useStimulusDatabase();
const gramdb = useGramDatabase();
const options = useOptions();

watch(() => main.pictogramsPropositions, async (value) => {
  console.log("[suggestion-box],", value)
  console.log("[suggestion-box] watch triggered")
  if (value.length == 0) {
    console.log("[suggestion-box] empty pictograms")
    // stimulusdb.suggestions = [];
    gramdb.suggestions = [];
    main.suggestedPictograms = []
    return;
  }
  const picto = value[value.length - 1];
  console.debug("[suggestion-box] pictogram", picto['pictograms'])
  // const stimulus = picto['pictograms'][picto['selected']]['keywords']['en'][0]['keyword']
  const gram = main.textInput;
  console.debug("[suggestion-box] AAAAAAAAA", gram)
  // const response = await stimulusdb.getStimulus(stimulus)
  const response = await gramdb.getGram(gram)
  console.debug("[suggestion-box] response", response)
  if (response) {
    gramdb.suggestions = response.map((r: any) => {
      return {
        gram: r["gram"],
        count: r["count"],
        predictions: [] // Add this line
        // Add more properties as needed
    } as GramResponse;
    })
    console.debug("[suggestion-box] getGramPictograms", value, gramdb.suggestions)
    gramdb.getGramPictograms();
  

    // stimulusdb.suggestions = response.map((r: any) => {
    //   return {
    //     stimulus: r["word"],
    //     probability: r["n"],
    //     responses: []
    //     // Add more properties as needed
    // } as StimulusResponse;
    // })
    // console.debug("[suggestion-box] getStimulusPictograms", value, stimulusdb.suggestions)
    // stimulusdb.getStimulusPictograms();
    }
}, {  deep: true });

function onSuggestionConfirmed(pictogram: any) {
  const newWord = pictogram['pictograms'][0]['keywords'][options.locale][0]['keyword'].replace(' ', '-');
  main.pictogramsPropositions.push(pictogram);
  main.textInput += ' ' + newWord;
  console.debug("[suggestion-box] suggestionConfirmed", pictogram);
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