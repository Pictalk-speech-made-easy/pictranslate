<template>
  <div>
    <InputBox @pictohubSearch="translation = $event" />
    <div class="divider"></div>
    <div class="card w-96 bg-base-100 shadow-xl">
      <PictosViewer :pictograms="pictoResponses" />
      <div class="card-body">
        <div class="card-actions justify-end">
          <button class="btn btn-primary" @click="copyPictogramsToClipboard">{{ $t('copyButton') }}</button>
          <button class="btn btn-secondary" @click="speakSentence"> {{ $t('speakButton') }}</button>
        </div>
      </div>
    </div>
    <ClipboardHelper ref="clipboardHelper" :sentence="translation" :pictograms="pictoResponses" />
    <SpeechSynthesis ref="speechSynthesisHelper" :language="localeIso(locale)"/>
  </div>
</template>
<script setup lang="ts">
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

let data: any;

const clipboardHelper = ref<InstanceType<typeof ClipboardHelper> | null>(null)
const speechSynthesisHelper = ref<InstanceType<typeof SpeechSynthesis> | null>(null)
const translation: globalThis.Ref<string> = ref('');
const pictoResponses: globalThis.Ref<Array<any>> = ref([]);

const { suggestion } = storeToRefs(stimulusDatabase)
  
onMounted(async () => {
  const authenticated = await  auth.getAuthenticated();
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
  speechSynthesisHelper.value?.speak(translation.value);
}

watch(suggestion, async (value) => {
  console.log("[main] pictohub value",value)
  if (value == '') {
    return;
  }
  const picto = await getPictoFromPictohub(value);
  if (picto == undefined) {
    return;
  }
  console.log("[main] pictohub",picto)
  // Need to make a popup suggestion while typing...
  //TODO ADRI
});

watch(translation, async (newValue, oldValue) => {
  if (newValue == '') {
    pictoResponses.value = [];
    return;
  }

  const words = removePrepositions(newValue.toLocaleLowerCase(), locale.value);
  let wordsPromise = words.map((word:string) => {
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