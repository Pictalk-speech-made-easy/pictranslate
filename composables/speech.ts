import { ref, onMounted, onUnmounted } from 'vue'
import { detectBrowser } from "~/utils/device";
import EasySpeech from 'easy-speech'
import { preferedVoices } from '~/utils/voice-preferences';
import { useOptions } from '~/store/option';

export function useSpeech() {
    const speaking = ref(false)
    const TTSVoiceList = ref<SpeechSynthesisVoice[]>([]);
    const TTSVoice = ref<SpeechSynthesisVoice>();
    const TTS_ON_BOUNDARY_SUPPORT = ref(false);
    const options = useOptions();
    onMounted(async () => {
        const speechInfo = EasySpeech.detect();
        if(!speechInfo.speechSynthesis || !speechInfo.speechSynthesisUtterance){
            console.error("Speech synthesis is not supported in this browser.");
            return;
        }
        if(speechInfo.onboundary) TTS_ON_BOUNDARY_SUPPORT.value = true;
        try {
            await EasySpeech.init({ maxTimeout: 500, interval: 50 });
            TTSVoiceList.value = EasySpeech.voices();
            TTSVoice.value = getPreferedVoice();
        } catch (error) {
            console.error("Failed to initialize EasySpeech", error);
        }
    });
    watch(() => options.locale, () => {
        TTSVoice.value = getPreferedVoice();
    });
    /**
    * Speaks the given text using the browser's speech synthesis API.
    *
    * @param {string} text - The text to be spoken.
    */
    function speak(text: string) {
        const message = new SpeechSynthesisUtterance(text);
        message.rate = options.TTSRate ?? 1;
        message.pitch = options.TTSPitch ?? 1;
        message.voice = TTSVoice.value ?? null;
        // Speak the message
        window.speechSynthesis.speak(message);
        speaking.value = true;
        // When the message is finished, set speaking to false
        message.onend = () => {
            speaking.value = false;
        }
        return message;
    }
    /**
     * Returns the prefered voice for the current OS and browser.
     * @returns {SpeechSynthesisVoice | undefined}
     * The prefered voice for the current OS and browser.
     * If no voice is found, returns undefined.
    */
    function getPreferedVoice(): SpeechSynthesisVoice | undefined {
        const { os, browser } = detectBrowser();
        const OS_DEFAULT = preferedVoices[os]?.['default']?.[options.locale]
        const BROWSER = preferedVoices[os]?.[browser]?.[options.locale]
        const FALLBACK = TTSVoiceList.value.filter((voice) => voice.lang.includes(options.locale))[0];
        if (BROWSER) return TTSVoiceList.value.filter((voice) => voice.name === BROWSER)[0];
        if (OS_DEFAULT) return TTSVoiceList.value.filter((voice) => voice.name === OS_DEFAULT)[0];
        return FALLBACK;
    }
    return {
        speak,
        speaking,
        TTS_ON_BOUNDARY_SUPPORT,
    }
}