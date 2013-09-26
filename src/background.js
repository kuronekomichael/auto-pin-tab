
chrome.extension.onMessage.addListener(function (message, sender, sendResponse) {
	if (message.request === 'lock-tab') {

		chrome.tabs.query({}, function(tabs) {
			var duplicates = 0;
			tabs.forEach(function(tab) {
				if (new RegExp(message.url).test(tab.url)) duplicates++;
			});

			if (duplicates >= 2) {
				sendResponse({pinned: false});
				return;
			}

			chrome.tabs.update(sender.tab.id, {pinned: true}, function(tab) {
				sendResponse({pinned: tab.pinned});
			});
		});
		return true;
	}
});
