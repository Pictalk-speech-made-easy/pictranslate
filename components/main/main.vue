<template>
  <div class="mt-20 h-[calc(100vh - 64px)] max-w-lg mx-auto">
    <InputBox @pictohubSearch="translation = $event" />
    <PictosViewer :pictograms="pictoResponses" />

    <div class="flex justify-end items-center mt-8 mx-4">
      <button class="btn btn-primary rounded-2xl" @click="copyPictogramsToClipboard">{{ $t('copyButton') }}
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
          <path class="fill-gray-100"
            d="M9 18q-.825 0-1.413-.588T7 16V4q0-.825.588-1.413T9 2h9q.825 0 1.413.588T20 4v12q0 .825-.588 1.413T18 18H9Zm-4 4q-.825 0-1.413-.588T3 20V6h2v14h11v2H5Z" />
        </svg>
      </button>
      <Speak :animated="speaking" class="btn rounded-full h-14 w-14 mx-2 p-4 bg-indigo-100 dark:bg-grey-base-50"
        @click="speakSentence"> {{ $t('speakButton') }}></Speak>
    </div>
    <ClipboardHelper ref="clipboardHelper" :sentence="translation" :pictograms="pictoResponses" />
    <SpeechSynthesis ref="speechSynthesisHelper" :language="localeIso(locale)" />
  </div>
</template>
<script setup lang="ts">
import Speak from '~/components/webSpeechApi/speak.vue';
import InputBox from './input-box.vue';
import PictosViewer from './pictos-viewer.vue';
import ClipboardHelper from '~/components/clipboard/clipboard.vue';
import SpeechSynthesis from '../webSpeechApi/speechSynthesis.vue';
import { localeIso } from '~/utils/i18n';
import { removePrepositions } from '~/utils/language';
const stimulusDatabase = useStimulusDatabase();
const auth = useAuth();
const { locale } = useI18n()
const config = useRuntimeConfig()
const speaking = ref(false);
let data: any;

const clipboardHelper = ref<InstanceType<typeof ClipboardHelper> | null>(null)
const speechSynthesisHelper = ref<InstanceType<typeof SpeechSynthesis> | null>(null)
const translation: globalThis.Ref<string> = ref('');
const pictoResponses: globalThis.Ref<Array<any>> = ref([]);

const { suggestion } = storeToRefs(stimulusDatabase)

onMounted(async () => {
  const authenticated = await auth.getAuthenticated();
  if (authenticated) {
    stimulusDatabase.startWorker();
  }
})

const copyPictogramsToClipboard = () => {
  if (clipboardHelper.value == null) {
    return;
  }
  clipboardHelper.value?.copyPictosToClipboard();
}

const speakSentence = () => {
  if (speaking.value) return;
  if (translation.value == '') return;
  speaking.value = true;

  if (speechSynthesisHelper.value &&
    typeof speechSynthesisHelper.value.speak === 'function') {
    speechSynthesisHelper.value.speak(translation.value);

    // Check if 'onend' event property is available to assign a handler
    if ('onend' in speechSynthesisHelper.value) {
      speechSynthesisHelper.value.onend = () => {
        speaking.value = false;
      }
    }
  }
}


watch(suggestion, async (value) => {
  console.log("[main] pictohub value", value)
  if (value == '') {
    return;
  }
  const picto = await getPictoFromPictohub(value);
  if (picto == undefined) {
    return;
  }
  console.log("[main] pictohub", picto)
  // Need to make a popup suggestion while typing...
  //TODO ADRI
});

watch(translation, async (newValue, oldValue) => {
  if (newValue == '') {
    pictoResponses.value = [];
    return;
  }

  const words = removePrepositions(newValue.toLocaleLowerCase(), locale.value);
  let wordsPromise = words.map((word: string) => {
    return getPictoFromPictohub(word);
  });

  let pictos = await Promise.all(wordsPromise);
  pictos = pictos.filter((picto: any) => (picto != undefined && picto.external_alt_image != undefined))
  pictoResponses.value = pictos
});

const getPictoFromPictohub = async (search: string) => {
  // Query parameters: search, path, index

  let queryParams = [
    `term=${search}`,
    `path[]=keywords.${locale.value}.keyword`,
    `index=keyword`,
    `path[]=keywords.${locale.value}.synonymes`,
    `path[]=keywords.${locale.value}.lexical_siblings`,
    `path[]=keywords.${locale.value}.conjugates.verbe_m`,
    `path[]=keywords.${locale.value}.conjugates.verbe_f`,
    `path[]=keywords.${locale.value}.plural`
  ].join('&');

  data = await $fetch(`${config.public.pictohub.PICTOHUB_API_URL}?${queryParams}`, {
    method: 'GET',
    headers: {
      'x-api-key': config.public.pictohub.PICTOHUB_API_KEY
    }
  });
  return data[0];
}


</script>