// import Dexie from 'dexie';

// interface MyDatabase extends Dexie {
//   items: Dexie.Table<any, number>; // define the items property
// }

// // Define your database
// const db = new Dexie('myDatabase') as MyDatabase;
// db.version(1).stores({
//     items: '++id'
// });

// // Fetch the JSON data
// fetch('../public/gram.json')
//     .then(response => response.json())
//     .then(data => {
//         // Open a transaction and put the data into the database
//         db.transaction('rw', db.items, async() => {
//             for (let item of data) {
//                 await db.items.put(item);
//             }
//         });
//     })

import Dexie from 'dexie';
import { GramResponse } from './store-types';
const EXPECTED_ENTRY_COUNT: number = 8000;
export const useGramDatabase = defineStore('gram', {
    state: () => ({
        db: undefined as Dexie | undefined,
        worker: undefined as Worker | undefined,
        db_filled: false as boolean,
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
            this.db_filled = false;
            this.suggestions = [];
        },
        startWorker() {
            if (this.worker === undefined && this.db_filled === false) {
                this.worker = new Worker('/gram-db.worker.js');
                this.worker.postMessage({
                    action: 'populateGramDatabase',
                });
                this.worker.onmessage = (event) => {
                    const { action, payload } = event.data;
                    if (action === 'populateGramDatabase') {
                        this.db_filled = event.data?.success;
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
        async initialize_database() {
            try {
                const db = new Dexie('gram-response');
                db.version(1).stores({
                    gram_response: '++gram',
                });
                await db.open();
                this.db = db;
                this.db_filled = await db.gram_response.count() == EXPECTED_ENTRY_COUNT ? true : false;
            } catch (error) {
                console.debug(error);
                this.db = undefined;
            }
        },
        async getGram(gramInput: string) {
            if (this.db === undefined || this.db_filled === false) {
                console.log("Database not initialized")
                return undefined;
            }
            //@ts-ignore
            console.log("Database initialized, searching for gram", gramInput.toUpperCase());
            const data = await this.db.gram_response.get(gramInput.toUpperCase());
            if (data?.responses.length > 0) {
                return data?.responses;
            }
            return undefined;
        }, 
        async getGramPictograms() {
            const main = useMain();
            let tempSuggestions = this.suggestions.slice(0, 5);
            tempSuggestions = await Promise.all(tempSuggestions.map(async (suggestion: GramResponse) => {
                suggestion.responses = await main.getPictogram(suggestion.gram, "en");
                return suggestion;
            }));
            console.debug("[main] pictohub tempSuggestions", JSON.parse(JSON.stringify(tempSuggestions)))
            let unfilteredPictograms: PictogramPropositions = tempSuggestions.map((gramResponse: GramResponse) => { return { 'selected': 0, 'pictograms': gramResponse.responses } })
            // Remove the empty elements and only keep the first 3 elements

            main.suggestedPictograms = unfilteredPictograms.filter((picto: any) => (picto.pictograms != undefined && picto.pictograms[0]?.external_alt_image != undefined)).slice(0, 3); // Change the slice number to 3 for example to have 3 suggestions per word
        },
    },
});

