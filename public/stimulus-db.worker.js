console.log('Worker started')

importScripts('https://npmcdn.com/dexie@3.2.4/dist/dexie.min.js');
importScripts('https://unpkg.com/pako@2.1.0/dist/pako_inflate.min.js');

self.addEventListener('message', async (e) => {
    const { action, payload } = e.data;
    if (action === 'populateStimulusDatabase') {
        let db = await initialize_indexeddb();
        if (db && await db.stimulus_response.count() === 0) {
            // Download the GZIP file
            // Unzip the GZIP file
            try {
            console.debug('[Worker] Starting download process')
            let data_json;
            if (true) { // No need to manually gzip the data, nitro server and fetch does it for us
                data_json = await download_latest_datafile_version();
            } else {
                const data = await download_latest_datafile_version_gzipped();
                console.debug('[Worker] File downloaded')
                data_json = await unzip_gzip_to_json(data);
                console.debug(`[Worker] output.json.gz converted to JSON`)
            }
            save_data_to_indexeddb(db, data_json);
            console.debug(`[Worker] Save data is a success`)
            // Post message to the main thread
            self.postMessage({ action: 'populateStimulusDatabase', success: true });
            } catch (error) {
                console.log(error)
            }
        } else {
            self.postMessage({ action: 'populateStimulusDatabase', success: true });
        }
    }
});

const initialize_indexeddb = async () => {
    try{
        const db = new Dexie("eat-stimulus-response")
    db.version(1).stores({
        stimulus_response: "++stimulus"
    })
    return db
    } catch (error) {
        console.log(error)
    }
    
}

const unzip_gzip_to_json = async (data) => {
    // Returns a Uint8Array
    const inflatedData = await pako.inflate(data, { to: 'string' });
    console.debug(`[Worker] Unziped output.json.gz and converted to string of size ${inflatedData.length} bytes`)
    return JSON.parse(inflatedData);
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

const download_latest_datafile_version_gzipped = async () => {
    // The file is stored in the /public folder
    // The file is a XML file containing the data
    const response = await fetch("/output.json.gz");
    console.debug(`[Worker] Downloaded file ${response} output.2.json.gz`)
    // The file is GZIP compressed
    // We need to unzip it
    return response.arrayBuffer();
}

const download_latest_datafile_version = async () => {
    // The file is stored in the /public folder
    // The file is a XML file containing the data
    const response = await fetch("/output.json");
    console.debug(`[Worker] Downloaded file ${response} output.json`)
    // The file is GZIP compressed
    // We need to unzip it
    return response.json();
}