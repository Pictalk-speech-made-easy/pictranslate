import Dexie from 'dexie';
export const useStimulusDatabase = defineStore('stimulus', {
    state: () => ({
        db: undefined as Dexie | undefined,
        worker: undefined as Worker | undefined,
        db_filled: false as boolean,
        suggestion: '' as string,
        suggestions: [] as string[],
    }),
    persist: {
        storage: persistedState.localStorage,
    },
    actions: {
        startWorker() {
            if (this.worker === undefined) {
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
            } catch (error) {
                console.debug(error);
                this.db = undefined;
            }
        },
        async getStimulus(stimulusInput: string) {
            if (this.db === undefined || this.db_filled === false) {
                return undefined;
            }
            //@ts-ignore
            const data = await this.db.stimulus_response.get(stimulusInput.toUpperCase());
            if (data?.responses.length > 0) {
                return data?.responses;
            }
            return undefined;
            
          }
    },
});

