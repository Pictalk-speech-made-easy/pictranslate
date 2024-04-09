console.debug('Worker G started')
importScripts('https://npmcdn.com/dexie@3.2.4/dist/dexie.min.js');

self.addEventListener('message', async (e) => {
    const { action, payload } = e.data;
    if (action !== 'populateGramDatabase') return;
    const db = await initialize_indexeddb();
    const entry_count = await db.gram_response.count();
    console.debug(`[Worker Gram] IndexedDB entry count: ${entry_count}`)

    try {
        console.debug('[Worker Gram] Starting download process')
        const data_json = await download_latest_datafile_version();
        save_data_to_indexeddb(db, data_json);
        console.debug(`[Worker Gram] Save data is a success`)
        self.postMessage({ action: 'populateGramDatabase', success: true });
    } catch (error) {
        console.debug(error)
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
    // console.log('data', data[0])
    // const jdata = JSON.parse(data[0]);
    // console.log('jdata', jdata );
    const List = data.map(item => ({
        gram: item[0].toUpperCase(),
        predictions: item[1]
    }));
    db.gram_response.bulkPut(List)
}


const download_latest_datafile_version = async () => {
    const response = await fetch("/output.gram.json");
    console.debug(`[Worker gram] Downloaded file ${response} output.gram.json`)
    return response.json();
}