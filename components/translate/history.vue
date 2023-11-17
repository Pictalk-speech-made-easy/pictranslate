<template>
    <div>
    <div @click="onHistoryClick(value)" class="flex flex-wrap items-center max-h-[50vh] min-h-[120px] overflow-y-auto bg-base-100 mx-4 mt-4 p-2 shadow-xl rounded-xl bg-dotted-light"
    v-for="(value, index) in history.history"
        :key="value.text_input"
    >
    {{ value.text_input  }}
    <div class="flex flex-wrap items-center max-h-[50vh] min-h-[120px] overflow-y-auto bg-base-100 mx-4 mt-4 p-2 shadow-xl rounded-xl bg-dotted-light">
      <div class="items-center w-1/3 sm:w-1/4" tabindex="0" v-for="(pictogramPropositions, index) in value.pictogramsPropositions"
        :key="pictogramPropositions['pictograms'][0].external_alt_image.toString()">
        <div v-for="pictogram in pictogramPropositions['pictograms']" class="p-1 flex flex-col items-center">
          <img crossorigin="anonymous" class="!m-0 aspect-square object-contain rounded-sm zoom-in"
            :src="pictogram.external_alt_image.toString()" :alt="pictogram['keywords'][options.locale][0]['keyword']" />
          <p class="mt-2 font-semibold text-lg">{{ pictogram['keywords'][options.locale][0]['keyword'] }}</p>
        </div>
      </div>
      
    </div>
  </div>
</div>
</template>
<script setup lang="ts">
import { useOptions } from '~/store/option';
import { useHistoryDatabase } from '~/store/history';
import { History } from '~/store/store-types';
const options = useOptions();
const history = useHistoryDatabase();
const main = useMain();

onMounted(() => {
    history.getHistory();
})

const onHistoryClick = function(value: History) {
            main.pictogramsPropositions = value.pictogramsPropositions;
            main.textInput = value.text_input;
}

</script>