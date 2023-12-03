export function checkAvifSupport() {
    return new Promise((resolve) => {
        const avifImage = new Image();

        avifImage.onload = () => {
            resolve(true); // AVIF is supported
        };

        avifImage.onerror = () => {
            resolve(false); // AVIF is not supported
        };

        // This is a tiny 1x1 AVIF image encoded as a data URL
        avifImage.src = '/compatibility-avif.avif'; // Replace with a valid AVIF data URL
    });
}