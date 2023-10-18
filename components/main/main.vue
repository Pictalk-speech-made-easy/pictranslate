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
      <button class="btn btn-primary rounded-2xl" @click="downloadPictograms">{{ $t('downloadButton') }}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path class="fill-gray-100" fill-rule="evenodd" clip-rule="evenodd" d="M12 1.25C12.4142 1.25 12.75 1.58579 12.75 2V12.9726L14.4306 11.0119C14.7001 10.6974 15.1736 10.661 15.4881 10.9306C15.8026 11.2001 15.839 11.6736 15.5694 11.9881L12.5694 15.4881C12.427 15.6543 12.2189 15.75 12 15.75C11.7811 15.75 11.573 15.6543 11.4306 15.4881L8.43056 11.9881C8.16099 11.6736 8.19741 11.2001 8.51191 10.9306C8.8264 10.661 9.29988 10.6974 9.56944 11.0119L11.25 12.9726V2C11.25 1.58579 11.5858 1.25 12 1.25ZM6.99583 8.25196C7.41003 8.24966 7.74768 8.58357 7.74999 8.99778C7.7523 9.41199 7.41838 9.74964 7.00418 9.75194C5.91068 9.75803 5.1356 9.78643 4.54735 9.89448C3.98054 9.99859 3.65246 10.1658 3.40901 10.4092C3.13225 10.686 2.9518 11.0746 2.85315 11.8083C2.75159 12.5637 2.75 13.5648 2.75 15.0002V16.0002C2.75 17.4356 2.75159 18.4367 2.85315 19.1921C2.9518 19.9259 3.13225 20.3144 3.40901 20.5912C3.68577 20.868 4.07435 21.0484 4.80812 21.1471C5.56347 21.2486 6.56458 21.2502 8 21.2502H16C17.4354 21.2502 18.4365 21.2486 19.1919 21.1471C19.9257 21.0484 20.3142 20.868 20.591 20.5912C20.8678 20.3144 21.0482 19.9259 21.1469 19.1921C21.2484 18.4367 21.25 17.4356 21.25 16.0002V15.0002C21.25 13.5648 21.2484 12.5637 21.1469 11.8083C21.0482 11.0746 20.8678 10.686 20.591 10.4092C20.3475 10.1658 20.0195 9.99859 19.4527 9.89448C18.8644 9.78643 18.0893 9.75803 16.9958 9.75194C16.5816 9.74964 16.2477 9.41199 16.25 8.99778C16.2523 8.58357 16.59 8.24966 17.0042 8.25196C18.0857 8.25799 18.9871 8.28387 19.7236 8.41916C20.4816 8.55839 21.1267 8.82364 21.6517 9.34857C22.2536 9.95048 22.5125 10.7084 22.6335 11.6085C22.75 12.4754 22.75 13.5778 22.75 14.9453V16.0551C22.75 17.4227 22.75 18.525 22.6335 19.392C22.5125 20.2921 22.2536 21.0499 21.6517 21.6519C21.0497 22.2538 20.2919 22.5127 19.3918 22.6337C18.5248 22.7503 17.4225 22.7502 16.0549 22.7502H7.94513C6.57754 22.7502 5.47522 22.7503 4.60825 22.6337C3.70814 22.5127 2.95027 22.2538 2.34835 21.6519C1.74643 21.0499 1.48754 20.2921 1.36652 19.392C1.24996 18.525 1.24998 17.4227 1.25 16.0551V14.9453C1.24998 13.5778 1.24996 12.4754 1.36652 11.6085C1.48754 10.7084 1.74643 9.95048 2.34835 9.34857C2.87328 8.82363 3.51835 8.55839 4.27635 8.41916C5.01291 8.28387 5.9143 8.25798 6.99583 8.25196Z" fill="#1C274C"></path> </g></svg>
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

const downloadPictograms = () => {
  console.log(clipboardHelper.value?.getPreGeneratedBlob())
  if (clipboardHelper.value == null || clipboardHelper.value?.getPreGeneratedBlob() == null) {
    return;
  }
  console.debug("[main] downloadPictograms")
  // Create a Blob URL
  const blobUrl = URL.createObjectURL(clipboardHelper.value?.getPreGeneratedBlob());

  // Create a link element
  const link = document.createElement("a");

  // Set link's href to point to the Blob URL
  link.href = blobUrl;
  link.download = "pictranslate-sentence.png";

  // Append link to the body
  document.body.appendChild(link);

  // Dispatch click event on the link
  // This is necessary as link.click() does not work on the latest firefox
  link.dispatchEvent(
    new MouseEvent('click', { 
      bubbles: true, 
      cancelable: true, 
      view: window 
    })
  );

  // Remove link from body
  document.body.removeChild(link);
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
    return getPictoFromPictohub(word, locale.value, [locale.value, 'en']);
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