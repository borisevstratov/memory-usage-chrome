chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'getMemoryUsage') {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
                const tabId = tabs[0].id;
                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    func: () => {
                        // Check if the memory API is supported
                        if (window.performance && window.performance.memory) {
                            return {
                                totalJSHeapSize: window.performance.memory.totalJSHeapSize,
                                usedJSHeapSize: window.performance.memory.usedJSHeapSize,
                                jsHeapSizeLimit: window.performance.memory.jsHeapSizeLimit
                            };
                        } else {
                            return null;
                        }
                    }
                }, (results) => {
                    if (results && results[0] && results[0].result) {
                        sendResponse({ memory: results[0].result });
                    } else {
                        sendResponse({ memory: null });
                    }
                });
            } else {
                sendResponse({ memory: null });
            }
        });
        return true; // Indicate that the response is sent asynchronously
    }
});