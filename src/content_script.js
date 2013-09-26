// ロック対象のURL(本当はoptionsから設定したものにしたい)
var targets = [
	'https://i.doit.im/home',
	'https://mail.google.com/mail',
	'https://www.facebook.com/',
	'https://web.tweetdeck.com/'
];

function log(message) {
	console.log(message);
}

var targetUrl;

var isTarget = targets.some(function(url) {
	if (new RegExp(url).test(location.href)) {
		targetUrl = url;
		return true;
	} else {
		return false;
	}
});

if (isTarget) {
	// 自動的にタブをロックする
	chrome.extension.sendMessage({request: 'lock-tab', url: targetUrl}, function (response) {
		if (!response.pinned) {
			log("no pinned...");
			return;
		}
		// 閉じる時にアラートを表示させる
		window.addEventListener("beforeunload", function() {
			return 'CLOSING OK?';
		});
	});
}
