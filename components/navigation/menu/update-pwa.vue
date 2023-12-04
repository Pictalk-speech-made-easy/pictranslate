<template>
    <div>
    <div
        v-if="$pwa?.offlineReady || $pwa?.needRefresh"
      >
        <div>
          <span role="alert" class="alert alert-success" v-if="$pwa.offlineReady">
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
        <div>SIZE OF THE APPLICATION</div>
        <br>
        <div>Tags that are installed</div>
      </div>
      <div v-else>
        <span role="alert" class="alert alert-info">
          {{ $t('menu.offline_not_ready')}}
        </span>
      </div>
    </div>
</template>