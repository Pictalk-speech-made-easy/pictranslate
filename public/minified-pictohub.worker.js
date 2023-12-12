console.debug('Worker started')
importScripts('https://npmcdn.com/dexie@3.2.4/dist/dexie.min.js');
self.addEventListener('message', async (e) => {
    const { action, payload } = e.data;
    if (action !== 'ingestMiniPictohub') return;

    const url = payload.url; // URL received from the main script
    const db_name = payload.db_name; // Database name received from the main script
    const format = payload.format; // URL received from the main script
    try {
        if (!format) throw new Error('Format not provided');
        if (!url) throw new Error('URL not provided');
        if (!db_name) throw new Error('Database name not provided');
        console.debug('URL: ' + url);
        console.debug('Database name: ' + db_name);
        console.debug('Fetching data from ' + url);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        console.debug('Data fetched from ' + url);
        let data = await response.json();

        // Iterate over the data and modify the external_alt_image property
        // to point to the images.pictohub.org domain
        data = data.map(pictogram => {
            const id = pictogram.external_alt_image.split('/').pop();
            pictogram.external_alt_image = `https://images.pictohub.org/${id}?preferredformat=${format}`
            return pictogram;
        });

        const db = await openDB(db_name); // Open IndexedDB using Dexie
        console.debug('Data received, db opened');
        await db.pictograms.bulkAdd(data); // Bulk add data
        self.postMessage({ status: 'success', message: 'Data fetched and stored in IndexedDB' });
        console.debug('Data stored in IndexedDB');
    } catch (error) {
        self.postMessage({ status: 'error', message: error.message });
        console.error(error);
    }
});

// Function to initialize Dexie database
function openDB(db_name) {
    const db = new Dexie(db_name);

    db.version(1).stores({
        pictograms: '++id, keyword, keyword_en' // Define your schema
    });

    return db;
}
