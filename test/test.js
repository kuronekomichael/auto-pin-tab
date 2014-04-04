/*
□ webdriver + chromeのテストを書いていく
□ 最終的にはphantomjsで動作するようにしてコマンドラインでテスト実行できるようにする

1. 初期状態は４つのサイトがstay状態で登録済み
2. 新規追加して保存
3. 更新して保存
4. stay状態のものを削除
5. 新規追加しようとして削除
6. stay状態のものをeditにして削除
*/

describe('初期状態は4つのサイトが登録済み', function() {
	describe('(1/4) facebook https://www.facebook.com/](https://www.facebook.com/', function() {
		it('input表示');
		it('removeボタン表示');
	});
	describe('(2/4) gmail https://mail.google.com/mail](https://mail.google.com/mail', function() {
		it('input表示');
		it('removeボタン表示');
	});
	describe('(3/4) tweetdeck https://web.tweetdeck.com/](https://web.tweetdeck.com/', function() {
		it('input表示');
		it('removeボタン表示');
	});
	describe('(4/4) doit.im https://i.doit.im/home](https://i.doit.im/home', function() {
		it('input表示');
		it('removeボタン表示');
	});
	it('localStorageの登録');
});
describe('新規追加して保存');
describe('更新して保存');
describe('既に登録済みのものを削除');
describe('新規追加しようとして保存せずに削除');
describe('既に登録済みのものを編集中にして削除');