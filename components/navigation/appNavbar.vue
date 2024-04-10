<template>
    <div class="top-0 fixed z-40 w-full bg-base-100" data-cy="app-navbar"
        :style="`top: ${!isNavbarVisible ? '-48px' : ''}; transition: top 0.1s;`">
        <div id="app-navbar" class="navbar min-h-[2rem] max-h-12 px-1 py-0">
            <div class="navbar-start">
                <label tabindex="0" for="menu-drawer" class="btn btn-primary btn-ghost btn-circle drawer-button">
                    <svg class="w-10 stroke-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                            d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                </label>
            </div>

            <div class="navbar-center">
                <!-- <NuxtImg
                src="/images/logo-full.png"
                class="h-14 rounded"
            /> -->
                <img src="/images/logo-full.png" class="h-16 rounded" />
            </div>
            <div class="navbar-end">

            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
const isNavbarVisible = ref(true);
const threshold = ref(96);
const lastYScroll = ref(0);
let cumulativeScrollDown = 0;
let cumulativeScrollUp = 0;

onMounted(() => {
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        updateNavbarVisibility(currentScroll);
    });
});
function updateNavbarVisibility(currentScroll: number) {
    if (currentScroll === 0) {
        isNavbarVisible.value = true;
        return;
    }
    if (currentScroll > lastYScroll.value) {
        cumulativeScrollDown += currentScroll - lastYScroll.value;
        cumulativeScrollUp = 0;
        if (cumulativeScrollDown > threshold.value) {
            isNavbarVisible.value = false;
        }
    } else {
        cumulativeScrollUp += lastYScroll.value - currentScroll;
        cumulativeScrollDown = 0;
        if (cumulativeScrollUp > threshold.value) {
            isNavbarVisible.value = true;
        }
    }
    lastYScroll.value = currentScroll;
}
</script>