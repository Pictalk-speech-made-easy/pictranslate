<template>
    <div class="flex p-4 mx-2 mb-2 justify-center items-center">
        <div class="form-control w-full">
            <label class="label p-0 h-0">
                <span class="label-text"></span>
                <span class="label-text-alt relative top-6 mr-3"><button
                        class="btn btn-sm min-h-0 h-6 w-6 btn-circle bg-red-400 ml-2" @click="main.textInput = ''"><svg
                            xmlns="http://www.w3.org/2000/svg" class="mx-auto h-4 w-4" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path class=" stroke-white" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg></button></span>
            </label>
            <input :placeholder="$t('main.input')" class="input input-bordered w-full rounded-full pr-10" type="text"
                id="search" v-model="main.textInput" />
        </div>
        <Speak :animated="speaking!" class="btn rounded-full h-16 w-16 ml-4 p-4 bg-blue-100 dark:bg-grey-base-50"
            @click="readSentence"> {{ $t('main.speak') }}></Speak>
    </div>
</template>
<script setup lang="ts">
import debounce from 'lodash.debounce';
import { useMain } from '#imports';
import { useSpeech } from '~/composables/speech';
import { useHistoryDatabase } from '~/store/history';
import { useGramDatabase } from '~/store/gram-db';

import Speak from '~/components/translate/speak.vue';
const main = useMain();
const options = useOptions();
const { speak, speaking } = useSpeech();
const { addHistory, getHistory, searchHistory } = useHistoryDatabase();
const GramDatabase = useGramDatabase();
watch(() => main.textInput, debounce(async (newText: string) => {
    if (newText == '') {
        console.debug("[main] textInput empty")
        main.pictogramsPropositions = [];
        getHistory();
        return;
    }
    searchHistory(newText);
    newText = newText.toLocaleLowerCase();
    console.log("[main] textInput", newText, "locale", options.locale)
    if (options.locale == "fr") {
        console.debug("[main] textInput", newText)
        newText = removePrepositionsManually(newText);
        console.debug("[main] textInput after removePrepositionsManually", newText)
    }
    console.log("[main] textInput", newText)
    if (options.simplifyTranslation) {
        console.debug("[main] textInput before removePrepositions", newText)
        newText = removePrepositions(newText, options.locale).join(' ');
        console.debug("[main] textInput after removePrepositions", newText)
    }
    main.traduction(newText);

}, 500));

function readSentence() {
    if (main.textInput == '') return;
    speak(main.textInput);
    addHistory(main.textInput, toRaw(main.pictogramsPropositions));
}
</script>
