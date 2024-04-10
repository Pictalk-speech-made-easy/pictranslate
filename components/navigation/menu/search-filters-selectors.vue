<template>
    <div>
        <div class="form-control">
            <label class="label cursor-pointer">
                <span class="label-text">{{ $t('menu.filters.sex_filter') }}</span>
                <input type="checkbox" class="toggle" checked v-model="options.sexFilter" />
            </label>
        </div>
        <div class="form-control">
            <label class="label cursor-pointer">
                <span class="label-text">{{ $t('menu.filters.violence_filter') }}</span>
                <input type="checkbox" class="toggle" checked v-model="options.violenceFilter" />
            </label>
        </div>
    </div>
</template>
<script setup lang="ts">
import { useOptions } from '~/store/option';
const options = useOptions();
</script>