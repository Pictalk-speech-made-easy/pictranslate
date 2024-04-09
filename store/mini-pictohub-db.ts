import Dexie from 'dexie';
import { BundleInformations, MiniPictogram } from './store-types';
import { useOptions } from './option';
import { checkAvifSupport } from '../utils/browser-support';
export const useMiniPictohubDatabase = defineStore('minipictohub', {
    state: () => ({
        db: undefined as Dexie | undefined,
        worker: undefined as Worker | undefined,
        imagesWorker: undefined as Worker | undefined,
        miniDatabaseInformations: {} as { [key: string]: MiniDatabaseInformations },
        bundleInformations: [] as Array<Bundle>,
        bundleSizes: {} as Record<string, number>,
        format: '' as 'avif' | 'png',
    }),
    persist: {
        storage: persistedState.localStorage,
        serializer: {
            serialize: (state) => {
                // Create a copy of the state excluding the 'db' property
                const { db, worker, imagesWorker, ...stateWithoutDb } = state;
                return JSON.stringify(stateWithoutDb);
            },
            deserialize: JSON.parse
        }
    },
    actions: {
        async deleteDatabase() {
            const optionsStore = useOptions();
            const db = new Dexie(`mini-pictohub-${optionsStore.locale}`);
            await db.delete();
            this.miniDatabaseInformations = {};
        },
        async startImagesWorker(tag: string) {
            const config = useRuntimeConfig();
            if (this.imagesWorker === undefined) {
                this.imagesWorker = new Worker('/inflate-pictohub.worker.js');
            }
            // Check how many storage space is left
            const quota = await navigator.storage.estimate();
            if (quota.quota === undefined || quota.usage === undefined) {
                console.debug("Storage quota is not available");
                return;
            }
            console.debug(`Storage quota: ${quota.usage} / ${quota.quota}`);
            
            // Check if the app is running in PWA mode
            if (!useNuxtApp().$pwa?.isInstalled && process.env.NODE_ENV !== 'development') {
                console.debug("App is not running in PWA mode, not storing images for tag: ", tag);
                return;
            }
            
            if (quota.quota - quota.usage < this.bundleSizes[tag]*1000000) {
                console.debug("Not enough storage space left, not storing the images for tag: ", tag);
                return;
            }
            console.debug("Worker status is: ", this.imagesWorker);
            this.imagesWorker.postMessage({
                action: 'ingestMiniPictohubImages',
                payload: {
                    format: this.format,
                    zipUrl: `${config.public.pictohub.PICTOHUB_TAGS_URL}/${tag}/${this.format}.zip`,
                    tag: tag,
                },
            });
            this.imagesWorker.onmessage = async (event) => {
                if( event.data.status !== 'success') {
                    return;
                }
                if (this.bundleInformations.find((pack) => pack.tag === event.data.payload.tag)) {
                    return;
                }
                this.bundleInformations.push({
                    name: `${event.data.payload.tag}.${this.format}.zip`,
                    url: `${config.public.pictohub.PICTOHUB_TAGS_URL}/${event.data.payload.tag}/${this.format}.zip`,
                    tag: event.data.payload.tag,
                    type: this.format,
                    date_created: new Date(),
                });
            }
        },
        async startWorker() {
            const config = useRuntimeConfig();
            const optionsStore = useOptions();
            if (this.worker === undefined) {
                this.worker = new Worker('/minified-pictohub.worker.js');
            }
            if (this.miniDatabaseInformations[optionsStore.locale] === undefined) {
                this.worker.postMessage({
                    action: 'ingestMiniPictohub',
                    payload: {
                        url: `${config.public.pictohub.PICTOHUB_DB_URL}/minifiedData.${optionsStore.locale}.v1.json`,
                        db_name: `mini-pictohub-${optionsStore.locale}`,
                        format: this.format
                    },
                });
                this.worker.onmessage = async (event) => {
                    // self.postMessage({ status: 'success', message: 'Data fetched and stored in IndexedDB' });
                    if (event.data.status === 'success') {
                        this.miniDatabaseInformations[optionsStore.locale] = {
                            url: `${config.public.pictohub.PICTOHUB_DB_URL}/minifiedData.v1.json`,
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
                this.format = await checkAvifSupport() ? 'avif' : 'png';
                this.getBundleSizes(this.format);
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
                if (locale == "fr") {
                    data.sort((a, b) => (a.keyword === search ? -1 : b.keyword === search ? 1 : 0));
                    data.sort((a, b) => (a.tags.includes("core vocabulary") && a.keyword === search ? -1 : b.tags.includes("core vocabulary") && b.keyword === search ? 1 : 0));
                } else if (locale == "en") {
                    data.sort((a, b) => (a.keyword_en === search ? -1 : b.keyword_en === search ? 1 : 0));
                    data.sort((a, b) => (a.tags.includes("core vocabulary") && a.keyword_en === search ? -1 : b.tags.includes("core vocabulary") && b.keyword_en === search ? 1 : 0));
                }
                // If multiple elements have an exact match, put the ones with that containt the tags ""core vocabulary" first
                data = data.slice(0, limit);
                if (data.length > 0) {
                    usePreferences().accessObject("preferredTags",data[0].tags[0]);
                    // Extract the ID of the pictogram from the external_alt_image
                    // https://images.pictohub.org/1111?preferred_format=avif
                    const pictogramId = data[0].external_alt_image.match(/\/(\d+)\?preferredformat/)?.[1];
                    usePreferences().accessObject("preferredPictograms",pictogramId!);
                }
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
          async getBundleSizes(format: string) {
            const config = useRuntimeConfig();
            let response = await fetch(`${config.public.pictohub.PICTOHUB_TAGS_URL}/sizes.${format}.txt`);
            let data = await response.text();
            /*
            urban_area 1 
            music 1 
            */
            const lines = data.split('\n');
            const sizes: Record<string, number> = {};
            for (const line of lines) {
                const [tag, size] = line.split(' ');
                sizes[tag] = parseInt(size);
            }
            this.bundleSizes = sizes;
            return sizes;
        }
    },
});
