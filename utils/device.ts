import Bowser from "bowser";

/**
     * Detects the browser.
     * @returns {Bowser.Parser.Parser} The browser name, version, etc.
     */
export function detectBrowser(): { os: string; browser: string; type: string; } {
        const browser = Bowser.getParser(window.navigator.userAgent);
        return { os: browser.getOSName(), browser: browser.getBrowserName(), type: browser.getPlatformType() };
}

/**
 * Detects if the device has support for AVIF images.
 * @returns {boolean} support of AVIF images.
 * @description tries to decode a base64 AVIF image (black square) and returns true if it was successful.
 */
export function supportsAvif(): boolean {
        const img = new Image();
        img.src = "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAABsAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAABAAAAAQAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACNtZGF0EgAKCRgM/9ggQEDQgDIMGAAKKKKEAACpjlmk";
        return img.decode !== undefined;
}