import Dexie from 'dexie';
import Fuse from 'fuse.js';
import { HistoryItem, PictogramPropositions } from './store-types';
export const useHistoryDatabase = defineStore('history', {
    state: () => ({
        db: undefined as Dexie | undefined,
        history: [] as Array<HistoryItem>,
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
        async initialize_database() {
            try {
                const db = new Dexie('history');
                db.version(1).stores({
                    history: '++text_input, created, last_used',
                });
                await db.open();
                this.db = db;
            } catch (error) {
                console.debug(error);
                this.db = undefined;
            }
        },
        async searchHistory(keyword: string) {
            if (this.db === undefined) {
                return undefined;
            }
            let data: Array<History> = [];
            // First step: search for exact match
            data = await this.db.table('history').where('text_input').startsWithIgnoreCase(keyword).toArray();
            if (data?.length > 0) {
                console.log("Exact search result: ", data)
                this.history = data;
                return data;
            }
            // Second step: search for fuzzy match
            data = await this.db.table('history').toArray();
            const options = {
                keys: ['text_input'],
                includeScore: true,
                threshold: 0.3 // Adjust this as needed
            };
            const fuse = new Fuse(data, options);
            const result = fuse.search(keyword);
            if (result.length > 0) {
                console.log("Fuzzy search result: ", result);
                this.history = result.map(item => item.item);
                return this.history;
            }
            return undefined;
        },
        async getHistory() {
            if (this.db === undefined) {
                return undefined;
            }
            let data = await this.db.table('history').toArray();
            const mostRecent = data.sort((a: HistoryItem, b: HistoryItem) => {
                return new Date(b.last_used).getTime() - new Date(a.last_used).getTime();
            }).slice(0, 5);
            const mostUsed = data.sort((a: HistoryItem, b: HistoryItem) => {
                return b.times_used - a.times_used;
            }).slice(0, 5);
            // Take the 5 most recent and 5 most used
            // be careful to not take the same item twice
            let merged: HistoryItem[] = [...mostRecent];
            mostUsed.forEach((item: HistoryItem) => {
                if (!merged.some((mergedItem: HistoryItem) => mergedItem.text_input === item.text_input)) {
                    merged.push(item);
                } else {
                    const index = merged.findIndex((mergedItem: HistoryItem) => mergedItem.text_input === item.text_input);
                    // Put the most used item at the top of the list
                    merged.splice(index, 1);
                    merged.unshift(item);
                }
            });
            console.log("Merged history: ", merged)
            this.history = merged;
            if (data?.length > 0) {
                return data;
            }
            return undefined;
        },
        async addHistory(textInput: string, pictogramsPropositions: Array<PictogramPropositions>): Promise<any[] | undefined> {
            if (this.db === undefined) {
                return undefined;
            }
            let data: HistoryItem | undefined;
            let res: HistoryItem | undefined = await this.db.table('history').get({ text_input: textInput });
            if (res !== undefined) {
                data = {
                    text_input: textInput,
                    pictogramsPropositions: pictogramsPropositions,
                    created: res.created,
                    last_used: new Date(),
                    times_used: res.times_used + 1,
                };
            } else {
                data = {
                    text_input: textInput,
                    pictogramsPropositions: pictogramsPropositions,
                    created: new Date(),
                    last_used: new Date(),
                    times_used: 1,
                };
            }
            await this.db.table('history').put(data);
            this.getHistory();
        },
    }
});