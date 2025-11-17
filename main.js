// OTC Crypto Platform - Main JavaScript
// Comprehensive crypto trading platform for Nigerian users

class CryptoPlatform {
    constructor() {
        this.currentUser = null;
        this.wallets = {};
        this.transactions = [];
        this.kycStatus = null;
        this.marketData = {};
        this.fiatRate = 1540;
        this.currencyFormatter = new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            maximumFractionDigits: 2
        });
        this.walletContainer = null;
        this.walletEmptyState = null;
        this.p2pOfferContainer = null;
        this.p2pActivityContainer = null;
        this.p2pEmptyState = null;
        this.p2pOffers = [];
        this.p2pTrades = [];
        this.p2pFilters = { side: 'all', asset: 'all', payment: 'all' };
        this.supportedNetworks = ['bitcoin', 'ethereum', 'bnb', 'solana', 'polygon', 'tron'];
        this.networkMeta = {
            bitcoin: { name: 'Bitcoin', symbol: 'BTC', icon: '₿', color: '#f7931a' },
            ethereum: { name: 'Ethereum', symbol: 'ETH', icon: 'Ξ', color: '#627eea' },
            bnb: { name: 'BNB Chain', symbol: 'BNB', icon: 'BNB', color: '#f3ba2f' },
            solana: { name: 'Solana', symbol: 'SOL', icon: 'SOL', color: '#9945ff' },
            polygon: { name: 'Polygon', symbol: 'MATIC', icon: 'M', color: '#8247e5' },
            tron: { name: 'Tron', symbol: 'TRX', icon: 'TRX', color: '#ff0600' }
        };
        this.init();
    }

    init() {
        this.walletContainer = document.getElementById('wallet-grid');
        this.walletEmptyState = document.getElementById('wallet-empty');
        this.p2pOfferContainer = document.getElementById('p2p-offer-list');
        this.p2pActivityContainer = document.getElementById('p2p-activity');
        this.p2pEmptyState = document.getElementById('p2p-empty-state');
        this.transactions = this.loadTransactionsFromStorage();
        this.p2pOffers = this.loadP2POffers();
        this.p2pTrades = this.loadP2PTrades();
        this.initializeAnimations();
        this.setupEventListeners();
        this.loadMarketData();
        this.initializeWallets();
        this.initializeP2PDesk();
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
        this.wallets = this.loadWalletsFromStorage() || {};
        
        // Generate initial wallets if none exist
        if (Object.keys(this.wallets).length === 0) {
            this.generateInitialWallets();
        }

        this.renderWalletGrid();
        this.updateWalletStats();
    }

    generateInitialWallets() {
        this.supportedNetworks.forEach(network => {
            this.wallets[network] = this.generateWallet(network);
        });
        this.saveWalletsToStorage();
    }

    generateWallet(network) {
        const meta = this.getNetworkMeta(network);
        const walletData = {
            network: network,
            address: this.generateAddress(network),
            privateKey: this.generatePrivateKey(network),
            balance: Math.random() * 10, // Mock balance
            transactions: [],
            createdAt: new Date().toISOString(),
            label: `${meta.name} Vault`
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

    getNetworkMeta(network) {
        return this.networkMeta[network] || { name: network.toUpperCase(), symbol: network.toUpperCase(), icon: network[0]?.toUpperCase() || '?', color: '#4a5568' };
    }

    formatCryptoBalance(amount, symbol) {
        if (typeof amount !== 'number') {
            return `0.0000 ${symbol}`;
        }
        return `${amount.toFixed(4)} ${symbol}`;
    }

    formatFiat(amount) {
        return this.currencyFormatter.format(amount || 0);
    }

    convertToNGN(balance, network) {
        const price = this.marketData?.[network]?.price || 0;
        const usdValue = (balance || 0) * price;
        return usdValue * this.fiatRate;
    }

    calculatePortfolioValue() {
        return Object.keys(this.wallets).reduce((sum, network) => {
            return sum + this.convertToNGN(this.wallets[network]?.balance || 0, network);
        }, 0);
    }

    calculateDailyPnL() {
        return Object.keys(this.wallets).reduce((sum, network) => {
            const change = this.marketData?.[network]?.change || 0;
            const networkValue = this.convertToNGN(this.wallets[network]?.balance || 0, network);
            return sum + (networkValue * (change / 100));
        }, 0);
    }

    updateWalletStats() {
        const totalValue = this.calculatePortfolioValue();
        const pnl = this.calculateDailyPnL();
        const walletCount = Object.keys(this.wallets).length;
        const txnCount = this.transactions.length;

        const valueElement = document.getElementById('portfolio-value');
        const pnlElement = document.getElementById('portfolio-pnl');
        const walletElement = document.getElementById('wallet-count');
        const inlineWalletElement = document.getElementById('wallet-count-inline');
        const txElement = document.getElementById('tx-count');

        if (valueElement) valueElement.textContent = this.formatFiat(totalValue);
        if (pnlElement) {
            const absPnl = this.formatFiat(Math.abs(pnl));
            pnlElement.textContent = `${pnl >= 0 ? '+' : '-'}${absPnl}`;
            pnlElement.classList.toggle('text-green-400', pnl >= 0);
            pnlElement.classList.toggle('text-red-400', pnl < 0);
        }
        if (walletElement) walletElement.textContent = walletCount;
        if (inlineWalletElement) inlineWalletElement.textContent = walletCount;
        if (txElement) txElement.textContent = txnCount;
    }

    renderWalletGrid() {
        if (!this.walletContainer) return;
        const networks = Object.keys(this.wallets);

        if (networks.length === 0) {
            this.walletContainer.innerHTML = '';
            this.walletContainer.classList.add('hidden');
            if (this.walletEmptyState) {
                this.walletEmptyState.classList.remove('hidden');
            }
            return;
        }

        this.walletContainer.classList.remove('hidden');
        if (this.walletEmptyState) {
            this.walletEmptyState.classList.add('hidden');
        }

        const fragment = document.createDocumentFragment();
        networks.forEach(network => {
            const wallet = this.wallets[network];
            if (!wallet) return;
            const meta = this.getNetworkMeta(network);
            const card = document.createElement('div');
            card.className = 'wallet-card p-6 animate-on-scroll';
            card.dataset.network = network;
            card.classList.add('animate-in');

            const fiatValue = this.formatFiat(this.convertToNGN(wallet.balance, network));
            const balanceText = this.formatCryptoBalance(wallet.balance, meta.symbol);

            card.innerHTML = `
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center space-x-3">
                        <div class="network-icon" style="background:${meta.color}; color: #fff;">${meta.icon}</div>
                        <div>
                            <h3 class="font-bold text-white">${meta.name}</h3>
                            <p class="text-gray-400 text-sm">${wallet.label || meta.symbol} Wallet</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="wallet-balance font-mono text-white font-bold" data-network="${network}">${balanceText}</div>
                        <div class="wallet-fiat text-gray-400 text-sm" data-network="${network}">${fiatValue}</div>
                    </div>
                </div>
                <div class="address-display text-xs text-gray-300 mb-4" data-copy="${wallet.address}" data-copy-message="${meta.symbol} address copied!" title="Click to copy">
                    ${wallet.address}
                </div>
                <div class="flex flex-wrap gap-2">
                    <button onclick="showReceiveModal('${network}')" class="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                        Receive
                    </button>
                    <button onclick="showSendModal('${network}')" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                        Send
                    </button>
                    <button onclick="showWalletDetails('${network}')" class="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                        Details
                    </button>
                </div>
            `;

            fragment.appendChild(card);
        });

        this.walletContainer.innerHTML = '';
        this.walletContainer.appendChild(fragment);
        this.updateWalletDisplay();
    }

    createNewWallet(network, alias = '') {
        if (!this.supportedNetworks.includes(network)) {
            return null;
        }

        const wallet = this.generateWallet(network);
        if (alias) {
            wallet.label = alias;
        }

        this.wallets[network] = wallet;
        this.saveWalletsToStorage();
        this.renderWalletGrid();
        return wallet;
    }

    // P2P Desk Management
    initializeP2PDesk() {
        if (!this.p2pOfferContainer) {
            return;
        }

        if (!Array.isArray(this.p2pOffers) || this.p2pOffers.length === 0) {
            this.p2pOffers = this.generateSeedP2POffers();
            this.saveP2POffers();
        }

        if (!Array.isArray(this.p2pTrades) || this.p2pTrades.length === 0) {
            this.p2pTrades = this.generateSeedP2PTrades();
            this.saveP2PTrades();
        }

        this.renderP2POffers();
        this.renderP2PActivity();
        this.renderP2PStats();
    }

    generateSeedP2POffers() {
        const now = Date.now();
        return [
            {
                id: this.generateP2POfferId(),
                type: 'buy',
                asset: 'USDT',
                price: 780.5,
                min: 200000,
                max: 5000000,
                paymentMethod: 'Bank Transfer',
                merchant: 'LagosVault',
                completionRate: 99,
                trades: 320,
                note: 'Same bank transfers preferred',
                createdAt: new Date(now - 600000).toISOString()
            },
            {
                id: this.generateP2POfferId(),
                type: 'sell',
                asset: 'BTC',
                price: 58500000,
                min: 150000,
                max: 2000000,
                paymentMethod: 'USSD',
                merchant: 'AbujaBlock',
                completionRate: 97,
                trades: 210,
                note: 'Release within 10 minutes',
                createdAt: new Date(now - 1200000).toISOString()
            },
            {
                id: this.generateP2POfferId(),
                type: 'buy',
                asset: 'ETH',
                price: 4650000,
                min: 50000,
                max: 1000000,
                paymentMethod: 'Cash',
                merchant: 'IslandDesk',
                completionRate: 98,
                trades: 540,
                note: 'Cash pickups only in Lagos Island',
                createdAt: new Date(now - 1800000).toISOString()
            },
            {
                id: this.generateP2POfferId(),
                type: 'sell',
                asset: 'USDT',
                price: 778.2,
                min: 100000,
                max: 2500000,
                paymentMethod: 'Bank Transfer',
                merchant: 'KanoRails',
                completionRate: 95,
                trades: 180,
                note: 'UBA & GTB prioritised',
                createdAt: new Date(now - 2400000).toISOString()
            }
        ];
    }

    generateSeedP2PTrades() {
        const seedOffers = this.p2pOffers && this.p2pOffers.length ? this.p2pOffers : this.generateSeedP2POffers();
        return seedOffers.slice(0, 3).map((offer, index) => ({
            id: this.generateP2PTradeId(),
            offerId: offer.id,
            merchant: offer.merchant,
            asset: offer.asset,
            type: offer.type,
            amount: offer.min + (index + 1) * 50000,
            price: offer.price,
            paymentMethod: offer.paymentMethod,
            releaseMinutes: 10 + index * 3,
            timestamp: new Date(Date.now() - (index + 1) * 3600000).toISOString()
        }));
    }

    setP2PFilter(filterType, value) {
        if (!this.p2pOfferContainer) return;
        this.p2pFilters[filterType] = value;
        this.renderP2POffers();
    }

    getFilteredOffers() {
        const offers = Array.isArray(this.p2pOffers) ? this.p2pOffers : [];
        return offers.filter(offer => {
            const matchesSide = this.p2pFilters.side === 'all' || offer.type === this.p2pFilters.side;
            const matchesAsset = this.p2pFilters.asset === 'all' || offer.asset === this.p2pFilters.asset;
            const matchesPayment = this.p2pFilters.payment === 'all' || offer.paymentMethod === this.p2pFilters.payment;
            return matchesSide && matchesAsset && matchesPayment;
        });
    }

    renderP2POffers() {
        if (!this.p2pOfferContainer) return;
        const offers = this.getFilteredOffers();

        if (offers.length === 0) {
            this.p2pOfferContainer.innerHTML = '';
            if (this.p2pEmptyState) {
                this.p2pEmptyState.classList.remove('hidden');
            }
            return;
        }

        if (this.p2pEmptyState) {
            this.p2pEmptyState.classList.add('hidden');
        }

        const fragment = document.createDocumentFragment();
        offers.forEach(offer => {
            const row = document.createElement('div');
            row.className = 'offer-row';
            row.innerHTML = `
                <div>
                    <p class="font-semibold text-white">${offer.merchant}</p>
                    <p class="text-xs text-gray-400">${offer.completionRate}% completion • ${offer.trades} trades</p>
                </div>
                <div>
                    <p class="text-sm text-gray-400 uppercase tracking-wide">${offer.asset} Price</p>
                    <p class="text-2xl font-bold text-blue-400 font-mono">₦${offer.price.toLocaleString()}</p>
                </div>
                <div>
                    <p class="text-sm text-gray-400 uppercase tracking-wide">Limits</p>
                    <p class="text-lg font-semibold text-white">₦${offer.min.toLocaleString()} - ₦${offer.max.toLocaleString()}</p>
                    <p class="text-xs text-gray-500">${offer.paymentMethod}</p>
                </div>
                <div class="text-right">
                    <span class="inline-flex items-center text-xs px-3 py-1 rounded-full ${offer.type === 'buy' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-200'} mb-2">
                        ${offer.type === 'buy' ? 'Buying' : 'Selling'}
                    </span>
                    <button data-p2p-take="${offer.id}" class="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-all">
                        ${offer.type === 'buy' ? 'Sell crypto' : 'Buy crypto'}
                    </button>
                </div>
            `;
            fragment.appendChild(row);
        });

        this.p2pOfferContainer.innerHTML = '';
        this.p2pOfferContainer.appendChild(fragment);
    }

    createP2POffer(payload) {
        if (!this.p2pOfferContainer) return null;
        const offer = {
            id: this.generateP2POfferId(),
            type: payload.type === 'sell' ? 'sell' : 'buy',
            asset: payload.asset || 'USDT',
            price: Number(payload.price) || 0,
            min: Number(payload.min) || 0,
            max: Number(payload.max) || Number(payload.min) || 0,
            paymentMethod: payload.paymentMethod || 'Bank Transfer',
            merchant: payload.merchant || 'Desk Operator',
            completionRate: 100,
            trades: 0,
            note: payload.note || '',
            createdAt: new Date().toISOString()
        };

        this.p2pOffers.unshift(offer);
        this.saveP2POffers();
        this.renderP2POffers();
        this.renderP2PStats();
        this.showNotification('Offer published to the board.', 'success');
        return offer;
    }

    acceptP2POffer(offerId) {
        if (!this.p2pOfferContainer) return;
        const offer = this.p2pOffers.find(o => o.id === offerId);
        if (!offer) {
            this.showNotification('Offer no longer available.', 'error');
            return;
        }

        const amount = this.randomBetween(offer.min, offer.max);
        const trade = {
            id: this.generateP2PTradeId(),
            offerId: offer.id,
            merchant: offer.merchant,
            asset: offer.asset,
            type: offer.type,
            amount,
            price: offer.price,
            paymentMethod: offer.paymentMethod,
            releaseMinutes: this.randomBetween(8, 20),
            timestamp: new Date().toISOString()
        };

        offer.trades += 1;
        this.p2pTrades.unshift(trade);
        this.saveP2PTrades();
        this.saveP2POffers();
        this.renderP2PActivity();
        this.renderP2PStats();
        this.showNotification(`Escrow opened with ${offer.merchant}.`, 'success');
    }

    renderP2PActivity() {
        if (!this.p2pActivityContainer) return;
        const trades = this.p2pTrades.slice(0, 6);
        if (trades.length === 0) {
            this.p2pActivityContainer.innerHTML = '<p class="text-sm text-gray-400">No trades recorded yet.</p>';
            return;
        }

        const fragment = document.createDocumentFragment();
        trades.forEach(trade => {
            const row = document.createElement('div');
            row.className = 'activity-row';
            row.innerHTML = `
                <div>
                    <p class="text-white text-sm font-semibold">${trade.merchant}</p>
                    <p class="text-xs text-gray-400">${trade.type === 'buy' ? 'bought' : 'sold'} ${trade.asset} • ${trade.paymentMethod}</p>
                </div>
                <div class="text-right">
                    <p class="font-mono text-green-300">₦${trade.amount.toLocaleString()}</p>
                    <p class="text-xs text-gray-500">${new Date(trade.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
            `;
            fragment.appendChild(row);
        });

        this.p2pActivityContainer.innerHTML = '';
        this.p2pActivityContainer.appendChild(fragment);
    }

    renderP2PStats() {
        const volumeElement = document.getElementById('p2p-volume');
        const merchantsElement = document.getElementById('p2p-merchants');
        const releaseElement = document.getElementById('p2p-release');
        const escrowElement = document.getElementById('p2p-escrow');

        if (!volumeElement && !merchantsElement && !releaseElement && !escrowElement) {
            return;
        }

        const totalVolume = this.p2pTrades.reduce((sum, trade) => sum + (trade.amount || 0), 0);
        const merchants = new Set(this.p2pOffers.map(offer => offer.merchant)).size;
        const avgRelease = this.p2pTrades.length
            ? Math.round(this.p2pTrades.reduce((sum, trade) => sum + (trade.releaseMinutes || 15), 0) / this.p2pTrades.length)
            : 0;
        const avgCompletion = this.p2pOffers.length
            ? Math.round(this.p2pOffers.reduce((sum, offer) => sum + offer.completionRate, 0) / this.p2pOffers.length)
            : 0;

        if (volumeElement) volumeElement.textContent = this.formatFiat(totalVolume);
        if (merchantsElement) merchantsElement.textContent = merchants;
        if (releaseElement) releaseElement.textContent = `${avgRelease || 0}m`;
        if (escrowElement) escrowElement.textContent = `${avgCompletion}%`;
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
        this.updateWalletDisplay();
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
            const target = e.target instanceof Element ? e.target : null;
            if (!target) return;

            const actionTarget = target.closest('[data-action]');
            if (actionTarget) {
                this.handleAction(actionTarget.dataset.action, actionTarget);
            }

            const copyTarget = target.closest('[data-copy]');
            if (copyTarget?.dataset.copy) {
                this.copyText(copyTarget.dataset.copy, copyTarget.dataset.copyMessage || 'Copied to clipboard!');
            }
        });

        // Form submissions
        document.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission(e.target);
        });
    }

    handleAction(action, element) {
        switch (action) {
            case 'generate-wallet':
                if (typeof window !== 'undefined' && typeof window.showGenerateWalletModal === 'function') {
                    window.showGenerateWalletModal();
                }
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

    generateP2POfferId() {
        return 'P2P-OFF-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
    }

    generateP2PTradeId() {
        return 'P2P-TRD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
    }

    randomBetween(min, max) {
        const lower = Number(min) || 0;
        const upper = Number(max) || lower;
        if (upper <= lower) {
            return Math.max(lower, 0);
        }
        return Math.round(Math.random() * (upper - lower)) + lower;
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

    copyText(value, message = 'Copied to clipboard!') {
        if (!value || !navigator?.clipboard?.writeText) {
            this.showNotification('Clipboard not available on this device.', 'error');
            return;
        }

        navigator.clipboard.writeText(value).then(() => {
            this.showNotification(message, 'success');
        }).catch(() => {
            this.showNotification('Unable to copy text right now.', 'error');
        });
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
        
        this.saveWalletsToStorage();
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

    saveP2POffers() {
        localStorage.setItem('crypto-platform-p2p-offers', JSON.stringify(this.p2pOffers));
    }

    loadP2POffers() {
        const stored = localStorage.getItem('crypto-platform-p2p-offers');
        return stored ? JSON.parse(stored) : [];
    }

    saveP2PTrades() {
        localStorage.setItem('crypto-platform-p2p-trades', JSON.stringify(this.p2pTrades));
    }

    loadP2PTrades() {
        const stored = localStorage.getItem('crypto-platform-p2p-trades');
        return stored ? JSON.parse(stored) : [];
    }

    // UI Update Functions
    updateWalletDisplay() {
        const walletElements = document.querySelectorAll('.wallet-balance');
        walletElements.forEach(element => {
            const network = element.dataset.network;
            const wallet = this.wallets[network];
            if (!wallet) return;
            const meta = this.getNetworkMeta(network);
            element.textContent = this.formatCryptoBalance(wallet.balance, meta.symbol);
        });

        const fiatElements = document.querySelectorAll('.wallet-fiat');
        fiatElements.forEach(element => {
            const network = element.dataset.network;
            const wallet = this.wallets[network];
            if (!wallet) return;
            element.textContent = this.formatFiat(this.convertToNGN(wallet.balance, network));
        });

        this.updateWalletStats();
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
