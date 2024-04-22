<template>
    <dialog class="modal modal-open fixed">
        <div
            class="modal-box px-8 pt-12 pb-8 md:max-w-2xl lg:max-w-4xl max-w-full bg-base-100 prose prose-lg lg:prose-xl prose-h2:mt-0">
            <button @click="close" class="fixed left-2 top-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                    <path class="fill-primary"
                        d="M19.1 4.9C15.2 1 8.8 1 4.9 4.9S1 15.2 4.9 19.1s10.2 3.9 14.1 0s4-10.3.1-14.2zm-4.3 11.3L12 13.4l-2.8 2.8l-1.4-1.4l2.8-2.8l-2.8-2.8l1.4-1.4l2.8 2.8l2.8-2.8l1.4 1.4l-2.8 2.8l2.8 2.8l-1.4 1.4z" />
                </svg>
            </button>
            <form class="lg:mx-6">
                <h2>{{ $t('marketing.rate_modal.title') }}</h2>
                <p>{{ $t('marketing.rate_modal.description') }}</p>
                <div class="rating flex justify-center">
                    <input type="radio" name="rating-2" class="mask mask-star-2 bg-orange-400 h-12 w-12" />
                    <input type="radio" name="rating-2" class="mask mask-star-2 bg-orange-400 h-12 w-12" />
                    <input type="radio" name="rating-2" class="mask mask-star-2 bg-orange-400 h-12 w-12" />
                    <input type="radio" name="rating-2" class="mask mask-star-2 bg-orange-400 h-12 w-12" />
                    <input type="radio" name="rating-2" class="mask mask-star-2 bg-orange-400 h-12 w-12" checked />
                </div>
                <div class="w-full pt-2 bg-base-100">
                    <button @click="rate" class="btn btn-primary mt-8">{{ $t('marketing.rate_modal.cta') }}
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                            <path class="fill-none stroke-primary-content" stroke-linecap="round" stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6m-7 1l9-9m-5 0h5v5" />
                        </svg>
                    </button>
                </div>
            </form>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button @click="close()"></button>
        </form>
    </dialog>
</template>
<script setup lang="ts">
import { useAnalytics } from '~/store/analytics';
import { detectBrowser } from '~/utils/device';
const analytics = useAnalytics();

async function rate() {
    hide();
    const browser = detectBrowser();
    // uncomment at publish !! (we might forgor though)
    return; // The application isn't published yet
    if (browser.os === 'Android') window.open(`https://play.google.com/store/apps/details?id=APPLICATION_ID`);
    if (browser.os === 'iOS') window.open(`https://apps.apple.com/app/idAPPLICATION_ID?action=write-review`);

}

function close() {
    if (window.history.length > 1) window.history.back();
    hide();
}
function hide() {
    analytics.lastRateMilestone = analytics.statistics.daysOfUse;
    analytics.modal.rate = false
}
onMounted(() => {
    window.addEventListener('popstate', () => {
        hide();
    });
});
onUnmounted(() => {
    window.removeEventListener('popstate', () => {
        hide();
    });
});
</script>../../utils/device