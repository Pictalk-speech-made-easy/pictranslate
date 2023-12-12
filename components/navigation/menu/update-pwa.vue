<template>
    <div>
    <div
        v-if="$pwa?.needRefresh || $pwa?.isInstalled"
      >
        <div>
          <span role="alert" class="alert alert-success" v-if="$pwa.offlineReady || $pwa.isInstalled">
            {{ $t('menu.offline_ready')}}✈️
          </span>
        </div>
        <button
          v-if="$pwa.needRefresh"
          class="btn btn-primary"
          @click="$pwa.updateServiceWorker()"
        >
            {{ $t('menu.update_available') }}
        </button>
        <DevOnly>
        <div>{{  storageUsage() }}</div>
          <br>
          <div class="flex">
            <div class="bg-blue-100 dark:bg-grey-base-50 rounded-full" v-for="tag in storedTags()">{{ tag }}</div>
          </div>
        </DevOnly>
      </div>
      <div v-else>
        <span role="alert" class="alert alert-info">
          {{ $t('menu.offline_not_ready')}}
        </span>
      </div>
    </div>
</template>
<script setup lang="ts">
const quota: StorageEstimate = await navigator.storage.estimate();
const { bundleInformations } = useMiniPictohubDatabase();
function storageUsage() {
  if (quota.usage === undefined) {
    return 'Unknown';
  }
  return `${(quota.usage / 1000000).toFixed(2)} MB`;
}

function storedTags() {
  return bundleInformations.map((bundle) => bundle.tag);
}
</script>