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
    <SpeechSynthesis ref="speechSynthesisHelper" :language="locale"/>
  </div>
</template>
<script setup lang="ts">
import InputBox from './input-box.vue';
import PictosViewer from './pictos-viewer.vue';
import ClipboardHelper from '~/components/clipboard/clipboard.vue';
import SpeechSynthesis from '../webSpeechApi/speechSynthesis.vue';
import { removePrepositions } from '~/utils/language';
const { locale } = useI18n()
const config = useRuntimeConfig()

let data: any;

const clipboardHelper = ref<InstanceType<typeof ClipboardHelper> | null>(null)
const speechSynthesisHelper = ref<InstanceType<typeof SpeechSynthesis> | null>(null)
  const translation: globalThis.Ref<string> = ref('');
const pictoResponses: globalThis.Ref<Array<any>> = ref([]);

const copyPictogramsToClipboard = () => {
  if (clipboardHelper.value == null) {
    return;
  }
  clipboardHelper.value?.copyPictosToClipboard();
}

const speakSentence = () => {
  speechSynthesisHelper.value?.speak(translation.value);
}

watch(translation, async (newValue, oldValue) => {
  if (newValue == '') {
    pictoResponses.value = [];
    return;
  }

  const words = removePrepositions(newValue, 'en');
  let wordsPromise = words.map((word:string) => {
    word = word.toLocaleLowerCase();
    return getPictoFromPictohub(word);
  });

  let pictos = await Promise.all(wordsPromise);
  pictos = pictos.filter((picto: any) => (picto != undefined && picto.external_alt_image != undefined))
    pictoResponses.value = pictos
});

const getPictoFromPictohub = async (search: string) => {
  // Query parameters: search, path, index
  data = await $fetch(config.public.pictohub.PICTOHUB_API_URL, {
    method: 'GET',
    query: {
      term: search,
      path: `keywords.${locale.value}.keyword`,
      index: 'default'
    },
    headers: {
      'x-api-key': config.public.pictohub.PICTOHUB_API_KEY
    }
  });
  return data[0];
}


</script>