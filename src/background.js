chrome.extension.onMessage.addListener(function (message, sender, sendResponse) {
	if (message.request === 'lock-tab') {
		chrome.tabs.update(sender.tab.id, {pinned: true}, function(tab) {
			sendResponse({pinned: tab.pinned});
		});
		return true;
	}
});
