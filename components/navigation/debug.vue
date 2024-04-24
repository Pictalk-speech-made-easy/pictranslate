<template>
    <dialog class="modal modal-open fixed">
        <div class="modal-box px-8 pt-12 pb-8 md:max-w-2xl lg:max-w-4xl max-w-full bg-base-100">
            <button @click="close" class="fixed left-2 top-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" viewBox="0 0 24 24">
                    <path class="fill-primary"
                        d="M19.1 4.9C15.2 1 8.8 1 4.9 4.9S1 15.2 4.9 19.1s10.2 3.9 14.1 0s4-10.3.1-14.2zm-4.3 11.3L12 13.4l-2.8 2.8l-1.4-1.4l2.8-2.8l-2.8-2.8l1.4-1.4l2.8 2.8l2.8-2.8l1.4 1.4l-2.8 2.8l2.8 2.8l-1.4 1.4z" />
                </svg>
            </button>
            <h3 class="text-2xl font-bold mb-8">{{ $t('menu.debug.title') }}</h3>
            <div class="flex items-end gap-1">
                <button class="btn btn-primary btn-outline w-4/5" @click="emptyCache()">{{ $t('menu.debug.clear_cache') }}</button>
                <div class="tooltip tooltip-info tooltip-bottom before:w-64 before:-translate-x-56"
                    :data-tip="$t('menu.debug.clear_cache_tooltip')">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        class="stroke-info shrink-0 w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
            </div>
            <div class="divider mt-8"></div>
            <div tabindex="0"
                :class="{ 'collapse collapse-arrow w-11/12 p-0': true, 'collapse-open': showReport, 'collapse-close': !showReport }">
                <div class="collapse-title text-xl font-medium pl-0" @click="showReport = !showReport">
                    {{ $t('menu.debug.bug_report.title') }}
                </div>
                <div class="collapse-content p-0 mb-4">
                    <div class="form-control gap-2">
                        <input class="input input-bordered" v-model="email"
                            :placeholder="$t('menu.debug.bug_report.email')" />
                        <textarea class="input input-bordered h-20" v-model="comments" :placeholder="$t('menu.debug.bug_report.description')"/>
                        <button class="btn btn-ghost underline lowercase justify-start font-normal text-sm p-1 btn-sm" @click="showDebugInfo = !showDebugInfo">
                        {{ $t('menu.debug.bug_report.show_info') }}
                        </button>
                        <textarea v-if="showDebugInfo" class="input input-bordered h-20 font-light" v-model="debugInfo"/>
                        <div class="flex items-end gap-1 mt-2">
                            <button :class="{'btn btn-outline w-10/12 btn-primary': true, 'btn-success pointer-events-none': sentFeedback}" @click="submitFeedback">
                                {{ sentFeedback ? $t('menu.debug.bug_report.success') :$t('menu.debug.bug_report.send') }}
                            </button>
                            <div class="tooltip tooltip-info tooltip-top before:w-64 before:-translate-x-56"
                                :data-tip="$t('menu.debug.bug_report.send_tooltip')">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    class="stroke-info shrink-0 w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button @click="close()"></button>
        </form>
    </dialog>
</template>
<script setup lang="ts">
import * as Sentry from '@sentry/vue';
import { useStore } from '~/store';
import { useOptions } from '~/store/option';
const {t} = useI18n();
const store = useStore();
const options = useOptions();
const email = ref('');
const comments = ref('');
const showReport = ref(false);
const showDebugInfo = ref(false);
const debugInfo = ref('');
const sentFeedback = ref(false);
function submitFeedback() {
    if(sentFeedback.value) return;
    if(email.value === "" || comments.value === "") return alert(t('menu.debug.bug_report.field_error'));
    const eventId = Sentry.captureMessage("User Feedback")
    if (!eventId) return console.error("Sentry failed to capture message");
    const userFeedback = {
        event_id: eventId,
        name: email.value,
        email: email.value,
        comments: comments.value,
    }
    Sentry.captureUserFeedback(userFeedback);
    sentFeedback.value = true;
};
function emptyCache() {
    store.$reset();
    options.$reset();
    window.location.reload();
}
function close() {
    if (window.history.length > 1) window.history.back();
    hide();
}
function hide() {
    store.modal.debug = false;
}
onMounted(async () => {
    try {
        // unwatch the store to avoid circular references
        const storeInfo = JSON.parse(JSON.stringify(store.$state));
        const optionsInfo = JSON.parse(JSON.stringify(options.$state));
        debugInfo.value = `${JSON.stringify(storeInfo)}\n${JSON.stringify(optionsInfo)}}`;
    } catch (error) {
        console.error(error);
    }
    window.addEventListener('popstate', () => {
        hide();
    });
});
onUnmounted(() => {
    window.removeEventListener('popstate', () => {
        hide();
    });
});
</script>