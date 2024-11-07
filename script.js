
const translations = {
    en: {
        invalidInput: 'Please enter a valid value within the range of -2^63 to 2^63-1',
        generating: 'Generating...',
        generated: 'Generation complete!',
        copied: 'Copied to clipboard'
    },
    ja: {
        invalidInput: '有効な範囲（-2^63 ～ 2^63-1）内の値を入力してください',
        generating: '生成中...',
        generated: '生成完了！',
        copied: 'クリップボードにコピーしました'
    }
};

let currentLanguage = (navigator.language || navigator.userLanguage).startsWith('ja') ? 'ja' : 'en';

function setLanguage(lang) {
    currentLanguage = lang;
    document.querySelectorAll('[data-en]').forEach(element => {
        element.textContent = element.getAttribute(`data-${lang}`);
    });
    document.querySelectorAll('[data-en-placeholder]').forEach(element => {
        element.placeholder = element.getAttribute(`data-${lang}-placeholder`);
    });
    document.querySelectorAll('.language-btn').forEach(btn => btn.classList.toggle('active', btn.id.startsWith(lang)));
}

function updateStatus(key) {
    document.getElementById('status').textContent = translations[currentLanguage][key];
}

async function Generate() {
    let seed = document.getElementById("SeedText").value;
    const min = BigInt("-9223372036854775808");
    const max = BigInt("9223372036854775807");

    if (isNaN(seed) || BigInt(seed) < min || BigInt(seed) > max) {
        updateStatus('invalidInput');
        return;
    }
    
    updateStatus('generating');
    await new Promise(resolve => setTimeout(resolve, 0));

    try {
        let output = '';
        for (let i = BigInt(seed); i < BigInt(seed) + 2n ** 48n; i += 2n ** 32n) {
            output += i + ' ';
        }
        document.getElementById("List").textContent = output;
        updateStatus('generated');
    } catch {
        updateStatus('invalidInput');
    }
}

function CopyToClipboard() {
    const copyText = document.getElementById("List").textContent;
    if (!copyText) return;

    const textarea = document.createElement('textarea');
    textarea.value = copyText;
    document.body.appendChild(textarea);
    textarea.select();

    try {
        document.execCommand('copy');
        updateStatus('copied');
    } finally {
        document.body.removeChild(textarea);
    }
}

document.getElementById("SeedText").addEventListener("keypress", function(e) {
    if (e.key === "Enter") Generate();
});

setLanguage(currentLanguage);
