export function detectBrowser(userAgent: string) {
    // Detect Chrome
    let chromeAgent =
    userAgent.indexOf("Chrome") > -1;
    // Detect Internet Explorer
    let IExplorerAgent =
    userAgent.indexOf("MSIE") > -1;
    // Detect Firefox
    let firefoxAgent =
    userAgent.indexOf("Firefox") > -1;

    // Detect Safari
    let safariAgent =
    userAgent.indexOf("Safari") > -1;

    // Discard Safari since it also matches Chrome
    if ((chromeAgent) && (safariAgent))
      safariAgent = false;

    // Detect Opera
    let operaAgent =
    userAgent.indexOf("OP") > -1;

    // Discard Chrome since it also matches Opera     
    if ((chromeAgent) && (operaAgent))
      chromeAgent = false;

    if (chromeAgent) { return "Chrome" }
    if (IExplorerAgent) { return "IE" }
    if (firefoxAgent) { return "Firefox" }
    if (safariAgent) { return "Safari" }
    if (operaAgent) { return "Opera" }
}
