document.addEventListener("DOMContentLoaded", function() {
    // DOMのロード完了後にアプリを初期化する
    initializeWoffApp();
});

function initializeWoffApp() {
    // WOFF_IDが定義されているか確認する
    if (typeof WOFF_ID === 'undefined') {
        console.error('WOFF_ID is not defined.');
        return;
    }

    // WOFFアプリを初期化する
    woff.init({ woffId: WOFF_ID })
        .then(() => {
            // WOFFクライアント内で実行されているか、ユーザーがログインしているか確認する
            if (!woff.isInClient() && !woff.isLoggedIn()) {
                console.log("ログインを促します。");
                // ログインしていない場合はログインを試みる
                woff.login().catch(err => {
                    console.error("ログインプロセス中にエラーが発生しました:", err);
                });
            } else {
                // ログイン済みの場合はプロフィール情報を取得してフォームに埋める
                getProfileAndFillForm();
            }
        })
        .catch(err => {
            // 初期化に失敗した場合のエラーハンドリング
            console.error("WOFF SDKの初期化に失敗しました:", err);
        });
}

function getProfileAndFillForm() {
    // アクセストークンを取得する
    woff.getAccessToken()
        .then(token => {
            // トークンを取得したら、フォームのhiddenフィールドに設定する
            document.getElementById("tokenInput").value = token;
            // ユーザープロフィールを取得する
            return woff.getProfile();
        })
        .then(profile => {
            // プロフィールを取得したら、フォームにユーザー情報を埋め込む
            document.getElementById("displayNameInput").value = profile.displayName;
            document.getElementById("userIdInput").value = profile.userId;
            // フォームにデータを埋め込んだ後、送信ボタンを有効にする
            document.getElementById("submitButton").disabled = false;
        })
        .catch(err => {
            // プロフィール情報の取得に失敗した場合のエラーハンドリング
            console.error("プロフィール情報の取得に失敗しました:", err);
        });
}

function submitForm() {
    // フォームデータを収集する
    const formData = {
        date: document.getElementById("dateInput").value,
        displayName: document.getElementById("displayNameInput").value,
        userId: document.getElementById("userIdInput").value,
        actualVolunteers: document.getElementById("actualVolunteers").value,
        totalVolunteers: document.getElementById("totalVolunteers").value,
        matchingCount: document.getElementById("matchingCount").value,
        completedCount: document.getElementById("completedCount").value,
        continuationCount: document.getElementById("continuationCount").value,
        token: document.getElementById("tokenInput").value // トークンをフォームデータに追加
    };

    // フォームデータをサーバーにPOSTリクエストで送信する
    fetch('https://prod-29.japaneast.logic.azure.com:443/workflows/aaaccedf9ba34275bd6617242c212bf0/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=2t-RAIoeztyj2b7Lcsw_WTzCawFgoscpHj2nO9aMqWc', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            // ネットワークレスポンスがOKでない場合のエラーハンドリング
            throw new Error('Network response was not ok');
        }
        console.log('Form data sent successfully');
        // フォーム送信後、WOFFアプリを閉じる
        woff.closeWindow();
    })
    .catch(error => {
        // フェッチ操作の問題が発生した場合のエラーハンドリング
        console.error('There was a problem with your fetch operation:', error);
    });
}
