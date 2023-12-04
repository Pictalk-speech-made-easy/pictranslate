import { ObjectAccessInfo } from "./store-types";

type State = {
    preferredTags: Record<string, ObjectAccessInfo>,
    preferredSearchTerms: Record<string, ObjectAccessInfo>,
    preferredPictograms: Record<string, ObjectAccessInfo>,
};

type StateKey = keyof State;

export const usePreferences = defineStore('preferences', {
    state: (): State => ({
        preferredTags: {},
        preferredSearchTerms: {},
        preferredPictograms: {},
    }),
    persist: {
        storage: persistedState.localStorage,
    },
    actions: {
        accessObject(key: StateKey, objectId: string) {
            const currentTime = Date.now();
            const objectAccessInfo: Record<string, ObjectAccessInfo> = this[key];
            if (objectAccessInfo[objectId]) {
                objectAccessInfo[objectId].count += 1;
                objectAccessInfo[objectId].lastAccessed = currentTime;
            } else {
                objectAccessInfo[objectId] = { count: 1, lastAccessed: currentTime };
            }

            // When reaching 50 entries, remove all least important entries except the last inserted
            if (Object.keys(objectAccessInfo).length >= 50) {
                const entries = Object.entries(objectAccessInfo);
                for (const [key, { count }] of entries) {
                    if (key !== objectId && count <= 1) {
                        delete objectAccessInfo[key];
                    }
                }
            }
        },
        getSortedObjects(key: StateKey): string[] {
            const objectAccessInfo: Record<string, ObjectAccessInfo> = this[key];
            return Object.entries(objectAccessInfo)
                .sort((a, b) => {
                    const [ , accessA ] = a;
                    const [ , accessB ] = b;
                    return accessB.count - accessA.count || accessB.lastAccessed - accessA.lastAccessed;
                })
                .map(([objectId, ]) => objectId);
        },
    },
});