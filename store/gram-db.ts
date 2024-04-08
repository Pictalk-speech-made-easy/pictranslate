import Dexie from 'dexie';
import { GramResponse } from './store-types';
import { useMain } from './main';

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

        async getGram(gramInput: string) {
            console.log("Getting gram from database")
            if (this.db === undefined  ) {
                console.log("Database not initialized")
                return undefined;
            }
            //@ts-ignore
            console.log("Database initialized, searching for gram", gramInput.toUpperCase());
            // const data = await this.db.gram_response.get(gramInput.toUpperCase());
            // const data = await this.db.gram_response.get("$START+Accept");
            const words = [gramInput.toUpperCase().split(" ")];
            // console.log('words',words)
            const result = [];
            result.push(`$START+${words[0][0]}`);
            for (let i = 1; i < words[0].length; i++) {
                result.push(`${words[0][i - 1]}+${words[0][i]}`);
            } 

            // const result = words[0].map((word,index) => {
            //     if(index ==0){
            //         console.log("First word", word)
            //         return `$START+${word}`;
            //     }else{
            //         console.log("Other words", word)
            //         return `${words[index - 1]}+${word}`;
            //     }
            // });
    

            console.log("Result", result[result.length - 1])

            const data = await this.db.gram_response.get(result[result.length - 1]);
            // const data = await this.db.gram_response.get("$START+Accept");
            console.log("Data", data)
            if (data?.predictions.length > 0) {
                console.log("Found gram", data?.predictions);
                return data?.predictions;
            }
            console.log("Gram not found");
            return undefined;
        }, 
        async getGramPictograms() {
            console.log("Getting pictograms from gram")
            const main = useMain();
            let tempSuggestions = this.suggestions.slice(0, 5);
            console.log("Temp suggestions", tempSuggestions)

            tempSuggestions = await Promise.all(tempSuggestions.map(async (suggestion: GramResponse) => {
                suggestion.predictions = await main.getPictogram(suggestion.gram, "fr");
                console.log("Pictograms for gram", suggestion.predictions)
                return suggestion;
            }));
            console.debug("[main] pictohub tempSuggestions", JSON.parse(JSON.stringify(tempSuggestions)))
            let unfilteredPictograms: PictogramPropositions = tempSuggestions.map((gramResponse: GramResponse) => { return { 'selected': 0, 'pictograms': gramResponse.predictions } })
            // Remove the empty elements and only keep the first 3 elements

            main.suggestedPictograms = unfilteredPictograms.filter((picto: any) => (picto.pictograms != undefined && picto.pictograms[0]?.external_alt_image != undefined)).slice(0, 3); // Change the slice number to 3 for example to have 3 suggestions per word
        },
    },
});

