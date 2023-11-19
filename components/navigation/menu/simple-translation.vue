<template>
    <div>
        <label class="swap">
            <span>{{ $t('menu.simple_translation') }}</span>
            <input type="checkbox" v-model="options.simplifyTranslation" />
            <div class="swap-on">ON</div>
            <div class="swap-off">OFF</div>
        </label>
    </div>
</template>
<script setup lang="ts">
import { useOptions } from '~/store/option';
const options = useOptions();
</script>