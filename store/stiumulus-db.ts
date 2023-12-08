import Dexie from 'dexie';
import { StimulusResponse } from './store-types';
const EXPECTED_ENTRY_COUNT: number = 8211;
export const useStimulusDatabase = defineStore('stimulus', {
    state: () => ({
        db: undefined as Dexie | undefined,
        worker: undefined as Worker | undefined,
        db_filled: false as boolean,
        suggestions: [] as StimulusResponse[],
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
            const db = new Dexie('eat-stimulus-response');
            await db.delete();
            this.db_filled = false;
            this.suggestions = [];
        },
        startWorker() {
            if (this.worker === undefined && this.db_filled === false) {
                this.worker = new Worker('/stimulus-db.worker.js');
                this.worker.postMessage({
                    action: 'populateStimulusDatabase',
                });
                this.worker.onmessage = (event) => {
                    const { action, payload } = event.data;
                    if (action === 'populateStimulusDatabase') {
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
                const db = new Dexie('eat-stimulus-response');
                db.version(1).stores({
                    stimulus_response: '++stimulus',
                });
                await db.open();
                this.db = db;
                this.db_filled = await db.stimulus_response.count() == EXPECTED_ENTRY_COUNT ? true : false;
            } catch (error) {
                console.debug(error);
                this.db = undefined;
            }
        },
        async getStimulus(stimulusInput: string) {
            if (this.db === undefined || this.db_filled === false) {
                console.log("Database not initialized")
                return undefined;
            }
            //@ts-ignore
            console.log("Database initialized, searching for stimulus", stimulusInput.toUpperCase());
            const data = await this.db.stimulus_response.get(stimulusInput.toUpperCase());
            if (data?.responses.length > 0) {
                return data?.responses;
            }
            return undefined;
        }, 
        async getStimulusPictograms() {
            const main = useMain();
            let tempSuggestions = this.suggestions.slice(0, 5);
            tempSuggestions = await Promise.all(tempSuggestions.map(async (suggestion: StimulusResponse) => {
                suggestion.responses = await main.getPictogram(suggestion.stimulus, "en");
                return suggestion;
            }));
            console.debug("[main] pictohub tempSuggestions", JSON.parse(JSON.stringify(tempSuggestions)))
            let unfilteredPictograms: PictogramPropositions = tempSuggestions.map((stimulusResponse: StimulusResponse) => { return { 'selected': 0, 'pictograms': stimulusResponse.responses } })
            // Remove the empty elements and only keep the first 3 elements

            main.suggestedPictograms = unfilteredPictograms.filter((picto: any) => (picto.pictograms != undefined && picto.pictograms[0]?.external_alt_image != undefined)).slice(0, 3); // Change the slice number to 3 for example to have 3 suggestions per word
        },
    },
});

