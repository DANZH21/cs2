document.addEventListener("DOMContentLoaded", function() {
    // Инициализация TON Connect
    const connector = new TonConnect.TonConnect({
        manifestUrl: 'https://your-site.com/tonconnect-manifest.json'
    });
    
    // Проверка подключенного кошелька
    let walletConnectionSource = null;
    
    // Локализация
    const texts = {
        en: {
            title: "WALLET",
            balanceLabel: "Balance:",
            backBtn: "⮌ Back to Menu",
            connectBtn: "Connect TON Wallet",
            disconnectBtn: "Disconnect",
            testDepositBtn: "Test +1 TON",
            walletConnected: "Wallet connected",
            walletNotConnected: "Wallet not connected",
            walletAddressLabel: "Your TON Wallet:",
            copyAlert: "Address copied!",
            depositSuccess: "+1 TON added to your balance!"
        },
        ru: {
            title: "КОШЕЛЕК",
            balanceLabel: "Баланс:",
            backBtn: "⮌ Назад в меню",
            connectBtn: "Подключить TON кошелек",
            disconnectBtn: "Отключить",
            testDepositBtn: "Тест +1 TON",
            walletConnected: "Кошелек подключен",
            walletNotConnected: "Кошелек не подключен",
            walletAddressLabel: "Ваш TON кошелек:",
            copyAlert: "Адрес скопирован!",
            depositSuccess: "+1 TON добавлен на баланс!"
        }
    };
    
    // Инициализация языка
    const languageSelector = document.getElementById('language-selector');
    let lang = localStorage.getItem('lang') || 'en';
    languageSelector.value = lang;
    
    // Загрузка баланса
    let balance = parseFloat(localStorage.getItem('balance')) || 0;
    document.getElementById("balance").textContent = balance.toFixed(2);
    
    // Обновление интерфейса
    function updateLanguage() {
        document.getElementById('title').textContent = texts[lang].title;
        document.getElementById('balance-label').textContent = texts[lang].balanceLabel;
        document.getElementById('back-button').textContent = texts[lang].backBtn;
        document.getElementById('connect-btn').textContent = texts[lang].connectBtn;
        document.getElementById('disconnect-btn').textContent = texts[lang].disconnectBtn;
        document.getElementById('test-deposit-btn').textContent = texts[lang].testDepositBtn;
        
        if (walletConnectionSource) {
            document.getElementById('wallet-status-title').textContent = texts[lang].walletConnected;
            document.getElementById('wallet-address-container').firstElementChild.textContent = texts[lang].walletAddressLabel;
        } else {
            document.getElementById('wallet-status-title').textContent = texts[lang].walletNotConnected;
        }
    }
    
    // Обработчик изменения языка
    languageSelector.addEventListener('change', (e) => {
        lang = e.target.value;
        localStorage.setItem('lang', lang);
        updateLanguage();
    });
    
    // Проверка подключенного кошелька
    async function checkConnection() {
        walletConnectionSource = connector.connected;
        
        if (walletConnectionSource) {
            const walletAddress = connector.account.address;
            document.getElementById('wallet-address').textContent = walletAddress;
            document.getElementById('wallet-address-container').classList.remove('hidden');
            document.getElementById('test-deposit-btn').classList.remove('hidden');
            document.getElementById('disconnect-btn').classList.remove('hidden');
            document.getElementById('connect-btn').classList.add('hidden');
            document.getElementById('wallet-status-title').textContent = texts[lang].walletConnected;
        } else {
            document.getElementById('wallet-address-container').classList.add('hidden');
            document.getElementById('test-deposit-btn').classList.add('hidden');
            document.getElementById('disconnect-btn').classList.add('hidden');
            document.getElementById('connect-btn').classList.remove('hidden');
            document.getElementById('wallet-status-title').textContent = texts[lang].walletNotConnected;
        }
    }
    
    // Подключение кошелька
    document.getElementById('connect-btn').addEventListener('click', async () => {
        const wallets = await connector.getWallets();
        const wallet = wallets[0]; // Берем первый доступный кошелек
        
        connector.connect({ jsBridgeKey: wallet.jsBridgeKey });
        
        connector.onStatusChange((wallet) => {
            if (wallet) {
                walletConnectionSource = wallet;
                checkConnection();
                updateLanguage();
            }
        });
    });
    
    // Отключение кошелька
    document.getElementById('disconnect-btn').addEventListener('click', async () => {
        await connector.disconnect();
        walletConnectionSource = null;
        checkConnection();
        updateLanguage();
    });
    
    // Тестовое пополнение баланса
    document.getElementById('test-deposit-btn').addEventListener('click', () => {
        balance += 1;
        localStorage.setItem('balance', balance.toFixed(2));
        document.getElementById("balance").textContent = balance.toFixed(2);
        alert(texts[lang].depositSuccess);
    });
    
    // Копирование адреса
    document.getElementById('wallet-address').addEventListener('click', function() {
        const address = this.textContent;
        navigator.clipboard.writeText(address).then(() => {
            alert(texts[lang].copyAlert);
        });
    });
    
    // Кнопка "Назад"
    document.getElementById('back-button').addEventListener('click', function() {
        window.location.href = 'main.html';
    });
    
    // Первоначальная проверка подключения
    checkConnection();
    updateLanguage();
});