function formatMemoryUsage(memory) {
    const formatBytes = (bytes, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    return {
        totalJSHeapSize: formatBytes(memory.totalJSHeapSize),
        usedJSHeapSize: formatBytes(memory.usedJSHeapSize),
        jsHeapSizeLimit: formatBytes(memory.jsHeapSizeLimit)
    };
}

function updateMemoryUsage() {
    chrome.runtime.sendMessage({ type: 'getMemoryUsage' }, (response) => {
        if (response && response.memory) {
            const memoryUsage = formatMemoryUsage(response.memory);
            document.getElementById('totalJSHeapSize').innerText = memoryUsage.totalJSHeapSize;
            document.getElementById('usedJSHeapSize').innerText = memoryUsage.usedJSHeapSize;
            document.getElementById('jsHeapSizeLimit').innerText = memoryUsage.jsHeapSizeLimit;
        } else {
            document.getElementById('memory-usage').innerText = 'Unable to retrieve memory usage.';
        }
    });
}

// Update memory usage every 2 seconds
setInterval(updateMemoryUsage, 500);

// Initial call to display memory usage immediately on load
updateMemoryUsage();