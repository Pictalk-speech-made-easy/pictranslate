<template>
    <div class="flex p-4 mx-2 justify-center">
        <input :placeholder="$t('inputPlaceholder')" class="input input-bordered w-full max-w-xs rounded-full" type="text" id="search"
            v-model="textInput" />
        <button class="btn btn-circle btn-error ml-2" @click="textInput = ''"><svg xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg></button>
    </div>
</template>
<script setup lang="ts">
import debounce from 'lodash.debounce';
const emit = defineEmits(['pictohubSearch']);
const textInput = ref('');
watch(textInput, debounce(() => {
        console.debug("[input-box] watcher activated")
        emit('pictohubSearch', textInput.value)
}, 500), { immediate: true })

const injectAdditionnalSearch = (input: string) => {
    input = input.replace(' ', '-');
    textInput.value += ' ' + input;
}
defineExpose({
    injectAdditionnalSearch
  });
</script>
<style scoped>
.loading-input {
    background: url(/square-loading.svg) 7px 7px no-repeat scroll;
    background-position-x: calc(100% - 8px);
}</style>
