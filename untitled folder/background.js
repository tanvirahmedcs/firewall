let isBlockingEnabled = true;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "toggleBlocking") {
    isBlockingEnabled = message.enabled;
    sendResponse({ status: isBlockingEnabled ? "Blocking Enabled" : "Blocking Disabled" });
  }
});

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    if (!isBlockingEnabled) return;

    const blockedKeywords = ["ads", "adult", "porn", "xxx", "malware", "phishing", "gambling", "vpn", "proxy", "unblock", "sex", "escort", "camgirl", "onlyfans", "torrent", "piracy"];
    const blockedSites = [
      "example.com", "badwebsite.com", "malicious-site.com",
      "youtube.com", "facebook.com", "instagram.com", "tiktok.com", "twitter.com",
      "pornhub.com", "xvideos.com", "redtube.com", "adservice.google.com", "doubleclick.net",
      "vpnbook.com", "hidemyass.com", "proxysite.com", "kproxy.com", "unblocksite.com",
      "camgirl.com", "onlyfans.com", "escortservice.com", "torrentz.com", "thepiratebay.org"
    ];

    const url = new URL(details.url);

    // Block based on hostname or URL containing blocked keywords
    if (blockedSites.includes(url.hostname) || blockedKeywords.some(keyword => url.href.toLowerCase().includes(keyword))) {
      return { cancel: true };
    }

    // Additional logic for social media platforms
    if (url.hostname.includes("youtube.com") && url.href.includes("ad")) {
      return { cancel: true };
    }
    if (url.hostname.includes("facebook.com") && url.href.includes("sponsored")) {
      return { cancel: true };
    }
    if (url.hostname.includes("instagram.com") && url.href.includes("ad")) {
      return { cancel: true };
    }

    // Fallback: Block any suspicious domains
    const suspiciousPatterns = [/\.onion$/, /\.ru$/, /\.cn$/, /\.to$/, /\.biz$/, /\.info$/];
    if (suspiciousPatterns.some(pattern => pattern.test(url.hostname))) {
      return { cancel: true };
    }

    // Block URLs with specific query parameters or paths
    const blockedPaths = ["/ads", "/sponsored", "/track", "/redirect", "/click" ];
    if (blockedPaths.some(path => url.pathname.includes(path))) {
      return { cancel: true };
    }
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);