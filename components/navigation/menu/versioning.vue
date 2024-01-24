<template>
    <div class="text-sm font-light font-mono p-2">
        <p>app : {{ version }}</p>
    </div>
</template>
<script setup lang="ts">
const version = useRuntimeConfig().public.clientVersion;
</script>