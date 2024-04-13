<template>
  <p class="text-center mt-6 text-sm">{{ $t('main.tap_picto') }}</p>
  <div id="picto-viewer"
    class="flex flex-wrap overflow-y-auto items-start min-h-[120px] max-h-[720px] bg-base-100 mx-2 p-2 shadow-xl dark:shadow-none dark:border dark:border-gray-600 rounded-xl bg-dotted-light">
    <div class="indicator w-1/3" v-for="(pictogramPropositions, index) in main.pictogramsPropositions">
      <span v-if="pictogramPropositions.pictograms.length > 1"
        class="z-0 indicator-item indicator-top indicator-start badge badge-sm bg-slate-500 text-white px-1 top-1 left-2">+{{
          pictogramPropositions.pictograms.length - 1 }}</span>
      <button tabindex="0" @click="openModal(index)" @keyup.enter="openModal(index)">
        <img crossorigin="anonymous" class="!m-0 aspect-square object-contain rounded-sm zoom-in"
          :src="miniPictohubDatabase.getImage(pictogramPropositions['pictograms'][pictogramPropositions.selected].images)"
          :alt="pictogramPropositions['pictograms'][pictogramPropositions.selected]['translations'][options.locale][0]['word']" />
        <p class="mt-1 font-semibold text-lg text-center">{{
          pictogramPropositions['pictograms'][pictogramPropositions.selected]['translations'][options.locale][0]['word']
          }}
        </p>
      </button>
    </div>

    <dialog id="picto_selector" class="modal">
      <div class="modal-box bg-gray-200 dark:bg-slate-800 flex flex-wrap">
        <button class="w-1/3 p-1" tabindex="0"
          v-for="(pictogram, index) in main.pictogramsPropositions[modalIndex]?.['pictograms']"
          @click="selectedPictogram(index)">
          <div v-for="image in pictogram.images" :key="image">
            <img crossorigin="anonymous" class="!m-0 aspect-square object-contain rounded-sm zoom-in" :src="image.url"
              :alt="pictogram['translations'][options.locale][0]['word']" />
          </div>
          <img crossorigin="anonymous" class="!m-0 aspect-square object-contain rounded-sm zoom-in"
            :src="miniPictohubDatabase.getImage(pictogram.images)"
            :alt="pictogram['translations'][options.locale][0]['word']" />
          <p class="mt-1 font-semibold text-lg text-center">{{
            pictogram['translations'][options.locale][0]['word']
            }}</p>
        </button>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  </div>
</template>
<script setup lang="ts">
import { useOptions } from '~/store/option';
import { useMain } from '~/store/main';
const main = useMain();
const options = useOptions();
const modalIndex = ref(0);
const miniPictohubDatabase = useMiniPictohubDatabase();

watch(() => main.pictogramsPropositions, (newValue, oldValue) => {
  if (newValue.length <= oldValue.length) return;
  const viewer = document.getElementById('picto-viewer');
  if (viewer === null) return;
  setTimeout(() => {
    viewer.scrollTo({
      left: viewer.scrollWidth,
      behavior: 'smooth'
    });
  }, 1000);
})
function openModal(index: number) {
  modalIndex.value = index;
  document.getElementById('picto_selector')?.setAttribute('open', '');
}
function selectedPictogram(index: number) {
  main.pictogramsPropositions[modalIndex.value].selected = index;
  document.getElementById('picto_selector')?.removeAttribute('open');
}
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