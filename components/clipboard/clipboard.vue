<script setup lang="ts">
import mergeImages from "merge-images-horizontally-with-text";
import { detectBrowser } from "~/utils/navigator";
let preGeneratedBlob: Blob | null = null;
let navigatorPermission = false;

onMounted(async () => {
  navigatorPermission = await navigatorAskWritePermission();
});

const props = defineProps({
    pictograms: {
        type: Array<Object>,
        required: true,
    },
    sentence: {
        type: String,
        required: true,
    },
});

const { pictograms } = toRefs(props)
const { sentence } = toRefs(props)

watch(pictograms, async (value) => {
  if (value.length > 0) {
    const paths = value.map((picto) => picto.external_alt_image);
      const b64 = await mergeImages(paths, {
        crossOrigin: "Anonymous",
        text: sentence.value,
        color: "white",
      });
      preGeneratedBlob = b64toBlob(b64);
  }
});

const b64toBlob = (dataURI) => {
      const byteString = atob(dataURI.split(",")[1]);
      const ab = new ArrayBuffer(byteString.length);
      let ia = new Uint8Array(ab);

      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ab], { type: "image/png" });
}

const copyPictosToClipboard = () => {
    if (!navigatorPermission && detectBrowser(navigator.userAgent) != "Safari") {
        console.log("No permission to write to clipboard");
        return false;
    }
    try {
        if (preGeneratedBlob == null) {
            return false;
        }
          const data = [new ClipboardItem({ [preGeneratedBlob.type]: preGeneratedBlob })];
          navigator.clipboard.write(data);
          return true;
      } catch (e) {
        console.log(e);
        return false;
      }
}

const navigatorAskWritePermission = async () => {
    try {
        // The clipboard-write permission is granted automatically to pages
        // when they are the active tab. So it's not required, but it's more safe.
        const { state } = await navigator.permissions.query({
          name: "clipboard-write",
        });
        return state === "granted";
      } catch (error) {
        // Browser compatibility / Security error (ONLY HTTPS) ...
        return false;
      }
}

const getPreGeneratedBlob = () => {
    return preGeneratedBlob;
}
defineExpose({
    copyPictosToClipboard,
    getPreGeneratedBlob
  });
</script>
<template>
<div id="clipboard-component"></div>
</template>