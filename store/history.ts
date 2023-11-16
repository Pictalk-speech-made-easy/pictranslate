import Dexie from 'dexie';
import Fuse from 'fuse.js';
import { History, PictogramPropositions } from './store-types';
export const useHistoryDatabase = defineStore('history', {
    state: () => ({
        db: undefined as Dexie | undefined,
        history: [] as Array<History>,
    }),
    persist: {
        storage: persistedState.localStorage,
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
            //@ts-ignore
            
            // First step: search for exact match
            data = await this.db.history.where('text_input').startsWithIgnoreCase(keyword).toArray();
            if (data?.length > 0) {
                console.log("Exact search result: ", data)
                this.history = data;
                return data;
            }

            // Second step: search for fuzzy match
            data = await this.db.history.toArray();
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
            //@ts-ignore
            let data = await this.db.history.toArray();
            const mostRecent = data.sort((a: History, b: History) => {
                return new Date(b.last_used).getTime() - new Date(a.last_used).getTime();
            }).slice(0, 5);
            const mostUsed = data.sort((a: History, b: History) => {
                return b.times_used - a.times_used;
            }).slice(0, 5);
            
            // Take the 5 most recent and 5 most used
            // be careful to not take the same item twice
            let merged: History[] = [...mostRecent];
            mostUsed.forEach((item: History) => {
                if (!merged.some((mergedItem: History) => mergedItem.text_input === item.text_input)) {
                    merged.push(item);
                } else {
                    const index = merged.findIndex((mergedItem: History) => mergedItem.text_input === item.text_input);
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
            let data: History | undefined;
            let res: History | undefined = await this.db.history.get({text_input: textInput});
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
            //@ts-ignore
            await this.db.history.put(data);
            this.getHistory();
        }
    }
});