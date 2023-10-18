<template>
  <div class="mt-20 h-[calc(100vh - 64px)] max-w-lg mx-auto">
    <InputBox @pictohubSearch="translation = $event" ref="inputBox" />
    <SuggestionBox @suggestion="suggestionConfirmed($event)" :pictograms="pictogramsSuggestions"/>
    <PictosViewer :pictograms="pictoResponses" />

    <div class="flex justify-end items-center mt-8 mx-4">
      <button class="btn btn-primary rounded-2xl" @click="copyPictogramsToClipboard">{{ $t('copyButton') }}
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
          <path class="fill-gray-100"
            d="M9 18q-.825 0-1.413-.588T7 16V4q0-.825.588-1.413T9 2h9q.825 0 1.413.588T20 4v12q0 .825-.588 1.413T18 18H9Zm-4 4q-.825 0-1.413-.588T3 20V6h2v14h11v2H5Z" />
        </svg>
      </button>
      <Speak :animated="speechSynthesisHelper?.speaking!" class="btn rounded-full h-14 w-14 mx-2 p-4 bg-indigo-100 dark:bg-grey-base-50"
        @click="speakSentence"> {{ $t('speakButton') }}></Speak>
    </div>
    <ClipboardHelper ref="clipboardHelper" :sentence="translation" :pictograms="pictoResponses" />
    <SpeechSynthesis ref="speechSynthesisHelper" :language="localeIso(locale)" />
  </div>
</template>
<script setup lang="ts">
import Speak from '~/components/webSpeechApi/speak.vue';
import InputBox from './input-box.vue';
import SuggestionBox from './suggestion-box.vue';
import PictosViewer from './pictos-viewer.vue';
import ClipboardHelper from '~/components/clipboard/clipboard.vue';
import SpeechSynthesis from '../webSpeechApi/speechSynthesis.vue';
import { localeIso } from '~/utils/i18n';
import { removePrepositions } from '~/utils/language';
const stimulusDatabase = useStimulusDatabase();
const auth = useAuth();
const { locale } = useI18n()
const config = useRuntimeConfig()
let data: any;

const clipboardHelper = ref<InstanceType<typeof ClipboardHelper> | null>(null)
const speechSynthesisHelper = ref<InstanceType<typeof SpeechSynthesis> | null>(null)
const inputBox = ref<InstanceType<typeof InputBox> | null>(null)
const translation: globalThis.Ref<string> = ref('');
const pictoResponses: globalThis.Ref<Array<any>> = ref([]);
const pictogramsSuggestions: globalThis.Ref<Array<any>> = ref([]);
const { suggestions } = storeToRefs(stimulusDatabase)


onMounted(async () => {
  const authenticated = await auth.getAuthenticated();
  if (authenticated) {
    stimulusDatabase.startWorker();
  }
})

const suggestionConfirmed = (event:any) => {
  pictoResponses.value.push(event);
  inputBox.value?.injectAdditionnalSearch(event['keywords'][locale.value][0]['keyword'])
}

const copyPictogramsToClipboard = () => {
  if (clipboardHelper.value == null) {
    return;
  }
  clipboardHelper.value?.copyPictosToClipboard();
}

const speakSentence = () => {
  if (translation.value == '') return;
  if (speechSynthesisHelper.value && typeof speechSynthesisHelper.value.speak === 'function') {
    speechSynthesisHelper.value.speak(translation.value);
  }
}

watch(suggestions, async (value) => {
  console.log("[main] pictohub value", value)
  if (value.length == 0 || value == undefined) {
    return;
  }
  // Only get the first 5 elements
  value = value.slice(0, 5);
  let wordsPromise = value.map((suggestion: string) => {
    return getPictoFromPictohub(suggestion.toLocaleLowerCase(), 'en', [locale.value]);
  });
  console.log("[main] pictohub wordsPromise", wordsPromise)
  wordsPromise = await Promise.all(wordsPromise);
  // Remove the empty elements and only keep the first 3 elements
  wordsPromise = wordsPromise.filter((picto: any) => (picto != undefined && picto.external_alt_image != undefined)).slice(0, 3);
  pictogramsSuggestions.value = wordsPromise;
});

watch(translation, async (newValue, oldValue) => {
  if (newValue == '') {
    pictoResponses.value = [];
    return;
  }

  const words = removePrepositions(newValue.toLocaleLowerCase(), locale.value);
  let wordsPromise = words.map((word: string) => {
    return getPictoFromPictohub(word, locale.value);
  });

  let pictos = await Promise.all(wordsPromise);
  pictos = pictos.filter((picto: any) => (picto != undefined && picto.external_alt_image != undefined))
  pictoResponses.value = pictos
});

const getPictoFromPictohub = async (search: string, searchLocale: string, additionnalLocales: string[] = []) => {
  // Query parameters: search, path, index

  let queryParams = [
    `term=${search}`,
    `path[]=keywords.${searchLocale}.keyword`,
    `index=keyword`,
    `path[]=keywords.${searchLocale}.synonymes`,
    `path[]=keywords.${searchLocale}.lexical_siblings`,
    `path[]=keywords.${searchLocale}.conjugates.verbe_m`,
    `path[]=keywords.${searchLocale}.conjugates.verbe_f`,
    `path[]=keywords.${searchLocale}.plural`,
    `lang[]=${searchLocale}`,
    `completeIfEmpty=true`
  ].join('&');

  if (additionnalLocales.length > 0) {
    additionnalLocales.forEach((additionnalLocale) => {
      queryParams += `&lang[]=${additionnalLocale}`
    })
  }

  data = await $fetch(`${config.public.pictohub.PICTOHUB_API_URL}?${queryParams}`, {
    method: 'GET',
    headers: {
      'x-api-key': config.public.pictohub.PICTOHUB_API_KEY
    }
  });
  return data[0];
}


</script>