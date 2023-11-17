console.debug('Worker started')
importScripts('https://npmcdn.com/dexie@3.2.4/dist/dexie.min.js');
importScripts('https://unpkg.com/pako@2.1.0/dist/pako_inflate.min.js');
const EXPECTED_ENTRY_COUNT = 8211;

/**
 * @description This worker is used to populate the IndexedDB with the stimulus-response data
 * @description The data is stored in a GZIP file in the /public folder
 * @description If the IndexedDB is already populated, it will not download the file again 
 */
self.addEventListener('message', async (e) => {
    const { action, payload } = e.data;
    if (action !== 'populateStimulusDatabase') return;
    const db = await initialize_indexeddb();
    const entry_count = await db.stimulus_response.count();
    console.debug(`[Worker] IndexedDB entry count: ${entry_count}`)
    if (db && entry_count === EXPECTED_ENTRY_COUNT) {
        self.postMessage({ action: 'populateStimulusDatabase', success: true });
    }
    else {
        try {
            console.debug('[Worker] Starting download process')
            const data_json = await download_latest_datafile_version();
            save_data_to_indexeddb(db, data_json);
            console.debug(`[Worker] Save data is a success`)
            self.postMessage({ action: 'populateStimulusDatabase', success: true });
        } catch (error) {
            console.debug(error)
        }
    }
});

const initialize_indexeddb = async () => {
    try {
        const db = new Dexie("eat-stimulus-response")
        db.version(1).stores({
            stimulus_response: "++stimulus"
        })
        return db
    } catch (error) {
        console.debug(error)
    }

}

const save_data_to_indexeddb = async (db, data) => {
    // Parse the JSON data
    data["eat-stimulus-response"].forEach((stimulus) => {
        db.stimulus_response.add({
            stimulus: stimulus.word,
            responses: stimulus.responses
        });
    });
}

/**
 * Download the latest datafile version
 * @description The file is an XML stored in the /public folder, it is GZIP compressed and we need to unzip it
 * @returns {Promise<JSON>} The JSON data
 */
const download_latest_datafile_version = async () => {
    const response = await fetch("/output.json");
    console.debug(`[Worker] Downloaded file ${response} output.json`)
    return response.json();
}