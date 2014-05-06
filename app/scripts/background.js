'use strict';

function initStorage() {
    if (localStorage.targetUrls === undefined) {
        localStorage.targetUrls = [
            'https://www.facebook.com/',
            'https://mail.google.com/mail',
            'https://web.tweetdeck.com/',
            'https://i.doit.im/home'
        ];
    }
}

initStorage();

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	console.assert(message.request === 'lock-tab');

	var targets = localStorage.targetUrls.split(',');

	var isTarget = targets.some(function(url) {
		return (new RegExp(url).test(message.url));
	});

	if (!isTarget) {
		sendResponse({pinned: false});
		return;
	}

	chrome.tabs.query({}, function(tabs) {
		var duplicates = 0;
		tabs.forEach(function(tab) {
			if (new RegExp(message.url).test(tab.url)) {
                duplicates++;
            }
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

});
