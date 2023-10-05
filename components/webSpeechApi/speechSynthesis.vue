<script setup lang="ts">

const speech_synthesis_voices = ref<SpeechSynthesisVoice[]>([]);
const speech_synthesis_voice = ref<SpeechSynthesisVoice>();

const props = defineProps({
    language: {
        type: String,
        required: true,
    },
});

const { language } = toRefs(props)

onMounted(() => {
    const allVoicesObtained = new Promise <SpeechSynthesisVoice[]>(function (resolve, reject) {
      try {
        let temp_voices: SpeechSynthesisVoice[] = window.speechSynthesis.getVoices();
        if (temp_voices.length > 1) {
          resolve(temp_voices);
        } else {
          if (!window.safari && navigator.userAgent.indexOf("Firefox") == -1) {
            window.speechSynthesis.addEventListener(
              "voiceschanged",
              function () {
                try {
                    temp_voices = window.speechSynthesis.getVoices();
                } catch (err) {
                  reject(err);
                }
                if (!temp_voices || temp_voices.length <= 1) {
                  reject();
                }
                resolve(temp_voices);
              }
            );
          } else {
            let intervalCounter = 0;
            const getVoicesInterval = setInterval(() => {
              try {
                intervalCounter++;
                temp_voices = window.speechSynthesis.getVoices();
              } catch (err) {
                reject(err);
              }
              if (temp_voices && temp_voices?.length > 1) {
                clearInterval(getVoicesInterval);
                resolve(temp_voices);
              }
              if (intervalCounter >= 10) {
                clearInterval(getVoicesInterval);
                reject("No voices found");
              }
            }, 200);
          }
        }
      } catch (err) {
        reject(err);
      }
    });
    allVoicesObtained.then((resolved_voices: SpeechSynthesisVoice[]) => {
        speech_synthesis_voices.value = resolved_voices;
      searchForPreferredVoices();
    });
});

const speak = (speech: string, pitch: number = 1, rate: number = 1) => {
    console.debug(`[speak]: ${speech}, ${pitch}, ${rate}`);
    let message = new SpeechSynthesisUtterance(speech);
    message.pitch = pitch;
    message.rate = rate;
    message.voice = speech_synthesis_voice.value ? speech_synthesis_voice.value : null;
    window.speechSynthesis.speak(message);
}

const searchForPreferredVoices = () => {
    if (navigator.userAgent.includes("Mac OS X")) {
    console.debug("Searching for preferred voices on Apple")
    searchForPreferredVoicesApple();
    return;
    }
    if (navigator.userAgent.includes("SM-") && detectBrowser(navigator.userAgent) != "Chrome") {
    console.debug("Searching for preferred voices on Android Samsung")
    searchForPreferredVoicesAndroidSamsung();
    return;
    }
    if (detectBrowser(navigator.userAgent) == "Chrome") {
    console.debug("Searching for preferred voices on Android Chrome")
    searchForPreferredVoicesAndroidChrome();
    return;
    }
    if (navigator.userAgent.includes("Android")) {
    console.debug("Searching for preferred voices on Android standard")
    searchForPreferredVoicesAndroidChrome();
    return;
    }
}

const searchForPreferredVoicesAndroidChrome = () => {
    if (language.value == "fr-FR") {
    speech_synthesis_voice.value == speech_synthesis_voices.value.filter(
        (voice:SpeechSynthesisVoice) => (voice.lang.includes("fr_FR"))
    )[0];
    }
    if (language.value == "en-GB") {
    speech_synthesis_voice.value =speech_synthesis_voices.value.filter(
        (voice:SpeechSynthesisVoice) => voice.lang.includes("en_GB")
    )[0];
    }
    if (language.value == "es-ES") {
        speech_synthesis_voice.value =speech_synthesis_voices.value.filter(
            (voice:SpeechSynthesisVoice) => voice.lang.includes("es_ES")
        )[0];
    }
    if (language.value == "de-DE") {
        speech_synthesis_voice.value =speech_synthesis_voices.value.filter(
        (voice:SpeechSynthesisVoice) => voice.lang.includes("de_DE")
    )[0];
    }
    if (language.value == "it-IT") {
        speech_synthesis_voice.value =speech_synthesis_voices.value.filter(
        (voice:SpeechSynthesisVoice) => voice.lang.includes("it_IT")
    )[0];
    }
    if (language.value == "pt-PT") {
        speech_synthesis_voice.value =speech_synthesis_voices.value.filter(
        (voice:SpeechSynthesisVoice) => voice.lang.includes("pt_PT")
    )[0];
    }
}

const searchForPreferredVoicesAndroidSamsung = () => {
      if (language.value == "fr-FR") {
        speech_synthesis_voice.value =speech_synthesis_voices.value.filter(
          (voice:SpeechSynthesisVoice) => ((voice.lang.includes("fra"))) && voice.voiceURI.includes("fra_FRA_default")
        )[0];
      }
      if (language.value == "en-GB") {
        speech_synthesis_voice.value =speech_synthesis_voices.value.filter(
          (voice:SpeechSynthesisVoice) => voice.lang.includes("eng") && voice.voiceURI.includes("eng_GBR_default")
        )[0];
      }
      if (language.value == "es-ES") {
        speech_synthesis_voice.value =speech_synthesis_voices.value.filter(
          (voice:SpeechSynthesisVoice) => voice.lang.includes("spa") && voice.voiceURI.includes("spa_ESP_default")
        )[0];
      }
      if (language.value == "de-DE") {
        speech_synthesis_voice.value =speech_synthesis_voices.value.filter(
          (voice:SpeechSynthesisVoice) => voice.lang.includes("deu") && voice.voiceURI.includes("deu_DEU_default")
        )[0];
      }
      if (language.value == "it-IT") {
        speech_synthesis_voice.value =speech_synthesis_voices.value.filter(
          (voice:SpeechSynthesisVoice) => voice.lang.includes("ita") && voice.voiceURI.includes("ita_ITA_default")
        )[0];
      }
      if (language.value == "pt-PT") {
        speech_synthesis_voice.value =speech_synthesis_voices.value.filter(
          (voice:SpeechSynthesisVoice) => voice.lang.includes("por") && voice.voiceURI.includes("por_BRA_default")
        )[0];
      }
}

const searchForPreferredVoicesApple = () => {
      if (language.value == "fr-FR") {
        speech_synthesis_voice.value =speech_synthesis_voices.value.filter(
          (voice:SpeechSynthesisVoice) => ((voice.lang == "fr-FR") || (voice.lang == "fr-CA")) && (voice.voiceURI.includes("Amelie") || voice.voiceURI.includes("Amélie"))
        )[0];
      }
      if (language.value == "en-GB") {
        speech_synthesis_voice.value =speech_synthesis_voices.value.filter(
          (voice:SpeechSynthesisVoice) => voice.lang == language.value && voice.voiceURI.includes("Daniel")
        )[0];
      }
      if (language.value == "es-ES") {
        speech_synthesis_voice.value =speech_synthesis_voices.value.filter(
          (voice:SpeechSynthesisVoice) => voice.lang == language.value && (voice.voiceURI.includes("Monica") || voice.voiceURI.includes("Mónica"))
        )[0];
      }
      if (language.value == "de-DE") {
        speech_synthesis_voice.value =speech_synthesis_voices.value.filter(
          (voice:SpeechSynthesisVoice) => voice.lang == language.value && voice.voiceURI.includes("Anna")
        )[0];
      }
      if (language.value == "it-IT") {
        speech_synthesis_voice.value =speech_synthesis_voices.value.filter(
          (voice:SpeechSynthesisVoice) => voice.lang == language.value && voice.voiceURI.includes("Alice")
        )[0];
      }
      if (language.value == "pt-PT") {
        speech_synthesis_voice.value =speech_synthesis_voices.value.filter(
          (voice:SpeechSynthesisVoice) => voice.lang == language.value && voice.voiceURI.includes("Joana")
        )[0];
      }
    }

    defineExpose({
    speak
  });
</script>
<template>
    <div id="speechsynthesis-component"></div>
</template>