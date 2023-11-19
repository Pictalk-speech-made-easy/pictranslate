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
            if (this.worker === undefined && optionsStore.miniDatabaseInformations === undefined) {
                this.worker = new Worker('/minified-pictohub.worker.js');
                this.worker.postMessage({
                    action: 'ingestMiniPictohub',
                    payload: {
                        url: '/minifiedData.v1.json',
                        db_name: `mini-pictohub-${optionsStore.locale}`,
                    },
                });
                this.worker.onmessage = (event) => {
                    // self.postMessage({ status: 'success', message: 'Data fetched and stored in IndexedDB' });
                    if (event.data.status === 'success') {
                        optionsStore.miniDatabaseInformations = {
                            url: '/minifiedData.v1.json',
                            db_name: `mini-pictohub-${optionsStore.locale}`,
                            date_created: new Date(),
                        };
                        }
                    }
            } else {
                console.debug('MiniDatabase has already been fully ingested');
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
                    pictograms: '++id, keyword, plural' // Define your schema
                });
                await db.open();
                this.db = db;
            } catch (error) {
                console.debug(error);
                this.db = undefined;
            }
        },
        async getMiniPictogram(search: string, limit: number = 10) {
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
                // Be carefull to not return objects with the same external_alt_image
                data = this.removeDuplicates(data);
                // Order the result by exact match first
                console.log("getMiniPictogram")
                console.log(data);
                data.sort((a, b) => (a.keyword === search ? -1 : b.keyword === search ? 1 : 0));
                console.log(data);
                data = data.slice(0, limit);
                return data;
            }
            return undefined;
          },
          removeDuplicates(data: Array<MiniPictogram>): Array<MiniPictogram> {
            return data.filter((picto, index, self) =>
              index === self.findIndex((t) => (
                t.external_alt_image === picto.external_alt_image
              ))
            )
          }
    },
});
