import Dexie from 'dexie';
import type { BundleInformations, MiniPictogram } from './store-types';
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
        getImage(images: Image[], selectedImage: number | undefined) {
            // Check if this.format is in the image formats
            if (selectedImage !== undefined) {
                return images[selectedImage].url;
            }

            const preferredSourceImages = images.filter((image) => image.source == useOptions().preferredSources);
            if (preferredSourceImages.length === 0) {
                // Return the first arasaac image
                return images.filter((image) => image.source == "arasaac")[0].url;
            }
            return preferredSourceImages[0].url;
        },
        async deleteDatabase() {
            const optionsStore = useOptions();
            const db = new Dexie(`mini-pictohub-${optionsStore.locale}`);
            await db.delete();
            this.miniDatabaseInformations = {};
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
                        url: `${config.public.pictohub.PICTOHUB_DB_URL}/local-db/${optionsStore.locale}/cace.${optionsStore.locale}.json`,
                        db_name: `mini-pictohub-${optionsStore.locale}`,
                        format: this.format
                    },
                });
                this.worker.onmessage = async (event) => {
                    // self.postMessage({ status: 'success', message: 'Data fetched and stored in IndexedDB' });
                    if (event.data.status === 'success') {
                        this.miniDatabaseInformations[optionsStore.locale] = {
                            url: `${config.public.pictohub.PICTOHUB_DB_URL}/local-db/${optionsStore.locale}/cace.json`,
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
                    pictograms: '++id, word, word_en' // Define your schema
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
                data = await this.db.table('pictograms').where('word').startsWithIgnoreCase(search).toArray();
                if(data.length == 0 || this.checkIfExactMatch(data, search).length == 0) {
                    data = await this.db.table('pictograms').where('word').startsWithIgnoreCase(lemmatize(search).join(" ")).toArray();
                    console.debug("[MiniPictohub] No match found, trying lemmatization: ", data, lemmatize(search).join(" "));
                }
            } else if (locale == "en") {
                data = await this.db.table('pictograms').where('word_en').startsWithIgnoreCase(search).toArray();
            }
            if (data?.length > 0) {
                if (optionsStore.sexFilter) {
                    data = data.filter((picto) => picto.filters.sex === false)
                }
                if (optionsStore.violenceFilter) {
                    data = data.filter((picto) => picto.filters.violence === false)
                }
                // Be carefull to not return objects with the same external_alt_image
                data = this.removeDuplicates(data);
                // Order the result by exact match first
                if (locale == "fr") {
                    data.sort((a, b) => (a.word === search ? -1 : b.word === search ? 1 : 0));
                    data.sort((a, b) => (a.tags.includes("core vocabulary") && a.word === search ? -1 : b.tags.includes("core vocabulary") && b.word === search ? 1 : 0));
                } else if (locale == "en") {
                    data.sort((a, b) => (a.word_en === search ? -1 : b.word_en === search ? 1 : 0));
                    data.sort((a, b) => (a.tags.includes("core vocabulary") && a.word_en === search ? -1 : b.tags.includes("core vocabulary") && b.word_en === search ? 1 : 0));
                }
                // If multiple elements have an exact match, put the ones with that containt the tags ""core vocabulary" first
                data = data.slice(0, limit);
                if (data.length > 0) {
                    usePreferences().accessObject("preferredTags",data[0].tags[0]);
                    // Extract the ID of the pictogram from the external_alt_image
                    // https://images.pictohub.org/1111?preferred_format=avif
                    usePreferences().accessObject("preferredPictograms",data[0].word!);
                }
                return data;
            }
            return undefined;
          },
          async addMiniPictogram(data: MiniPictogram): Promise<void> {
            if (this.db === undefined) {
              return;
            }
            await this.db.table('pictograms').add(data);
            return;
          },
          removeDuplicates(data: Array<MiniPictogram>): Array<MiniPictogram> {
            return data.filter((picto, index, self) =>
              index === self.findIndex((t) => (
                t._id === picto._id
              ))
            )
          },
          checkIfExactMatch(data: Array<MiniPictogram>, search: string): Array<MiniPictogram> {
            return data.filter((picto) => picto.word === search);
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
