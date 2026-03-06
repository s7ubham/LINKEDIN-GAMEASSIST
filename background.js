// Service Worker for handling file loads
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'loadHTML') {
    fetch(chrome.runtime.getURL(request.filename))
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then(text => sendResponse({ success: true, content: text }))
      .catch(error => {
        console.error(`Extension error loading ${request.filename}:`, error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // Will respond asynchronously
  }
});
