
// @ts-ignore
import mergeImages from "merge-images-horizontally-with-text";
import Bowser from 'bowser';
import { useMain } from "~/store/main";
export function useClipboard() {
    const main = useMain();
    const preGeneratedBlob: Ref<Blob | null> = ref(null);
    const getPreGeneratedBlob = () => {
        return preGeneratedBlob.value;
    }
    let navigatorPermission = false;
    onMounted(async () => {
        navigatorPermission = await navigatorAskWritePermission();
    });
    watch(() => main.pictogramsPropositions, async (value) => {
        console.debug("[Clipboard] watch triggered")
        if (value.length > 0) {
            console.debug("[Clipboard] Pictograms changed, generating new blob")
            const paths = value.map((picto: any) => picto['pictograms'][picto['selected']].external_alt_image);
            console.debug("[Clipboard] paths", paths)
            try {
                const b64 = await mergeImages(paths, {
                    crossOrigin: "Anonymous",
                    text: main.textInput,
                    color: "white",
                });
                preGeneratedBlob.value = b64toBlob(b64);
            } catch (e) {
                console.log(paths)
                console.error(e);
            }
        } else {
            preGeneratedBlob.value = null;
        }
    }, { deep: true });

    function copyPictosToClipboard() {
        if (!navigatorPermission && detectBrowser().browser != "Safari") {
            console.debug("No permission to write to clipboard");
            return false;
        }
        try {
            if (preGeneratedBlob.value === null) {
                return false;
            }
            const data = [new ClipboardItem({ [preGeneratedBlob.value.type]: preGeneratedBlob.value })];
            navigator.clipboard.write(data);
            return true;
        } catch (e) {
            console.debug(e);
            return false;
        }
    }

    function downloadPictograms() {
        const preGenBlob = getPreGeneratedBlob();
        console.debug(preGenBlob)
        if (preGenBlob == null) {
            return;
        }
        console.debug("[main] downloadPictograms")
        const blobUrl = URL.createObjectURL(preGenBlob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = "pictranslate-sentence.png";
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
        document.body.removeChild(link);
    }
    const navigatorAskWritePermission = async () => {
        try {
            // The clipboard-write permission is granted automatically to pages
            // when they are the active tab. So it's not required, but it's more safe.
            const { state } = await navigator.permissions.query({
                name: "clipboard-write" as PermissionName,
            });
            return state === "granted";
        } catch (error) {
            // Browser compatibility / Security error (ONLY HTTPS) ...
            return false;
        }
    }
    /**
     * Converts a base64 string to a Blob object.
     * @param {string}
     * @returns {Blob} The Blob object.
     */
    const b64toBlob = (dataURI: string) => {
        const byteString = atob(dataURI.split(",")[1]);
        const ab = new ArrayBuffer(byteString.length);
        let ia = new Uint8Array(ab);

        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: "image/png" });
    }
    /**
     * Detects the browser.
     * @returns {Bowser.Parser.Parser} The browser name, version, etc.
     */
    function detectBrowser(): { os: string; browser: string; type: string; } {
        const browser = Bowser.getParser(window.navigator.userAgent);
        return { os: browser.getOSName(), browser: browser.getBrowserName(), type: browser.getPlatformType() };
    }

    return {
        copyPictosToClipboard,
        downloadPictograms
    };
}