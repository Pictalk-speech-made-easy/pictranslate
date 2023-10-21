<template>
    <div class="flex items-center min-h-[20vh] bg-base-100 mx-4 mt-2 shadow-xl rounded-xl bg-dotted-light">
                <div class="flex flex-wrap mx-1 p-1 items-center">
                  <div class="items-center" tabindex="0" v-for="(pictogramPropositions, index) in pictogramsPropositions" crossorigin="anonymous" :key="pictogramPropositions['pictograms'][0].external_alt_image.toString()">
                    <div v-for="pictogram in pictogramPropositions['pictograms']">
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
const { locale } = useI18n()
const props = defineProps({
  pictogramsPropositions: {
    type: Array<any>,
    required: true,
  },
});

const { pictogramsPropositions } = toRefs(props);

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