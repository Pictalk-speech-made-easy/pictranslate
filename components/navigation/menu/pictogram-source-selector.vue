<template>
    <details id="dropdown-pictogram-source" class="dropdown no-animation w-full" ref="sourceSelector">
        <summary class="my-1 btn bg-secondary/75 w-full rounded-lg justify-start"
            @click="dropdownState = !dropdownState">
            <img class="h-7 aspect-square object-contain rounded-sm"
                :src="`/pictograms-sources/${options.preferredSources}.webp`" />
            {{ options.preferredSources.toLocaleUpperCase() }}
            <label class="swap swap-rotate ml-auto pointer-events-none">
                <input v-model="dropdownState" type="checkbox" aria-label="toggle pictograms source" />
                <svg class="swap-off h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path class="fill-primary" d="M7.41 8.58L12 13.17l4.59-4.59L18 10l-6 6l-6-6l1.41-1.42Z" />
                </svg>
                <svg class="swap-on h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path class="fill-primary" d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6l-6 6l1.41 1.41Z" />
                </svg>
            </label>
        </summary>
        <div class="p-2 shadow menu dropdown-content z-[1] bg-secondary rounded-lg w-full">
            <div class="flex items-center" v-for="source in ImageSource">
                <button :id="`dropdown-pictogram-source-${source}`" @click="setSource(source)"
                    class="btn btn-ghost btn-sm w-full justify-start my-0.5">
                    <img class="h-7 aspect-square object-contain rounded-sm"
                        :src="`/pictograms-sources/${source}.webp`" />
                    {{ source.toLocaleUpperCase() }}
                </button>
            </div>
        </div>
    </details>
</template>
<script setup lang="ts">
import { useOptions } from '~/store/option';
import { ImageSource } from '~/store/store-types';
const options = useOptions();
const sourceSelector = ref(null);
const dropdownState = ref(false);
function setSource(source: typeof ImageSource[number]) {
    options.preferredSources = source;
    dropdownState.value = false;
    if (!sourceSelector.value) return;
    (sourceSelector.value as any).open = false;
}
</script>