<template>
    <div class="flex flex-wrap mx-1 p-1 items-center">
        <div v-for="pictogram in pictograms" class="!m-0 object-contain h-12">
            <button @click="emit('suggestion', pictogram)" class="btn btn-primary">{{ pictogram['keywords'][locale][0]['keyword'] }}</button>
        </div>
    </div>
</template>
<script setup lang="ts">
const { locale } = useI18n()
const emit = defineEmits(['suggestion']);
const props = defineProps({
  pictograms: {
    type: Object,
    required: true,
  },
});
const { pictograms } = toRefs(props);

</script>
