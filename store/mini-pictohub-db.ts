import Dexie from 'dexie';
import { MiniPictogram } from './store-types';
import { useOptions } from './option';

export const useMiniPictohubDatabase = defineStore('minipictohub', {
    state: () => ({
        db: undefined as Dexie | undefined,
        worker: undefined as Worker | undefined,
        miniDatabaseInformations: {} as { [key: string]: MiniDatabaseInformations },
    }),
    persist: {
        storage: persistedState.localStorage,
    },
    actions: {
        startWorker() {
            const optionsStore = useOptions();
            if (this.worker === undefined) {
                this.worker = new Worker('/minified-pictohub.worker.js');
            }
            if (this.miniDatabaseInformations[optionsStore.locale] === undefined) {
                this.worker.postMessage({
                    action: 'ingestMiniPictohub',
                    payload: {
                        url: `/minifiedData.${optionsStore.locale}.v1.json`,
                        db_name: `mini-pictohub-${optionsStore.locale}`,
                    },
                });
                this.worker.onmessage = (event) => {
                    // self.postMessage({ status: 'success', message: 'Data fetched and stored in IndexedDB' });
                    if (event.data.status === 'success') {
                        this.miniDatabaseInformations[optionsStore.locale] = {
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
                    pictograms: '++id, keyword, keyword_en' // Define your schema
                });
                await db.open();
                this.db = db;
            } catch (error) {
                console.debug(error);
                this.db = undefined;
            }
        },
        async getMiniPictogram(search: string, locale: string = 'fr', limit: number = 10) {
            const optionsStore = useOptions();
            if (this.db === undefined) {
                return undefined;
            }
            let data: Array<MiniPictogram> = [];
            if (locale == "fr") {
                //TODO Distinguer verbe nom et adjectif
                data = await this.db.table('pictograms').where('keyword').startsWithIgnoreCase(search).toArray();
                if(data.length == 0 || this.checkIfExactMatch(data, search).length == 0) {
                    data = await this.db.table('pictograms').where('keyword').startsWithIgnoreCase(lemmatize(search).join(" ")).toArray();
                    console.debug("[MiniPictohub] No match found, trying lemmatization: ", data, lemmatize(search).join(" "));
                }
            } else if (locale == "en") {
                data = await this.db.table('pictograms').where('keyword_en').startsWithIgnoreCase(search).toArray();
            }
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
                data.sort((a, b) => (a.keyword === search ? -1 : b.keyword === search ? 1 : 0));
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
          },
          checkIfExactMatch(data: Array<MiniPictogram>, search: string): Array<MiniPictogram> {
            return data.filter((picto) => picto.keyword === search);
          },
    },
});
