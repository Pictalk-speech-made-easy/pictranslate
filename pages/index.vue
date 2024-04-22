<template>
    <div class="drawer">
        <input id="menu-drawer" type="checkbox" class="drawer-toggle" @change="checkAnalytics" />
        <div class="drawer-content">
            <AppNavbar />
            <Main />
            <RateModal v-if="analytics.modal.rate" />
            <SurveyModal v-if="analytics.modal.survey" />
            <DebugModal v-if="store.modal.debug" />
        </div>
        <div class="drawer-side z-50">
            <label for="menu-drawer" class="drawer-overlay"></label>
            <div class="menu w-80 bg-base-200 h-full text-base-content shadow-2xl">
                <Menu />
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import AppNavbar from "~/components/navigation/appNavbar.vue";
import Menu from "~/components/navigation/menu.vue";
import Main from "~/components/main.vue";
import RateModal from '~/components/analytics/rate-modal.vue';
import SurveyModal from '~/components/analytics/survey-modal.vue';
import DebugModal from '~/components/navigation/debug.vue';
import { useOptions } from "~/store/option";
import { useStore } from "~/store";
import { useAnalytics } from "~/store/analytics";
import dayjs from "dayjs";
const options = useOptions();
const store = useStore();
const analytics = useAnalytics();

function checkAnalytics(event: Event){
    if(!event.target) return;
    if(!(event.target as any).checked) return;
    if(analytics.shouldRate()) return setTimeout(()=> openRateModal(), 1000);
    // we havn't made a survey yet, uncomment this line after creating the survey
    // if(analytics.shouldSurvey()) return setTimeout(()=> openSurveyModal(), 1000);
}
function openSurveyModal() {
    window.history.pushState('popup', "");
    analytics.modal.survey = true;
    analytics.lastSurveyPopup = dayjs().format();
}

function openRateModal() {
    window.history.pushState('popup', "");
    analytics.modal.rate = true;
    analytics.lastRatePopup = dayjs().format();
}
</script>