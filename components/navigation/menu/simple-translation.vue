<template>
    <div class="form-control">
        <label class="label cursor-pointer">
            <span class="label-text">{{ $t('menu.translation.simple_translation') }}</span>
            <input type="checkbox" class="toggle" checked v-model="options.simplifyTranslation" />
        </label>
        <div v-if="options.simplifyTranslation === false" role="alert" class="alert alert-warning">
            {{ $t('menu.translation.advanced_translation_alert') }}
        </div>
    </div>
</template>
<script setup lang="ts">
import { useOptions } from '~/store/option';
const options = useOptions();
</script>