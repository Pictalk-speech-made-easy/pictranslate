<template>
  <div class="mt-12" v-if="history.length > 0">
    <p class="ml-4 mb-2 text-2xl font-serif">{{ $t('main.history') }}</p>
    <btn @click="onHistoryClick(historyItem)"
      class="btn h-auto mx-4 my-2 px-2 py-1 justify-start rounded-lg shadow-md bg-blue-100 dark:bg-blue-900"
      v-for="(historyItem, index) in history">
      <div class="flex justify-start p-1 pb-0 overflow-x-auto">
        <btn class="max-w-[15%]" tabindex="0" v-for="(pictogramPropositions, index) in historyItem.pictogramsPropositions">
          <img crossorigin="anonymous" class="!m-0 aspect-square object-contain rounded-sm zoom-in"
            :src="pictogramPropositions['pictograms'][pictogramPropositions.selected].external_alt_image.toString()"
            :alt="pictogramPropositions['pictograms'][pictogramPropositions.selected]['keywords'][options.locale][0]['keyword']" />
        </btn>
      </div>
      <p class="lowercase font-normal text-base ml-4 text-left dark:text-gray-300">{{ historyItem.text_input }}</p>
    </btn>
  </div>
</template>
<script setup lang="ts">
import { useOptions } from '~/store/option';
import { useHistoryDatabase } from '~/store/history';
import { HistoryItem } from '~/store/store-types';
const options = useOptions();
const historyDatabase = useHistoryDatabase();
const { history } = historyDatabase;
const main = useMain();

onMounted(() => {
  historyDatabase.getHistory();
})

const onHistoryClick = function (record: HistoryItem) {
  main.pictogramsPropositions = record.pictogramsPropositions;
  main.textInput = record.text_input;
}

</script>