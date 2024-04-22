import { defineStore } from 'pinia'

export const useStore = defineStore('application', {
    state: () => ({
        modal: {
            debug: false,
            rate: false,
            survey: false,
        },
    }),
});