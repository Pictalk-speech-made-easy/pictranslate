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
const props = defineProps({
  pictograms: {
    type: Array<any>,
    required: true,
  },
});
const { pictograms } = toRefs(props);

</script>
