'use strict';

chrome.runtime.sendMessage({request: 'lock-tab', url: location.href}, function (response) {
	if (!response.pinned) {
		//console.log('no pinned.');
		return;
	}
	// 閉じる時にアラートを表示させる
	window.addEventListener('beforeunload', function() {
		return 'CLOSING OK?';
	});
});
