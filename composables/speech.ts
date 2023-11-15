import { ref, onMounted } from 'vue'
import Bowser from 'bowser';
import { preferedVoices } from '~/utils/voice-preferences';
import { useOptions } from '~/store/option';
// by convention, composable function names start with "use"
export function useSpeech() {
    // state encapsulated and managed by the composable
    const speaking = ref(false)
    const TTSVoiceList = ref<SpeechSynthesisVoice[]>([]);
    const TTSVoice = ref<SpeechSynthesisVoice>();
    const options = useOptions();
    onMounted(async () => {
        if (!TTSBrowserCompatibility()) return
        TTSVoiceList.value = await getTTSVoices();
        TTSVoice.value = getPreferedVoice();
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
        message.rate = options.TTSRate ? options.TTSRate : 1;
        message.pitch = options.TTSPitch ? options.TTSPitch : 1;
        message.voice = TTSVoice.value ? TTSVoice.value : null;
        // Speak the message
        window.speechSynthesis.speak(message);
        speaking.value = true;
        // When the message is finished, set speaking to false
        message.onend = () => {
            speaking.value = false;
        }
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
    /**
     * Detects the browser.
     * @returns {Bowser.Parser.Parser} The browser name, version, etc.
     */
    function detectBrowser(): { os: string; browser: string; type: string; } {
        const browser = Bowser.getParser(window.navigator.userAgent);
        return { os: browser.getOSName(), browser: browser.getBrowserName(), type: browser.getPlatformType() };
    }
    /**
     * Returns true if the browser supports speech synthesis, false otherwise.
     * @returns {boolean} True if the browser supports speech synthesis, false otherwise.
     */
    function TTSBrowserCompatibility(): boolean {
        return "speechSynthesis" in window ? true : false;
    }

    /**
     * Get all the voices available for speech synthesis.
     * @returns {SpeechSynthesisVoice[]} The list of voices available for speech synthesis.
     */
    async function getTTSVoices(): Promise<SpeechSynthesisVoice[]> {
        let voices = window.speechSynthesis.getVoices();
        if (voices.length === 0) {
            voices = await waitForTTSVoices();
        }
        return voices;
    }

    /**
     * Wait for the speech synthesis voices to be loaded by listening to the 'onvoiceschanged' event.
     * @returns {Promise<SpeechSynthesisVoice[]>} The list of voices available for speech synthesis.
     */
    function waitForTTSVoices(): Promise<SpeechSynthesisVoice[]> {
        const promise = new Promise<SpeechSynthesisVoice[]>((resolve) => {
            window.speechSynthesis.onvoiceschanged = () => {
                resolve(window.speechSynthesis.getVoices());
            }
        });
        return promise;
    }

    return {
        speak,
        speaking,
    }
}