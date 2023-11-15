<template>
  <div class="flex flex-wrap items-center max-h-[50vh] min-h-[120px] overflow-y-auto bg-base-100 mx-4 mt-4 p-2 shadow-xl rounded-xl bg-dotted-light">
      <div class="items-center w-1/3 sm:w-1/4" tabindex="0" v-for="(pictogramPropositions, index) in main.pictogramsPropositions"
        :key="pictogramPropositions['pictograms'][0].external_alt_image.toString()">
        <div v-for="pictogram in pictogramPropositions['pictograms']" class="p-1 flex flex-col items-center">
          <img crossorigin="anonymous" class="!m-0 aspect-square object-contain rounded-sm zoom-in"
            :src="pictogram.external_alt_image.toString()" :alt="pictogram['keywords'][options.locale][0]['keyword']" />
          <p class="mt-2 font-semibold text-lg">{{ pictogram['keywords'][options.locale][0]['keyword'] }}</p>
        </div>
      </div>
   

  </div>
</template>
<script setup lang="ts">
import { useOptions } from '~/store/option';
import { useMain } from '~/store/main';
const main = useMain();
const options = useOptions();
</script>
<style scoped>
.bg-dotted-light {
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

.zoom-in {
  animation: zoom-in 0.1s ease-in-out;
}
</style>