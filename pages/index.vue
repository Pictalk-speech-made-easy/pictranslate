<template>
    <div class="drawer">
        <input id="menu-drawer" type="checkbox" class="drawer-toggle" />
        <div class="drawer-content overflow-auto">
            <AppNavbar />
            <Main />
        </div>
        <div class="drawer-side">
            <label for="menu-drawer" class="drawer-overlay"></label>
            <div class="menu p-6 w-80 bg-base-200 h-screen text-base-content shadow-2xl border-0 border-r-2 border-gray-300 dark:border-gray-700">
                <Menu />
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import AppNavbar from "~/components/navigation/appNavbar.vue";
import Menu from "~/components/navigation/menu.vue";
import Main from "~/components/main.vue";
import { useOptions } from "~/store/option";
const options = useOptions();


</script>