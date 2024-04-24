<template>
    <div class="join">
        <button id="interface-size-normal" :class="{
            'btn join-item w-1/3': true,
            'bg-secondary/75': options.interfaceSize === 'normal'
        }" @click="setInterface('normal')">
            {{ $t('menu.layout.interface.normal') }}
        </button>
        <button id="interface-size-big" :class="{
            'btn join-item w-1/3': true,
            'bg-secondary/75': options.interfaceSize === 'big'
        }" @click="setInterface('big')">
            {{ $t('menu.layout.interface.big') }}
        </button>
        <button id="interface-size-xl" :class="{
            'btn join-item w-1/3': true,
            'bg-secondary/75': options.interfaceSize === 'xl'
        }" @click="setInterface('xl')">
            {{ $t('menu.layout.interface.xl') }}
        </button>
    </div>
</template>
<script setup lang="ts">
import { useOptions } from '~/store/option';
const options = useOptions();
setInterface(options.interfaceSize); // set interface size on page load

function setInterface(size: 'normal' | 'big' | 'xl'): void {
    options.interfaceSize = size;
    switch (size) {
        case 'normal':
            setFontSize(16);
            break;
        case 'big':
            setFontSize(18);
            break;
        case 'xl':
            setFontSize(20);
            break;
    }
}
function setFontSize(pixels: number): void {
    const rootElement = document.querySelector('html');
    if (!rootElement) return;
    rootElement.style.fontSize = `${pixels}px`;
}
</script>