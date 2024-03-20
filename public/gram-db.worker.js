console.debug('Worker started')
importScripts('https://npmcdn.com/dexie@3.2.4/dist/dexie.min.js');
const EXPECTED_ENTRY_COUNT = 8000;

 
self.addEventListener('message', async (e) => {
    const { action, payload } = e.data;
    if (action !== 'populateGramDatabase') return;
    const db = await initialize_indexeddb();
    const entry_count = await db.gram_response.count();
    console.debug(`[Worker] IndexedDB entry count: ${entry_count}`)
    if (db && entry_count === EXPECTED_ENTRY_COUNT) {
        self.postMessage({ action: 'populateGramDatabase', success: true });
    }
    else {
        try {
            console.debug('[Worker] Starting download process')
            const data_json = await download_latest_datafile_version();
            save_data_to_indexeddb(db, data_json);
            console.debug(`[Worker] Save data is a success`)
            self.postMessage({ action: 'populateGramDatabase', success: true });
        } catch (error) {
            console.debug(error)
        }
    }
});

const initialize_indexeddb = async () => {
    try {
        const db = new Dexie("gram-response")
        db.version(1).stores({
            gram_response: "++gram"
        })
        return db
    } catch (error) {
        console.debug(error)
    }

}

const save_data_to_indexeddb = async (db, data) => {
    // Parse the JSON data
    data["gram-response"].forEach((gram) => {
        db.gram_response.add({
            gram: gram.word,
            responses: gram.responses
        });
    });
}

 
const download_latest_datafile_version = async () => {
    const response = await fetch("/output.reduced.json");
    console.debug(`[Worker] Downloaded file ${response} output.reduced.json`)
    return response.json();
}