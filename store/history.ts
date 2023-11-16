import Dexie from 'dexie';
export const useHistoryDatabase = defineStore('history', {
    state: () => ({
        db: undefined as Dexie | undefined,
        history: [] as Array<{
            text_input: string,
            pictogramsPropositions: Array<{'selected': number, 'pictograms': Array<any>}>,
            created: Date,
            last_used: Date,
        }>,
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
            //@ts-ignore
            // Use the text_input index to search for the keyword
            const data = await this.db.history.where('text_input').startsWithIgnoreCase(keyword).toArray();
            console.log('searchHistory')
            console.log(data)
            if (data?.length > 0) {
                this.history = data;
                return data;
            }
            return undefined;
        },
        async getHistory() {
            if (this.db === undefined) {
                return undefined;
            }
            //@ts-ignore
            // Need to retrieve the data from the database in ascending order by last_used
            const data = await this.db.history.toArray();
            console.log('getHistory')
            console.log(data)
            this.history = data;
            if (data?.length > 0) {
                return data;
            }
            return undefined;
        },
        async addHistory(textInput: string, pictogramsPropositions: Array<{'selected': number, 'pictograms': Array<any>}>): Promise<any[] | undefined> {
            if (this.db === undefined) {
                return undefined;
            }
            console.log('addHistory')
            console.log(textInput)
            console.log(pictogramsPropositions)
            const data = {
                text_input: textInput,
                pictogramsPropositions: pictogramsPropositions,
                created: new Date(),
                last_used: new Date(),
            };
            //@ts-ignore
            await this.db.history.put(data);
        }
    }
});