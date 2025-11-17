// OTC Crypto Platform - Main JavaScript
// Comprehensive crypto trading platform for Nigerian users

class CryptoPlatform {
    constructor() {
        this.currentUser = null;
        this.wallets = {};
        this.transactions = [];
        this.kycStatus = null;
        this.marketData = {};
        this.init();
    }

    init() {
        this.initializeAnimations();
        this.setupEventListeners();
        this.loadMarketData();
        this.initializeWallets();
        this.setupRealTimeUpdates();
    }

    // Animation and Visual Effects
    initializeAnimations() {
        // Initialize particle system for background
        if (typeof PIXI !== 'undefined') {
            this.initParticleSystem();
        }

        // Initialize text animations
        if (typeof Typed !== 'undefined') {
            this.initTypedAnimations();
        }

        // Initialize scroll animations
        this.initScrollAnimations();

        // Initialize chart animations
        this.initChartAnimations();
    }

    initParticleSystem() {
        const canvas = document.getElementById('particle-canvas');
        if (!canvas) return;

        const app = new PIXI.Application({
            view: canvas,
            width: window.innerWidth,
            height: window.innerHeight,
            transparent: true,
            antialias: true
        });

        const particles = [];
        const particleCount = 50;

        for (let i = 0; i < particleCount; i++) {
            const particle = new PIXI.Graphics();
            particle.beginFill(0x00d4ff, 0.3);
            particle.drawCircle(0, 0, Math.random() * 3 + 1);
            particle.endFill();
            
            particle.x = Math.random() * app.screen.width;
            particle.y = Math.random() * app.screen.height;
            particle.vx = (Math.random() - 0.5) * 2;
            particle.vy = (Math.random() - 0.5) * 2;
            
            app.stage.addChild(particle);
            particles.push(particle);
        }

        app.ticker.add(() => {
            particles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                if (particle.x < 0 || particle.x > app.screen.width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > app.screen.height) particle.vy *= -1;
            });
        });
    }

    initTypedAnimations() {
        const typedElements = document.querySelectorAll('.typed-text');
        typedElements.forEach(element => {
            new Typed(element, {
                strings: [element.dataset.text || 'Crypto Trading Platform'],
                typeSpeed: 50,
                backSpeed: 30,
                loop: false,
                showCursor: false
            });
        });
    }

    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }

    initChartAnimations() {
        // Initialize ECharts for trading data
        this.initializeTradingCharts();
    }

    // Wallet Management System
    initializeWallets() {
        this.supportedNetworks = ['bitcoin', 'ethereum', 'bnb', 'solana', 'polygon', 'tron'];
        this.wallets = this.loadWalletsFromStorage() || {};
        
        // Generate initial wallets if none exist
        if (Object.keys(this.wallets).length === 0) {
            this.generateInitialWallets();
        }
    }

    generateInitialWallets() {
        this.supportedNetworks.forEach(network => {
            this.wallets[network] = this.generateWallet(network);
        });
        this.saveWalletsToStorage();
    }

    generateWallet(network) {
        const walletData = {
            network: network,
            address: this.generateAddress(network),
            privateKey: this.generatePrivateKey(network),
            balance: Math.random() * 10, // Mock balance
            transactions: [],
            createdAt: new Date().toISOString()
        };
        
        return walletData;
    }

    generateAddress(network) {
        // Mock address generation - in real implementation, use proper crypto libraries
        const prefixes = {
            bitcoin: '1',
            ethereum: '0x',
            bnb: '0x',
            solana: '',
            polygon: '0x',
            tron: 'T'
        };
        
        const prefix = prefixes[network] || '0x';
        const randomChars = Array.from({length: 32}, () => 
            '0123456789abcdef'[Math.floor(Math.random() * 16)]
        ).join('');
        
        return prefix + randomChars;
    }

    generatePrivateKey(network) {
        // Mock private key generation
        return '0x' + Array.from({length: 64}, () => 
            '0123456789abcdef'[Math.floor(Math.random() * 16)]
        ).join('');
    }

    // Market Data and Trading
    loadMarketData() {
        // Mock market data - in real implementation, fetch from APIs
        this.marketData = {
            bitcoin: { price: 45000 + Math.random() * 5000, change: (Math.random() - 0.5) * 10 },
            ethereum: { price: 3000 + Math.random() * 500, change: (Math.random() - 0.5) * 15 },
            bnb: { price: 400 + Math.random() * 100, change: (Math.random() - 0.5) * 12 },
            solana: { price: 100 + Math.random() * 50, change: (Math.random() - 0.5) * 20 },
            polygon: { price: 1 + Math.random() * 0.5, change: (Math.random() - 0.5) * 18 },
            tron: { price: 0.1 + Math.random() * 0.05, change: (Math.random() - 0.5) * 8 }
        };
        
        this.updateMarketDisplay();
    }

    updateMarketDisplay() {
        Object.keys(this.marketData).forEach(crypto => {
            const element = document.querySelector(`[data-crypto="${crypto}"]`);
            if (element) {
                const data = this.marketData[crypto];
                const priceElement = element.querySelector('.price');
                const changeElement = element.querySelector('.change');
                
                if (priceElement) {
                    priceElement.textContent = `$${data.price.toFixed(2)}`;
                }
                if (changeElement) {
                    changeElement.textContent = `${data.change >= 0 ? '+' : ''}${data.change.toFixed(2)}%`;
                    changeElement.className = `change ${data.change >= 0 ? 'positive' : 'negative'}`;
                }
            }
        });
    }

    initializeTradingCharts() {
        const chartContainer = document.getElementById('trading-chart');
        if (!chartContainer || typeof echarts === 'undefined') return;

        const chart = echarts.init(chartContainer);
        
        // Generate mock OHLC data
        const data = this.generateOHLCData();
        
        const option = {
            backgroundColor: 'transparent',
            grid: {
                left: '10%',
                right: '10%',
                top: '10%',
                bottom: '15%'
            },
            xAxis: {
                type: 'category',
                data: data.map(item => item.date),
                axisLine: { lineStyle: { color: '#4a5568' } },
                axisLabel: { color: '#a0aec0' }
            },
            yAxis: {
                type: 'value',
                axisLine: { lineStyle: { color: '#4a5568' } },
                axisLabel: { color: '#a0aec0' },
                splitLine: { lineStyle: { color: '#2d3748' } }
            },
            series: [{
                type: 'candlestick',
                data: data.map(item => [item.open, item.close, item.low, item.high]),
                itemStyle: {
                    color: '#10b981',
                    color0: '#ef4444',
                    borderColor: '#10b981',
                    borderColor0: '#ef4444'
                }
            }],
            tooltip: {
                trigger: 'axis',
                backgroundColor: '#2d3748',
                borderColor: '#4a5568',
                textStyle: { color: '#e2e8f0' }
            }
        };
        
        chart.setOption(option);
        
        // Store chart instance for updates
        this.tradingChart = chart;
    }

    generateOHLCData() {
        const data = [];
        let basePrice = 45000;
        
        for (let i = 0; i < 30; i++) {
            const date = new Date();
            date.setDate(date.getDate() - (29 - i));
            
            const open = basePrice + (Math.random() - 0.5) * 1000;
            const close = open + (Math.random() - 0.5) * 2000;
            const high = Math.max(open, close) + Math.random() * 500;
            const low = Math.min(open, close) - Math.random() * 500;
            
            data.push({
                date: date.toISOString().split('T')[0],
                open: open,
                close: close,
                high: high,
                low: low
            });
            
            basePrice = close;
        }
        
        return data;
    }

    // KYC Management
    initKYCSystem() {
        this.kycStatus = this.loadKYCStatus() || {
            level: 0,
            status: 'not_started',
            documents: {},
            verificationScore: 0
        };
    }

    submitKYC(documentType, documentData) {
        this.kycStatus.documents[documentType] = {
            data: documentData,
            submittedAt: new Date().toISOString(),
            status: 'pending'
        };
        
        // Simulate verification process
        setTimeout(() => {
            this.kycStatus.documents[documentType].status = 'verified';
            this.updateKYCLevel();
            this.saveKYCStatus();
        }, 2000);
        
        this.saveKYCStatus();
    }

    updateKYCLevel() {
        const verifiedDocs = Object.values(this.kycStatus.documents)
            .filter(doc => doc.status === 'verified').length;
        
        this.kycStatus.level = Math.min(verifiedDocs, 3);
        this.kycStatus.verificationScore = verifiedDocs * 33.33;
    }

    // Event Listeners
    setupEventListeners() {
        // Navigation
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-action]')) {
                this.handleAction(e.target.dataset.action, e.target);
            }
        });

        // Form submissions
        document.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission(e.target);
        });

        // Real-time updates
        this.setupRealTimeUpdates();
    }

    handleAction(action, element) {
        switch (action) {
            case 'generate-wallet':
                this.showGenerateWalletModal();
                break;
            case 'place-order':
                this.handleOrderPlacement(element);
                break;
            case 'submit-kyc':
                this.handleKYCSubmission(element);
                break;
            case 'export-history':
                this.exportTransactionHistory();
                break;
            default:
                console.log('Unknown action:', action);
        }
    }

    handleFormSubmission(form) {
        const formData = new FormData(form);
        const formType = form.dataset.type;
        
        switch (formType) {
            case 'order':
                this.processOrder(formData);
                break;
            case 'kyc':
                this.processKYC(formData);
                break;
            case 'wallet':
                this.processWalletAction(formData);
                break;
        }
    }

    // Trading Functions
    handleOrderPlacement(element) {
        const orderData = {
            type: element.dataset.orderType,
            crypto: element.dataset.crypto,
            amount: parseFloat(element.dataset.amount),
            price: parseFloat(element.dataset.price)
        };
        
        this.placeOrder(orderData);
    }

    placeOrder(orderData) {
        const order = {
            id: this.generateOrderId(),
            ...orderData,
            status: 'pending',
            createdAt: new Date().toISOString(),
            userId: this.currentUser?.id || 'anonymous'
        };
        
        this.orders = this.orders || [];
        this.orders.push(order);
        
        // Simulate order execution
        setTimeout(() => {
            this.executeOrder(order);
        }, Math.random() * 5000 + 2000);
        
        this.showNotification('Order placed successfully!', 'success');
    }

    executeOrder(order) {
        order.status = 'completed';
        order.completedAt = new Date().toISOString();
        
        // Update wallet balance
        if (this.wallets[order.crypto]) {
            this.wallets[order.crypto].balance += order.amount;
        }
        
        // Record transaction
        this.recordTransaction({
            type: 'trade',
            crypto: order.crypto,
            amount: order.amount,
            orderId: order.id
        });
        
        this.showNotification('Order executed successfully!', 'success');
        this.updateWalletDisplay();
    }

    // Transaction Management
    recordTransaction(transactionData) {
        const transaction = {
            id: this.generateTransactionId(),
            ...transactionData,
            timestamp: new Date().toISOString(),
            status: 'confirmed'
        };
        
        this.transactions.push(transaction);
        this.saveTransactionsToStorage();
    }

    exportTransactionHistory() {
        const csvContent = this.generateTransactionCSV();
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `transaction-history-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        
        window.URL.revokeObjectURL(url);
    }

    generateTransactionCSV() {
        const headers = ['ID', 'Type', 'Crypto', 'Amount', 'Date', 'Status'];
        const rows = this.transactions.map(tx => [
            tx.id, tx.type, tx.crypto, tx.amount, tx.timestamp, tx.status
        ]);
        
        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }

    // Utility Functions
    generateOrderId() {
        return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }

    generateTransactionId() {
        return 'TX-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Real-time Updates
    setupRealTimeUpdates() {
        // Update market data every 30 seconds
        setInterval(() => {
            this.loadMarketData();
        }, 30000);
        
        // Update wallet balances every 60 seconds
        setInterval(() => {
            this.updateWalletBalances();
        }, 60000);
    }

    updateWalletBalances() {
        Object.keys(this.wallets).forEach(network => {
            // Simulate balance updates
            this.wallets[network].balance += (Math.random() - 0.5) * 0.1;
            this.wallets[network].balance = Math.max(0, this.wallets[network].balance);
        });
        
        this.updateWalletDisplay();
    }

    // Storage Management
    saveWalletsToStorage() {
        localStorage.setItem('crypto-platform-wallets', JSON.stringify(this.wallets));
    }

    loadWalletsFromStorage() {
        const stored = localStorage.getItem('crypto-platform-wallets');
        return stored ? JSON.parse(stored) : null;
    }

    saveKYCStatus() {
        localStorage.setItem('crypto-platform-kyc', JSON.stringify(this.kycStatus));
    }

    loadKYCStatus() {
        const stored = localStorage.getItem('crypto-platform-kyc');
        return stored ? JSON.parse(stored) : null;
    }

    saveTransactionsToStorage() {
        localStorage.setItem('crypto-platform-transactions', JSON.stringify(this.transactions));
    }

    loadTransactionsFromStorage() {
        const stored = localStorage.getItem('crypto-platform-transactions');
        return stored ? JSON.parse(stored) : [];
    }

    // UI Update Functions
    updateWalletDisplay() {
        const walletElements = document.querySelectorAll('.wallet-balance');
        walletElements.forEach(element => {
            const network = element.dataset.network;
            if (this.wallets[network]) {
                element.textContent = `${this.wallets[network].balance.toFixed(4)} ${network.toUpperCase()}`;
            }
        });
    }
}

// Initialize the platform when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cryptoPlatform = new CryptoPlatform();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CryptoPlatform;
}