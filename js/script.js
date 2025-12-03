// ==========================================
// 1. PWA 安裝按鈕邏輯 (新增部分)
// ==========================================
let deferredPrompt; // 用來暫存瀏覽器的安裝事件
const installBtn = document.getElementById('install-btn');

// 監聽：當瀏覽器 (Android/Chrome) 覺得可以安裝時，會觸發這個事件
window.addEventListener('beforeinstallprompt', (e) => {
    // 1. 阻止瀏覽器預設的醜醜橫條 (我們自己做按鈕比較好看)
    e.preventDefault();
    // 2. 把這個事件存起來，等一下按按鈕時要用
    deferredPrompt = e;
    // 3. 讓原本 hidden 的「下載 App」按鈕顯示出來
    installBtn.classList.remove('hidden');
    console.log('可以安裝 PWA，按鈕已顯示');
});

// 點擊：當使用者按了「下載 App」按鈕
installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;

    // 1. 呼叫瀏覽器的原生安裝視窗
    deferredPrompt.prompt();

    // 2. 等待使用者的選擇 (安裝 或 取消)
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response: ${outcome}`);

    // 3. 用完就丟，不能重複使用
    deferredPrompt = null;
    
    // 4. 無論安裝與否，按完後先把按鈕藏起來
    installBtn.classList.add('hidden');
});

// 檢查：如果你已經安裝成功了，就不需要再顯示按鈕
window.addEventListener('appinstalled', () => {
    installBtn.classList.add('hidden');
    deferredPrompt = null;
    console.log('PWA 已安裝成功！');
});


// ==========================================
// 2. 原本的功能邏輯 (保持不變)
// ==========================================
const input = document.getElementById('input');
const countSpan = document.getElementById('count');
const toast = document.getElementById('toast');

// 字數統計
input.addEventListener('input', () => {
    countSpan.innerText = input.value.length;
});

// 清空功能
function clearText() {
    if (input.value.length > 0 && confirm('確定要清空嗎？')) {
        input.value = '';
        countSpan.innerText = '0';
        input.focus();
    }
}

// 核心轉換與複製
function convertAndCopy() {
    const text = input.value;
    if (!text) return alert("請先輸入內容！");

    // 轉換邏輯：空行 -> U+2800
    const converted = text.split('\n').map(line => {
        const trimmed = line.trim();
        return trimmed.length === 0 ? '\u2800' : line;
    }).join('\n');

    navigator.clipboard.writeText(converted).then(showToast).catch(() => {
        alert("自動複製失敗，請手動複製");
    });
}

function showToast() {
    toast.classList.remove('hidden');
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.classList.add('hidden'), 300);
    }, 2000);
}

// iOS 安裝引導 (這是給 iPhone 看的，Android 會用上面的按鈕)
function initIosPrompt() {
    const isIos = /iPhone|iPad|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isStandalone = window.navigator.standalone === true;

    if (isIos && !isStandalone && !localStorage.getItem('iosPromptClosed')) {
        setTimeout(() => {
            const prompt = document.getElementById('ios-prompt');
            prompt.classList.remove('hidden');
            requestAnimationFrame(() => prompt.classList.remove('translate-y-20', 'opacity-0'));
        }, 3000);
    }
}

function closeIosPrompt() {
    const prompt = document.getElementById('ios-prompt');
    prompt.classList.add('translate-y-20', 'opacity-0');
    setTimeout(() => prompt.classList.add('hidden'), 500);
    localStorage.setItem('iosPromptClosed', 'true');
}

initIosPrompt();