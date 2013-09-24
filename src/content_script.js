// ロック対象のURL(本当はoptionsから設定したものにしたい)
var targets = [
	'https://i.doit.im/home',
	'https://mail.google.com/mail',
	'https://www.facebook.com/',
	'https://web.tweetdeck.com/'
];

function log(message) {
	//console.log(message);
}

targets.forEach(function(url) {
	var reglex = new RegExp(url);
	if (! reglex.test(location.href)) {
		return;
	}

	log("target lock start");

	// 自動的にタブをロックする
	chrome.extension.sendMessage({request: 'lock-tab'}, function (response) {
		log("pinned finished");
	});

	// 閉じる時にアラートを表示させる
	window.addEventListener("beforeunload", function() {
		return 'CLOSING OK?';
	});

	log("target lock end");
});

