<template>
  <div class="mt-12" v-if="historyDatabase.history.length > 0">
    <p class="ml-4 mb-2 text-2xl font-serif">{{ $t('main.history') }}</p>
    <button @click="onHistoryClick(historyItem)"
      class="btn w-full h-auto mx-4 my-2 px-2 py-1 block rounded-lg shadow-md bg-blue-100 dark:bg-blue-900"
      v-for="(historyItem, index) in historyDatabase.history">
      <div class="flex justify-center p-1 pb-0 overflow-x-auto">
        <button class="max-w-[15%]" tabindex="0"
          v-for="(pictogramPropositions, index) in historyItem.pictogramsPropositions">
          <img crossorigin="anonymous" class="!m-0 aspect-square object-contain rounded-sm zoom-in min-w-16"
            :src="getPictogram(pictogramPropositions)" :alt="getAlt(pictogramPropositions)" />
        </button>
      </div>
      <p class="lowercase font-normal text-base text-center dark:text-gray-300">{{ historyItem.text_input }}</p>
    </button>
  </div>
</template>
<script setup lang="ts">
import { useOptions } from '~/store/option';
import { useHistoryDatabase } from '~/store/history';
import type { HistoryItem } from '~/store/store-types';
const options = useOptions();
const historyDatabase = useHistoryDatabase();
const main = useMain();
const miniPictohubDatabase = useMiniPictohubDatabase();
onMounted(async () => {
  await historyDatabase.getHistory();
  console.debug("[history]", historyDatabase.history)
})

const getPictogram = function (pictogramPropositions: PictogramPropositions) {
  return miniPictohubDatabase.getImage(pictogramPropositions['pictograms'][pictogramPropositions.selected].images);
}

const getAlt = function (pictogramPropositions: PictogramPropositions) {
  if (pictogramPropositions['pictograms'][pictogramPropositions.selected]['translations'][options.locale]?.length > 0) {
    return pictogramPropositions['pictograms'][pictogramPropositions.selected]['translations'][options.locale][0]['word'];
  }
  return pictogramPropositions['pictograms'][pictogramPropositions.selected]['translations']["en"][0]['word'];
}

const onHistoryClick = function (record: HistoryItem) {
  main.pictogramsPropositions = record.pictogramsPropositions;
  main.textInput = record.text_input;
}

</script>