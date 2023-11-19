import Dexie from 'dexie';
import { MiniPictogram } from './store-types';
import { useOptions } from './option';

export const useMiniPictohubDatabase = defineStore('minipictohub', {
    state: () => ({
        db: undefined as Dexie | undefined,
        worker: undefined as Worker | undefined,
    }),
    persist: {
        storage: persistedState.localStorage,
    },
    actions: {
        startWorker() {
            const optionsStore = useOptions();
            if (this.worker === undefined) {
                this.worker = new Worker('/minified-pictohub.worker.js');
                this.worker.postMessage({
                    action: 'ingestMiniPictohub',
                    payload: {
                        url: '/minifiedData.v1.json',
                        db_name: `mini-pictohub-${optionsStore.locale}`,
                    },
                });
            }
        },
        stopWorker() {
            if (this.worker !== undefined) {
                this.worker.terminate();
                this.worker = undefined;
            }
        },
        async initialize_database() {
            const optionsStore = useOptions();
            try {
                const db = new Dexie(`mini-pictohub-${optionsStore.locale}`);
                db.version(1).stores({
                    pictograms: 'keyword' // Define your schema
                });
                await db.open();
                this.db = db;
            } catch (error) {
                console.debug(error);
                this.db = undefined;
            }
        },
        async getMiniPictogram(search: string) {
            const optionsStore = useOptions();
            if (this.db === undefined) {
                return undefined;
            }
            let data: Array<MiniPictogram> = [];
            data = await this.db.table('pictograms').where('keyword').startsWithIgnoreCase(search).toArray();
            if (data?.length > 0) {
                if (optionsStore.sexFilter) {
                    data = data.filter((picto) => picto.sex === false)
                }
                if (optionsStore.violenceFilter) {
                    data = data.filter((picto) => picto.violence === false)
                }
                return data;
            }
            return undefined;
          }
    },
});
