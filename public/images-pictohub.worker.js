console.debug('Worker started')
importScripts('https://npmcdn.com/dexie@3.2.4/dist/dexie.min.js');

const chunkSize = 100; // Adjust this number based on what works reliably

function cacheInChunks(urls, cache) {
    const chunk = urls.splice(0, chunkSize);
    cache.addAll(chunk).then(() => {
        if (urls.length > 0) {
            cacheInChunks(urls, cache); // Recursively cache the next chunk
        } else {
            console.log('All images cached successfully');
        }
    }).catch(error => {
        console.error('Error caching images:', error);
    });
}

self.addEventListener('message', async (e) => {
    const { action, payload } = e.data;
    if (action !== 'ingestMiniPictohubImages') return;

    const format = payload.format; // URL received from the main script
    const db_name = payload.db_name; // Database name received from the main script
    try {
        if (!format) throw new Error('Format not provided');
        if (!db_name) throw new Error('Database name not provided');
        console.debug('Format: ' + format);
        console.debug('Database name: ' + db_name);
        const db = await openDB(db_name); // Open IndexedDB using Dexie
        // Get all objects
        const pictograms = await db.table('pictograms').toArray();
        let urls = pictograms.map(pictogram => {
            return pictogram.external_alt_image
        });
        urls = [...new Set(urls)];
        caches.open(`images-pictohub`).then(cache => {
            cacheInChunks(urls, cache);
        })
        console.debug('Cache is populated');
        self.postMessage({ status: 'success', message: 'Images fetched and stored in IndexedDB' });
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
        pictograms: '++id, word, word_en' // Define your schema
    });

    return db;
}
