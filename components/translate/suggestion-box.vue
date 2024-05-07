<template>
  <Transition name="fade">
    <div class="flex mx-auto p-1 items-center justify-center max-w-lg h-28 max-h-28"
      v-if="main.suggestedPictograms.length > 0">
      <TransitionGroup name="list">
        <div v-for="(pictogram, index) in main.suggestedPictograms"
          :key="pictogram['pictograms'][pictogram['selected']]['translations'][options.locale][0]['word']">
          <button :id="`suggestion-${index}`" @click="onSuggestionConfirmed(pictogram)"
            class="aspect-square p-1 bg-blue-100 dark:bg-blue-900 rounded-lg mx-1 max-h-24">
            <img height="80px" crossorigin="anonymous" class="w-full rounded-sm zoom-in"
              :src="miniPictohubDatabase.getImage(pictogram['pictograms'][pictogram['selected']].images, 0)"
              :alt="pictogram['pictograms'][pictogram['selected']]['translations'][options.locale][0]['word']" />
            <span class="text-sm tracking-wide font-normal dark:text-gray-200">{{
              pictogram['pictograms'][pictogram['selected']]['translations'][options.locale][0]['word'].toUpperCase()
              }}</span>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Transition>
</template>
<script setup lang="ts">
import { useMain } from '~/store/main';
import { useGramDatabase } from '~/store/gram-db';

import { useOptions } from '~/store/option';
const main = useMain();
const gramdb = useGramDatabase();
const options = useOptions();
const miniPictohubDatabase = useMiniPictohubDatabase();

watch(() => main.pictogramsPropositions, async (value) => {
  console.log("[suggestion-box],", value)
  console.log("[suggestion-box] watch triggered")
  if (value.length == 0) {
    console.log("[suggestion-box] empty pictograms")
    gramdb.suggestions = [];
    main.suggestedPictograms = []
    return;
  }
  const stimulus = value.map((p) => p['pictograms'][p['selected']]['translations']['en'][0]['word'])
  console.debug("[suggestion-box] pictograms", stimulus)
  const response = await gramdb.getGram(stimulus)
  console.debug("[suggestion-box] response", response)
  if (response) {
    gramdb.suggestions = response.map((r: any) => {
      return {
        word: r["word"],
        count: r["count"],
        predictions: [], // Add this line
        gram: r["gram"]
      } as GramResponse;
    })
    console.debug("[suggestion-box] getGramPictograms", value, gramdb.suggestions)
    gramdb.getGramPictograms(options.locale);
  }
}, { deep: true });

function onSuggestionConfirmed(pictogram: any) {
  const newWord = pictogram['pictograms'][0]['translations'][options.locale][0]['word'].replace(' ', '-');
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