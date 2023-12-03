
console.debug('Worker started');
importScripts('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.6.0/jszip.min.js');

async function fetchAndUnzip(zipUrl) {
    const response = await fetch(zipUrl);
    const zipBlob = await response.blob();
    const zip = await JSZip.loadAsync(zipBlob);
    return zip;
}
self.addEventListener('message', async (e) => {
    const { action, payload } = e.data;
    if (action !== 'ingestMiniPictohubImages') return;
    const zipUrl = payload.zipUrl;
    const format = payload.format; // e.g., 'avif', 'png'
    try {
        if (!zipUrl) throw new Error('GZIP URL not provided');
        if (!format) throw new Error('format not provided');
        console.debug('GZIP URL: ' + zipUrl);

        const start = Date.now();
        const zip = await fetchAndUnzip(zipUrl);
        caches.open(`images-pictohub`).then(async cache => {
            for (const [filename, zipEntry] of Object.entries(zip.files)) {
                if (!zipEntry.dir) {
                    const blob = await zipEntry.async('blob');
                    const id = filename.split('/').pop().split('.')[0];
                    const imageUrl = `https://images.pictohub.org/${id}?preferredformat=${format}`;
                    const response = new Response(blob, { headers: { 'Content-Type': 'image/' + format, 'Content-Length': blob.size } });
                    const request = new Request(imageUrl);
                    cache.put(request, response);
                }
            }
        });
        const end = Date.now();
        const timeDifferenceInSeconds = (end - start) / 1000;
        console.log('Time difference in seconds:', timeDifferenceInSeconds);
        console.debug('Cache is populated');
        self.postMessage({ status: 'success', message: 'Images cached successfully' });
    } catch (error) {
        self.postMessage({ status: 'error', message: error.message });
        console.error(error);
    }
});
