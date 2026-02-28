// Check if the current tab is LinkedIn
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const currentTab = tabs[0];
  const checkboxElement = document.getElementById('checkbox');
  const statusElement = document.getElementById('status');

  if (currentTab.url && currentTab.url.includes('linkedin.com')) {
    // LinkedIn is open - show green checkbox
    checkboxElement.textContent = '☑️';
    checkboxElement.style.color = '#00C853';
    statusElement.textContent = 'You\'re on LinkedIn!';
    statusElement.className = 'status on-linkedin';
  } else {
    // Not on LinkedIn - show empty checkbox
    checkboxElement.textContent = '☐';
    checkboxElement.style.color = '#999';
    statusElement.textContent = 'Navigate to LinkedIn';
    statusElement.className = 'status not-linkedin';
  }
});
