// woffFormHandler.js

document.addEventListener("DOMContentLoaded", function() {
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
            if (!woff.isInClient() && !woff.isLoggedIn()) {
                console.log("ログインを促します。");
                woff.login().catch(err => {
                    console.error("ログインプロセス中にエラーが発生しました:", err);
                });
            } else {
                getProfileAndFillForm();
            }
        })
        .catch(err => {
            console.error("WOFF SDKの初期化に失敗しました:", err);
        });
}

function getProfileAndFillForm() {
    woff.getAccessToken() // トークンを取得する
        .then(token => {
            // トークンを取得したら、フォームにデータを埋め込む
            document.getElementById("tokenInput").value = token; // トークンをhiddenフィールドに設定
            return woff.getProfile(); // プロフィールを取得する
        })
        .then(profile => {
            // プロフィールを取得したら、フォームにデータを埋め込む
            document.getElementById("displayNameInput").value = profile.displayName;
            document.getElementById("userIdInput").value = profile.userId;
        })
        .then(() => {
            // フォームにデータを埋め込んだ後、送信ボタンを有効にする
            document.getElementById("submitButton").disabled = false;
        })
        .catch(err => {
            // エラーが発生した場合はログに記録する
            console.error("プロフィール情報の取得に失敗しました:", err);
        });
}

function submitForm() {
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

    fetch('https://prod-29.japaneast.logic.azure.com:443/workflows/aaaccedf9ba34275bd6617242c212bf0/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=2t-RAIoeztyj2b7Lcsw_WTzCawFgoscpHj2nO9aMqWc', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        console.log('Form data sent successfully');
        woff.closeWindow();
    })
    .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
    });
}
