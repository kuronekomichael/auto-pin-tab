'use strict';

chrome.runtime.sendMessage({ request: 'auto-pin-tab', url: location.href}, function (response) {
	if (!response.pinned) {
		return;
	}
	// 閉じる時にアラートを表示させる
	window.addEventListener('beforeunload', function(event) {
		event.returnValue = 'Really close this tab?';
	});
});
