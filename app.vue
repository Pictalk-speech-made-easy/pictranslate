<template>
  <div>
  <head>
    <link rel="manifest" href="/manifest.webmanifest">
    <meta name="theme-color" content="#8296FF">
    <meta name="charset" content="utf-8">
  </head>
  <VitePwaManifest />
    <NuxtLayout>
      <NuxtPage/>
    </NuxtLayout>
  </div>
</template>
<script setup lang="ts">
import { useStimulusDatabase } from './store/stiumulus-db';

const stimulusDatabase = useStimulusDatabase();
await stimulusDatabase.initialize_database()
</script>