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
import { useHistoryDatabase } from './store/history';

// Initialize stimulus database
const stimulusDatabase = useStimulusDatabase();
await stimulusDatabase.initialize_database()

// Initialize history database
const historyDatabase = useHistoryDatabase();
await historyDatabase.initialize_database()
</script>