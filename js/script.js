const input = document.getElementById('input');
const countSpan = document.getElementById('count');
const toast = document.getElementById('toast');

// 1. 字數統計
input.addEventListener('input', () => {
    countSpan.innerText = input.value.length;
});

// 2. 清空功能
function clearText() {
    if (input.value.length > 0 && confirm('確定要清空嗎？')) {
        input.value = '';
        countSpan.innerText = '0';
        input.focus();
    }
}

// 3. 核心轉換與複製
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

// 4. iOS 安裝引導
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