'use strict';

chrome.runtime.onInstalled.addListener(() => {
    // 初回起動時（＝ローカルストレージに何もデータが入っていない）の初期設定
    if (localStorage.targetUrls === undefined) {
        localStorage.targetUrls = [
            'https://www.facebook.com/',
            'https://mail.google.com/mail',
            'https://web.tweetdeck.com/'
        ];
    }
});

// content_scriptからの通知を受けて、ロックすべきタブであればpinned状態にする
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.assert(message.request === 'auto-pin-tab');

    const isTarget = localStorage.targetUrls.split(',').some((url) => {
        return (new RegExp(url).test(message.url));
    });

    if (!isTarget) {
        sendResponse({pinned: false});
        return;
    }

    chrome.tabs.query({}, (tabs) => {
        let duplicates = 0;
        tabs.forEach((tab) => {
            if (new RegExp(message.url).test(tab.url)) {
                duplicates++;
            }
        });

        // 既にロックされているタブが１つ以上ある場合は、これ以上ロックしない
        if (1 < duplicates) {
            sendResponse({pinned: false});
            return;
        }

        chrome.tabs.update(sender.tab.id, {pinned: true}, (tab) => {
            sendResponse({pinned: tab.pinned});
        });
    });
    return true;
});
