<template>
    <div>
        <label class="swap">
            <span>{{ $t('menu.sex_filter') }}</span>
            <input type="checkbox" v-model="options.sexFilter" />
            <div class="swap-on">ON</div>
            <div class="swap-off">OFF</div>
        </label>
        <label class="swap">
            <span>{{ $t('menu.violence_filter') }}</span>
            <input type="checkbox" v-model="options.violenceFilter" />
            <div class="swap-on">ON</div>
            <div class="swap-off">OFF</div>
        </label>
    </div>
</template>
<script setup lang="ts">
import { useOptions } from '~/store/option';
const options = useOptions();
</script>