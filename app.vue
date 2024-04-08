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
// import { useStimulusDatabase } from './store/stiumulus-db';
import {useGramDatabase} from './store/gram-db';
import { useHistoryDatabase } from './store/history';
import { useMiniPictohubDatabase } from './store/mini-pictohub-db';
// Initialize stimulus database
// const stimulusDatabase = useStimulusDatabase();
// await stimulusDatabase.initialize_database();

// Initialize gram database
const GramDatabase = useGramDatabase();
await GramDatabase.initialize_database();

// Initialize history database
const historyDatabase = useHistoryDatabase();
await historyDatabase.initialize_database();

const miniPictohubDatabase = useMiniPictohubDatabase();
await miniPictohubDatabase.initialize_database();
</script>