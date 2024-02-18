// initWoffApp.js

document.addEventListener("DOMContentLoaded", function() {
    // WOFF SDKの初期化
    initializeWoffApp();
});

function initializeWoffApp() {
    // WOFF_IDは外部のHTMLファイルで定義されていると仮定
    if (typeof WOFF_ID === 'undefined') {
        console.error('WOFF_ID is not defined.');
        return;
    }

    woff.init({ woffId: WOFF_ID })
        .then(() => {
            // WOFFブラウザ内で実行されているか、またはログイン済みかどうかを確認
            if (!woff.isInClient() && !woff.isLoggedIn()) {
                // 外部ブラウザで実行され、未ログインの場合
                console.log("ログインを促します。");
                // ログイン処理を促す（この例ではredirectUriは指定していません）
                woff.login().catch(err => {
                    console.error("ログインプロセス中にエラーが発生しました:", err);
                });
            } else {
                // WOFFブラウザ内で実行されている、またはログイン済みの場合
                // プロファイル情報の取得
                getProfileAndFillForm();
            }
        })
        .catch(err => {
            console.error("WOFF SDKの初期化に失敗しました:", err);
        });
}

function getProfileAndFillForm() {
    woff.getProfile()
        .then(profile => {
            // プロファイル情報を元にフォームを埋める
            // この例では、displayNameをinputフィールドに設定
            document.getElementById("displayNameInput").value = profile.displayName;
        })
        .catch(err => {
            console.error("プロファイル情報の取得に失敗しました:", err);
        });
}
