import Dexie from 'dexie';
import type { GramResponse } from './store-types';
import { useMain } from './main';
import { isPreposition } from '~/utils/language';

export const useGramDatabase = defineStore('gram', {
    state: () => ({
        db: undefined as Dexie | undefined,
        worker: undefined as Worker | undefined,
        suggestions: [] as GramResponse[],
    }),
    persist: {
        storage: persistedState.localStorage,
        serializer: {
            serialize: (state) => {
                // Create a copy of the state excluding the 'db' property
                const { db, ...stateWithoutDb } = state;
                return JSON.stringify(stateWithoutDb);
            },
            deserialize: JSON.parse
        }
    },
    actions: {
        async deleteDatabase() {
            const db = new Dexie('gram-response');
            await db.delete();
            this.suggestions = [];
        },
        startWorker() {
            if (this.worker === undefined ) {
                this.worker = new Worker('/gram-db.worker.js');
                this.worker.postMessage({
                    action: 'populateGramDatabase',
                });
                this.worker.onmessage = (event) => {
                    const { action, payload } = event.data;
                    if (action === 'populateGramDatabase') {
                    };
                }
            } 
        },
        stopWorker() {
            if (this.worker !== undefined) {
                this.worker.terminate();
                this.worker = undefined;
            }
        },
////

        async initialize_database() {
            try {
                const db = new Dexie('gram-response');
                db.version(1).stores({
                    gram_response: '++gram',
                });
                await db.open();
                this.db = db;
            } catch (error) {
                console.debug(error);
                this.db = undefined;
            }
        },

        async getGram(gramInput: string[]) {
            console.debug("[Gram-db] Getting gram from database")
            if (this.db === undefined  ) {
                console.debug("[Gram-db] Database not initialized")
                return undefined;
            }
            //@ts-ignore
            
            const words = gramInput.map((word: string) => word.toUpperCase())
            // console.log('words',words)
            let result = "";
            console.log("Words", words)
            if (words.length === 1) {
                result = `$START+${words[0]}`;
            } else {
                result = `${words[words.length - 2]}+${words[words.length - 1]}`
            }
            console.log("Database initialized, searching for gram", result);
             
            const data = await this.db.gram_response.get(result);
            if (data?.predictions.length > 0) {
                console.debug("[Gram-db] Found gram", data?.predictions);
                return data?.predictions;
            }
            console.debug("[Gram-db]Gram not found");
            return undefined;
        }, 
        async getGramPictograms() {
            const main = useMain();
            // Order this.suggestions by count
            this.suggestions.sort((a, b) => (a.count > b.count) ? -1 : 1);
            // Filter specific words that start with a $ or a #
            this.suggestions = this.suggestions.filter((suggestion: GramResponse) => !suggestion.word.startsWith("$") && !suggestion.word.startsWith("#") && !isPreposition(suggestion.word, "en"));
            // Also filter out the prepositions
            
            let tempSuggestions = this.suggestions.slice(0, 5);
            tempSuggestions = await Promise.all(tempSuggestions.map(async (suggestion: GramResponse) => {
                suggestion.predictions = await main.getPictogram(suggestion.word, "en");
                return suggestion;
            }));
            console.debug("[Gram-db] Suggestions", JSON.parse(JSON.stringify(tempSuggestions)))
            let unfilteredPictograms: PictogramPropositions = tempSuggestions.map((gramResponse: GramResponse) => { return { 'selected': 0, 'pictograms': gramResponse.predictions } })
            // Remove the empty elements and only keep the first 3 elements

            main.suggestedPictograms = unfilteredPictograms.filter((picto: any) => (picto.pictograms != undefined && picto.pictograms[0]?.images[0]?.url != undefined)).slice(0, 3); // Change the slice number to 3 for example to have 3 suggestions per word
        },
    },
});

