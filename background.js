let isActive = false;
let isContentInjected = false;

chrome.action.onClicked.addListener((tab) => {
  if (!isContentInjected) {
    // Will inject file into current tabs content. Only do it the first time
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    });
    isContentInjected = true;
  }

  if (isActive) {
    chrome.tabs.sendMessage(tab.id, { command: 'cleanup' });
  } else {
    chrome.tabs.sendMessage(tab.id, { command: 'setup' });
  }

  isActive = !isActive;
});
