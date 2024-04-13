<template>
    <div class="form-control">
        <label class="label cursor-pointer">
            <span class="label-text">{{ $t('menu.translation.preferred_pictogram_source') }}</span>
        </label>
    </div>
    <details class="dropdown no-animation" ref="languageSelector">
        <summary class="m-1 btn bg-secondary/75 w-full rounded-lg justify-start"
            @click="dropdownState = !dropdownState">
            <img />
            {{ options.preferredSources }}
            <label class="swap swap-rotate ml-auto pointer-events-none">
                <input v-model="dropdownState" type="checkbox" aria-label="togglePageTheme" />
                <svg class="swap-off h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path class="fill-primary" d="M7.41 8.58L12 13.17l4.59-4.59L18 10l-6 6l-6-6l1.41-1.42Z" />
                </svg>
                <svg class="swap-on h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path class="fill-primary" d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6l-6 6l1.41 1.41Z" />
                </svg>
            </label>
        </summary>
        <div class="p-2 shadow menu dropdown-content z-[1] bg-secondary rounded-lg w-full">
            <div v-for="source in ImageSource">
                <button @click="options.preferredSources = source" class="btn btn-ghost btn-sm w-full justify-start">

                    {{ source }}
                </button>
                <img :src="`/pictograms-sources/${source}.webp`" />
            </div>
        </div>
    </details>
</template>
<script setup lang="ts">
import { useOptions } from '~/store/option';
const options = useOptions();
const dropdownState = ref(false);

</script>