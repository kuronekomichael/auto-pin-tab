chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	console.assert(message.request === 'lock-tab');

	// ロック対象のURL(本当はoptionsから設定したものにしたい)
	var targets = [
		'https://i.doit.im/home',
		'https://mail.google.com/mail',
		'https://www.facebook.com/',
		'https://web.tweetdeck.com/'
	];

	var isTarget = targets.some(function(url) {
		if (new RegExp(url).test(message.url)) {
			targetUrl = url;
			return true;
		} else {
			return false;
		}
	});

	if (!isTarget) {
		sendResponse({pinned: false});
		return;
	}

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

});
