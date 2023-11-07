export const useMain = defineStore('main', {
    state: () => ({
        textInput: '' as string,
        pictogramsPropositions: [] as Array<{'selected': number, 'pictograms': Array<any>}>,
        suggestedPictograms: [] as Array<{'selected': number, 'pictograms': Array<any>}>,
    }),
    persist: {
        storage: persistedState.localStorage,
    },
    actions: {
    },
});

