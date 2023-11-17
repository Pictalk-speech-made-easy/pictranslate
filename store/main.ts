import { PictogramPropositions } from "./store-types";

export const useMain = defineStore('main', {
    state: () => ({
        textInput: '' as string,
        pictogramsPropositions: [] as Array<PictogramPropositions>,
        suggestedPictograms: [] as Array<PictogramPropositions>,
    }),
    persist: {
        storage: persistedState.localStorage,
    },
    actions: {
    },
});

