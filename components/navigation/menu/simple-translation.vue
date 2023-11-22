<template>
    <div class="form-control">
            <label class="label cursor-pointer">
                <span class="label-text">{{ $t('menu.simple_translation') }}</span> 
                <input type="checkbox" class="toggle" checked v-model="options.simplifyTranslation" />
            </label>
        </div>
</template>
<script setup lang="ts">
import { useOptions } from '~/store/option';
const options = useOptions();
</script>