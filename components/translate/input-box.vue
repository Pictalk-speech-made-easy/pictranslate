<template>
    <div class="flex p-4 mx-2 mb-2 justify-center items-center">
        <div class="form-control w-full">
            <label class="label p-0 h-0">
                <span class="label-text"></span>
                <span class="label-text-alt relative top-6 mr-3"><button class="btn btn-sm min-h-0 h-6 w-6 btn-circle bg-red-400 ml-2"
                        @click="main.textInput = ''"><svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-4 w-4" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg></button></span>
            </label>
            <input :placeholder="$t('main.input')" class="input input-bordered w-full rounded-full" type="text" id="search"
                v-model="main.textInput" />

        </div>
        <Speak :animated="speaking!" class="btn rounded-full h-16 w-16 ml-4 p-4 bg-blue-100 dark:bg-grey-base-50"
            @click="readSentence"> {{ $t('main.speak') }}></Speak>
    </div>
</template>
<script setup lang="ts">
import debounce from 'lodash.debounce';
import { useMain } from '#imports';
import { useSpeech } from '~/composables/speech';
import Speak from '~/components/translate/speak.vue';
const main = useMain();
const options = useOptions();
const config = useRuntimeConfig();
const { speak, speaking } = useSpeech();

watch(() => main.textInput, debounce(async (newText: string) => {
    if (newText == '') {
        console.debug("[main] textInput empty")
        main.pictogramsPropositions = [];
        return;
    }
    const wordsArray = removePrepositions(newText.toLocaleLowerCase(), options.locale);
    // Condition is useful to avoid triggering the watcher when a suggestion is selected
    if (wordsArray.length != main.pictogramsPropositions.length) {
        const wordToPictogramPromises = wordsArray.map((word: string) => {
            return getPictoFromPictohub(config, word, options.locale, [options.locale, 'en'], 1); // Change the limit to 3 for example to have 3 pictograms per word
        });
        let unfilteredPictograms = await Promise.all(wordToPictogramPromises);
        unfilteredPictograms = unfilteredPictograms.map((picto) => { return { 'selected': 0, 'pictograms': picto } })
        console.log("[main] unfilteredPictograms", unfilteredPictograms)
        unfilteredPictograms = unfilteredPictograms.filter((picto: any) => (picto.pictograms != undefined && picto.pictograms[0]?.external_alt_image != undefined))
        console.log("[main] unfilteredPictograms", unfilteredPictograms)
        main.pictogramsPropositions = unfilteredPictograms
    }
}, 500));

function readSentence() {
    if (main.textInput == '') return;
    speak(main.textInput);
}
</script>
