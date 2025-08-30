// Main application logic for Wasla

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Set initial time for chat
    const initialTime = document.getElementById('initial-time');
    if (initialTime) {
        initialTime.textContent = new Date().toLocaleTimeString();
    }
    
    // Load important stops
    loadImportantStops();
    
    // Load user routes
    loadUserRoutes();
    
    // Load credit packages
    loadCreditPackages();
    
    // Set up event listeners
    setupEventListeners();
    
    // Update translations
    updateTranslations();
    
    // Show home page by default
    showPage('home');
}

function setupEventListeners() {
    // Chat input enter key
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    // Search inputs enter key
    const originInput = document.getElementById('origin-input');
    const destinationInput = document.getElementById('destination-input');
    
    if (originInput && destinationInput) {
        [originInput, destinationInput].forEach(input => {
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    searchRoutes();
                }
            });
        });
    }
}

// Navigation functions
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const targetPage = document.getElementById(pageId + '-page');
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Update navigation active state
    updateNavigation(pageId);
}

function updateNavigation(activePageId) {
    // Update desktop navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === activePageId) {
            link.classList.add('active');
        }
    });
    
    // Update mobile navigation
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === activePageId) {
            link.classList.add('active');
        }
    });
}

function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const closeIcon = document.getElementById('close-icon');
    
    if (mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.remove('hidden');
        menuIcon.classList.add('hidden');
        closeIcon.classList.remove('hidden');
    } else {
        mobileMenu.classList.add('hidden');
        menuIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
    }
}

// Language toggle function
function toggleLanguage() {
    currentLanguage = currentLanguage === 'ar' ? 'en' : 'ar';
    updateTranslations();
    
    // Reload dynamic content
    loadImportantStops();
    loadUserRoutes();
    loadCreditPackages();
}

// ChatBot functions
function sendMessage() {
    // Check authentication and credits
    if (!deductCredit()) {
        return;
    }
    
    const chatInput = document.getElementById('chat-input');
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    // Add user message
    addChatMessage(message, true);
    chatInput.value = '';
    
    // Show loading
    showChatLoading();
    
    // Simulate bot response
    setTimeout(() => {
        hideChatLoading();
        const botResponse = currentLanguage === 'ar' 
            ? 'وجدت عدة طرق لك من مدينة نصر إلى مدينة 6 أكتوبر:'
            : 'I found several routes for you from Nasr City to 6th of October City:';
        addChatMessage(botResponse, false);
        
        // Add route options
        setTimeout(() => {
            addRouteOptions();
        }, 500);
    }, 1500);
}

function addChatMessage(text, isUser) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${isUser ? 'user' : 'bot'}`;
    
    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = `message-bubble ${isUser ? 'user' : 'bot'}`;
    
    const textP = document.createElement('p');
    textP.className = 'text-sm';
    textP.textContent = text;
    
    const timeDiv = document.createElement('div');
    timeDiv.className = 'text-xs opacity-70 mt-1';
    timeDiv.textContent = new Date().toLocaleTimeString();
    
    bubbleDiv.appendChild(textP);
    bubbleDiv.appendChild(timeDiv);
    messageDiv.appendChild(bubbleDiv);
    messagesContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function showChatLoading() {
    const messagesContainer = document.getElementById('chat-messages');
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'chat-loading';
    loadingDiv.className = 'chat-message bot';
    loadingDiv.innerHTML = `
        <div class="message-bubble bot">
            <div class="loading-dots">
                <div class="loading-dot"></div>
                <div class="loading-dot"></div>
                <div class="loading-dot"></div>
            </div>
        </div>
    `;
    messagesContainer.appendChild(loadingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function hideChatLoading() {
    const loadingDiv = document.getElementById('chat-loading');
    if (loadingDiv) {
        loadingDiv.remove();
    }
}

function addRouteOptions() {
    const messagesContainer = document.getElementById('chat-messages');
    const routeOptionsDiv = document.createElement('div');
    routeOptionsDiv.className = 'space-y-4';
    
    const routes = [
        {
            duration: '1h 45m',
            cost: '15 EGP',
            steps: currentLanguage === 'ar' ? [
                'امشي إلى محطة مترو مدينة نصر (5 دقائق)',
                'اركب مترو الخط 3 إلى العتبة (25 دقيقة)',
                'انتقل إلى مترو الخط 2 باتجاه الجيزة (15 دقيقة)',
                'انزل في محطة الجيزة',
                'اركب ميكروباص #927 إلى 6 أكتوبر (45 دقيقة)',
                'امشي إلى الوجهة (10 دقائق)'
            ] : [
                'Walk to Nasr City Metro Station (5 min)',
                'Take Metro Line 3 to Attaba (25 min)',
                'Transfer to Metro Line 2 toward Giza (15 min)',
                'Exit at Giza Station',
                'Take Microbus #927 to 6th October (45 min)',
                'Walk to destination (10 min)'
            ],
            modes: ['Walk', 'Metro', 'Microbus']
        },
        {
            duration: '2h 15m',
            cost: '12 EGP',
            steps: currentLanguage === 'ar' ? [
                'امشي إلى موقف الأتوبيس في مدينة نصر (8 دقائق)',
                'اركب أتوبيس #174 إلى رمسيس (35 دقيقة)',
                'انتقل إلى أتوبيس #381 باتجاه 6 أكتوبر (ساعة و20 دقيقة)',
                'امشي إلى الوجهة (12 دقيقة)'
            ] : [
                'Walk to Nasr City Bus Stop (8 min)',
                'Take Bus #174 to Ramses (35 min)',
                'Transfer to Bus #381 toward 6th October (1h 20 min)',
                'Walk to destination (12 min)'
            ],
            modes: ['Walk', 'Bus']
        }
    ];
    
    routes.forEach((route, routeIndex) => {
        const routeDiv = document.createElement('div');
        routeDiv.className = 'bg-yellow-50 border border-yellow-200 rounded-lg p-4';
        
        const headerDiv = document.createElement('div');
        headerDiv.className = 'flex items-center justify-between mb-3';
        
        const infoDiv = document.createElement('div');
        infoDiv.className = 'flex items-center space-x-4';
        infoDiv.innerHTML = `
            <div class="flex items-center text-gray-600">
                <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="text-sm">${route.duration}</span>
            </div>
            <div class="flex items-center text-gray-600">
                <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
                <span class="text-sm">${route.cost}</span>
            </div>
        `;
        
        const modesDiv = document.createElement('div');
        modesDiv.className = 'flex space-x-1';
        route.modes.forEach(mode => {
            const modeSpan = document.createElement('span');
            modeSpan.className = 'px-2 py-1 bg-yellow-200 text-yellow-800 text-xs rounded-full';
            modeSpan.textContent = mode;
            modesDiv.appendChild(modeSpan);
        });
        
        headerDiv.appendChild(infoDiv);
        headerDiv.appendChild(modesDiv);
        
        const stepsDiv = document.createElement('div');
        stepsDiv.className = 'space-y-2';
        
        route.steps.forEach((step, index) => {
            const stepDiv = document.createElement('div');
            stepDiv.className = 'flex items-start';
            stepDiv.innerHTML = `
                <div class="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs mr-3 mt-0.5">
                    ${index + 1}
                </div>
                <p class="text-sm text-gray-700">${step}</p>
            `;
            stepsDiv.appendChild(stepDiv);
        });
        
        routeDiv.appendChild(headerDiv);
        routeDiv.appendChild(stepsDiv);
        routeOptionsDiv.appendChild(routeDiv);
    });
    
    messagesContainer.appendChild(routeOptionsDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Search functions
function searchRoutes() {
    // Check authentication and credits
    if (!deductCredit()) {
        return;
    }
    
    const origin = document.getElementById('origin-input').value.trim();
    const destination = document.getElementById('destination-input').value.trim();
    
    if (!origin || !destination) return;
    
    const resultsContainer = document.getElementById('search-results');
    const resultsDiv = document.getElementById('results-container');
    
    // Show loading
    resultsDiv.innerHTML = `
        <div class="text-center py-8">
            <div class="loading-dots mx-auto mb-4">
                <div class="loading-dot"></div>
                <div class="loading-dot"></div>
                <div class="loading-dot"></div>
            </div>
            <p class="text-gray-600">${t('searching')}</p>
        </div>
    `;
    resultsContainer.classList.remove('hidden');
    
    // Simulate search
    setTimeout(() => {
        displaySearchResults();
    }, 2000);
}

function displaySearchResults() {
    const resultsDiv = document.getElementById('results-container');
    
    const mockResults = [
        {
            id: '1',
            duration: '1h 30m',
            cost: '18 EGP',
            distance: '45 km',
            steps: currentLanguage === 'ar' ? [
                { instruction: 'امشي إلى أقرب محطة مترو', mode: 'مشي', duration: '5 دقائق' },
                { instruction: 'اركب مترو الخط 1 إلى السادات', mode: 'مترو', duration: '25 دقيقة' },
                { instruction: 'انتقل إلى مترو الخط 2', mode: 'مترو', duration: '5 دقائق' },
                { instruction: 'اركب مترو الخط 2 إلى الجيزة', mode: 'مترو', duration: '20 دقيقة' },
                { instruction: 'اركب أتوبيس #381 إلى الوجهة', mode: 'أتوبيس', duration: '35 دقيقة' }
            ] : [
                { instruction: 'Walk to nearest Metro station', mode: 'Walk', duration: '5 min' },
                { instruction: 'Take Metro Line 1 to Sadat', mode: 'Metro', duration: '25 min' },
                { instruction: 'Transfer to Metro Line 2', mode: 'Metro', duration: '5 min' },
                { instruction: 'Take Metro Line 2 to Giza', mode: 'Metro', duration: '20 min' },
                { instruction: 'Take Bus #381 to destination', mode: 'Bus', duration: '35 min' }
            ]
        }
    ];
    
    resultsDiv.innerHTML = '';
    
    mockResults.forEach((route, index) => {
        const routeDiv = document.createElement('div');
        routeDiv.className = 'route-card';
        
        const headerDiv = document.createElement('div');
        headerDiv.className = 'flex items-center justify-between mb-4';
        headerDiv.innerHTML = `
            <h3 class="text-lg font-semibold text-gray-900">${currentLanguage === 'ar' ? 'الطريق' : 'Route'} ${index + 1}</h3>
            <div class="flex items-center space-x-4 text-sm text-gray-600">
                <div class="flex items-center">
                    <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>${route.duration}</span>
                </div>
                <div class="flex items-center">
                    <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                    </svg>
                    <span>${route.cost}</span>
                </div>
                <div class="text-gray-500">${route.distance}</div>
            </div>
        `;
        
        const stepsDiv = document.createElement('div');
        stepsDiv.className = 'space-y-3';
        
        route.steps.forEach((step, stepIndex) => {
            const stepDiv = document.createElement('div');
            stepDiv.className = 'flex items-start';
            stepDiv.innerHTML = `
                <div class="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm mr-4">
                    ${stepIndex + 1}
                </div>
                <div class="flex-1">
                    <p class="text-gray-900">${step.instruction}</p>
                    <div class="flex items-center mt-1">
                        <span class="px-2 py-1 rounded-full text-xs mr-2 ${getModeColor(step.mode)}">
                            ${step.mode}
                        </span>
                        <span class="text-gray-500 text-sm">${step.duration}</span>
                    </div>
                </div>
            `;
            stepsDiv.appendChild(stepDiv);
        });
        
        routeDiv.appendChild(headerDiv);
        routeDiv.appendChild(stepsDiv);
        resultsDiv.appendChild(routeDiv);
    });
}

function getModeColor(mode) {
    const modeColors = {
        'Metro': 'bg-blue-100 text-blue-800',
        'مترو': 'bg-blue-100 text-blue-800',
        'Bus': 'bg-green-100 text-green-800',
        'أتوبيس': 'bg-green-100 text-green-800',
        'Microbus': 'bg-purple-100 text-purple-800',
        'ميكروباص': 'bg-purple-100 text-purple-800',
        'Walk': 'bg-gray-100 text-gray-800',
        'مشي': 'bg-gray-100 text-gray-800'
    };
    return modeColors[mode] || 'bg-gray-100 text-gray-800';
}

// Important Stops functions
function loadImportantStops() {
    const stopsGrid = document.getElementById('stops-grid');
    if (!stopsGrid) return;
    
    const stops = [
        {
            id: 'ramses',
            name: currentLanguage === 'ar' ? 'محطة رمسيس' : 'Ramses Station',
            nameSecondary: currentLanguage === 'ar' ? 'Ramses Station' : 'محطة رمسيس',
            description: currentLanguage === 'ar' 
                ? 'محور السكك الحديدية والمترو الرئيسي الذي يربط القاهرة ببقية مصر'
                : 'Major railway and metro hub connecting Cairo with rest of Egypt',
            connections: currentLanguage === 'ar' 
                ? ['مترو الخط 2', 'السكك الحديدية الوطنية', '50+ خط أتوبيس']
                : ['Metro Line 2', 'National Railway', '50+ Bus Lines'],
            imageUrl: 'https://images.pexels.com/photos/2935687/pexels-photo-2935687.jpeg',
            routes: 75,
            isMetroStation: true,
        },
        {
            id: 'tahrir',
            name: currentLanguage === 'ar' ? 'ميدان التحرير' : 'Tahrir Square',
            nameSecondary: currentLanguage === 'ar' ? 'Tahrir Square' : 'ميدان التحرير',
            description: currentLanguage === 'ar'
                ? 'الميدان التاريخي المركزي مع شبكات واسعة من الأتوبيسات والميكروباصات'
                : 'Historic central square with extensive bus and microbus networks',
            connections: currentLanguage === 'ar'
                ? ['مترو الخط 2', '30+ خط أتوبيس', '20+ خط ميكروباص']
                : ['Metro Line 2', '30+ Bus Lines', '20+ Microbus Lines'],
            imageUrl: 'https://images.pexels.com/photos/2363807/pexels-photo-2363807.jpeg',
            routes: 65,
            isMetroStation: true,
        },
        {
            id: 'aboud',
            name: currentLanguage === 'ar' ? 'عبود' : 'Aboud',
            nameSecondary: currentLanguage === 'ar' ? 'Aboud' : 'عبود',
            description: currentLanguage === 'ar'
                ? 'تقاطع مواصلات رئيسي في الجيزة يربط بالمناطق الغربية'
                : 'Key transportation junction in Giza connecting to western regions',
            connections: currentLanguage === 'ar'
                ? ['15+ خط أتوبيس', '25+ خط ميكروباص']
                : ['15+ Bus Lines', '25+ Microbus Lines'],
            imageUrl: 'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg',
            routes: 45,
            isMetroStation: false,
        }
    ];
    
    stopsGrid.innerHTML = '';
    
    stops.forEach(stop => {
        const stopDiv = document.createElement('div');
        stopDiv.className = 'stop-card';
        stopDiv.onclick = () => showStopDetails(stop.id);
        
        stopDiv.innerHTML = `
            <div class="relative h-48 overflow-hidden">
                <img src="${stop.imageUrl}" alt="${stop.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div class="absolute bottom-4 left-4 text-white">
                    <h3 class="text-xl font-bold">${stop.name}</h3>
                    <p class="text-sm opacity-90">${stop.nameSecondary}</p>
                </div>
                ${stop.isMetroStation ? `
                    <div class="absolute top-4 right-4">
                        <svg class="h-6 w-6 text-white bg-blue-600 p-1 rounded" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                        </svg>
                    </div>
                ` : ''}
            </div>
            <div class="p-6">
                <p class="text-gray-600 text-sm mb-4">${stop.description}</p>
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center text-yellow-600">
                        <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                        </svg>
                        <span class="text-sm font-medium">${stop.routes} ${currentLanguage === 'ar' ? 'طريق' : 'Routes'}</span>
                    </div>
                    <svg class="h-4 w-4 text-gray-400 group-hover:text-yellow-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                </div>
                <div>
                    <h4 class="text-sm font-medium text-gray-900 mb-2">${currentLanguage === 'ar' ? 'أنواع المواصلات' : 'Transportation Types'}</h4>
                    <div class="flex flex-wrap gap-1">
                        ${stop.connections.map(connection => `
                            <span class="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                ${connection}
                            </span>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        stopsGrid.appendChild(stopDiv);
    });
}

function showStopDetails(stopId) {
    alert(currentLanguage === 'ar' 
        ? 'تفاصيل المحطة ستظهر هنا قريباً'
        : 'Stop details will be shown here soon'
    );
}

// User Routes functions
function loadUserRoutes() {
    const container = document.getElementById('user-routes-container');
    if (!container) return;
    
    const routes = [
        {
            id: '1',
            name: currentLanguage === 'ar' 
                ? 'ميكروباص سريع - القاهرة الجديدة إلى وسط البلد'
                : 'Express Microbus - New Cairo to Downtown',
            origin: currentLanguage === 'ar' ? 'القاهرة الجديدة' : 'New Cairo',
            destination: currentLanguage === 'ar' ? 'وسط القاهرة' : 'Downtown Cairo',
            fare: '12 EGP',
            duration: '45 min',
            type: currentLanguage === 'ar' ? 'ميكروباص' : 'Microbus',
            submittedBy: 'Ahmed M.',
            votes: { up: 24, down: 3 },
            status: 'approved'
        },
        {
            id: '2',
            name: currentLanguage === 'ar'
                ? 'أتوبيس ليلي - المعادي إلى المطار'
                : 'Night Bus - Maadi to Airport',
            origin: currentLanguage === 'ar' ? 'المعادي' : 'Maadi',
            destination: currentLanguage === 'ar' ? 'مطار القاهرة' : 'Cairo Airport',
            fare: '25 EGP',
            duration: '1h 15m',
            type: currentLanguage === 'ar' ? 'أتوبيس' : 'Bus',
            submittedBy: 'Sara K.',
            votes: { up: 18, down: 2 },
            status: 'pending'
        }
    ];
    
    container.innerHTML = '';
    
    routes.forEach(route => {
        const routeDiv = document.createElement('div');
        routeDiv.className = 'bg-white rounded-xl shadow-lg p-6 mb-4';
        
        const statusColor = getStatusColor(route.status);
        const typeColor = getTypeColor(route.type);
        
        routeDiv.innerHTML = `
            <div class="flex items-start justify-between mb-4">
                <div class="flex-1">
                    <div class="flex items-center space-x-3 mb-2">
                        <span class="px-2 py-1 rounded-full text-white text-xs ${typeColor}">
                            ${route.type}
                        </span>
                        <span class="px-2 py-1 rounded-full text-xs capitalize ${statusColor}">
                            ${getStatusText(route.status)}
                        </span>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-1">${route.name}</h3>
                    <p class="text-gray-600 text-sm">${route.origin} → ${route.destination}</p>
                </div>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                <div class="flex items-center text-gray-600">
                    <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                    </svg>
                    <span>${route.fare}</span>
                </div>
                <div class="flex items-center text-gray-600">
                    <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>${route.duration}</span>
                </div>
                <div class="flex items-center text-gray-600">
                    <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    <span>${route.submittedBy}</span>
                </div>
            </div>
            <div class="flex items-center space-x-4">
                <button onclick="voteRoute('${route.id}', 'up')" class="flex items-center space-x-1 px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
                    </svg>
                    <span>${route.votes.up}</span>
                </button>
                <button onclick="voteRoute('${route.id}', 'down')" class="flex items-center space-x-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v2a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10H9a2 2 0 00-2 2v6a2 2 0 002 2h2.5"></path>
                    </svg>
                    <span>${route.votes.down}</span>
                </button>
            </div>
        `;
        
        container.appendChild(routeDiv);
    });
}

function getStatusColor(status) {
    const colors = {
        'approved': 'bg-green-100 text-green-800',
        'pending': 'bg-yellow-100 text-yellow-800',
        'rejected': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
}

function getStatusText(status) {
    const statusTexts = {
        ar: {
            'approved': 'موافق عليه',
            'pending': 'في الانتظار',
            'rejected': 'مرفوض'
        },
        en: {
            'approved': 'Approved',
            'pending': 'Pending',
            'rejected': 'Rejected'
        }
    };
    return statusTexts[currentLanguage][status] || status;
}

function getTypeColor(type) {
    const colors = {
        'Metro': 'bg-blue-500',
        'مترو': 'bg-blue-500',
        'Bus': 'bg-green-500',
        'أتوبيس': 'bg-green-500',
        'Microbus': 'bg-purple-500',
        'ميكروباص': 'bg-purple-500'
    };
    return colors[type] || 'bg-gray-500';
}

function voteRoute(routeId, voteType) {
    console.log(`Voting ${voteType} for route ${routeId}`);
    alert(currentLanguage === 'ar' ? 'شكراً لتصويتك!' : 'Thank you for voting!');
}

// Modal functions
function showAddRouteModal() {
    document.getElementById('add-route-modal').classList.remove('hidden');
}

function hideAddRouteModal() {
    document.getElementById('add-route-modal').classList.add('hidden');
    // Clear form
    document.getElementById('route-name').value = '';
    document.getElementById('route-origin').value = '';
    document.getElementById('route-destination').value = '';
}

function submitRoute() {
    const name = document.getElementById('route-name').value.trim();
    const origin = document.getElementById('route-origin').value.trim();
    const destination = document.getElementById('route-destination').value.trim();
    
    if (!name || !origin || !destination) {
        alert(currentLanguage === 'ar' 
            ? 'يرجى ملء جميع الحقول المطلوبة'
            : 'Please fill in all required fields'
        );
        return;
    }
    
    alert(currentLanguage === 'ar' 
        ? 'تم إرسال الطريق بنجاح! سيتم مراجعته قريباً.'
        : 'Route submitted successfully! It will be reviewed soon.'
    );
    
    hideAddRouteModal();
}

// Credits functions
function loadCreditPackages() {
    const container = document.getElementById('credit-packages');
    if (!container) return;
    
    const packages = [
        {
            id: 'basic',
            name: currentLanguage === 'ar' ? 'الباقة الأساسية' : 'Basic Pack',
            credits: 20,
            price: 10,
        },
        {
            id: 'standard',
            name: currentLanguage === 'ar' ? 'الباقة المعيارية' : 'Standard Pack',
            credits: 50,
            price: 20,
            popular: true,
            bonus: currentLanguage === 'ar' ? '+5 رصيد إضافي' : '+5 bonus credits',
        },
        {
            id: 'premium',
            name: currentLanguage === 'ar' ? 'الباقة المميزة' : 'Premium Pack',
            credits: 100,
            price: 35,
            bonus: currentLanguage === 'ar' ? '+15 رصيد إضافي' : '+15 bonus credits',
        },
    ];
    
    container.innerHTML = '';
    
    packages.forEach(pkg => {
        const packageDiv = document.createElement('div');
        packageDiv.className = `credit-package ${pkg.popular ? 'popular' : ''}`;
        
        packageDiv.innerHTML = `
            ${pkg.popular ? `
                <div class="popular-badge">
                    <svg class="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    ${currentLanguage === 'ar' ? 'الأكثر شعبية' : 'Most Popular'}
                </div>
            ` : ''}
            
            <div class="text-center">
                <h3 class="text-xl font-bold text-gray-900 mb-2">${pkg.name}</h3>
                <div class="text-3xl font-bold text-yellow-600 mb-1">${pkg.credits}</div>
                <div class="text-gray-600 mb-4">${currentLanguage === 'ar' ? 'رصيد' : 'Credits'}</div>
                
                ${pkg.bonus ? `
                    <div class="bg-green-50 text-green-800 px-3 py-1 rounded-full text-sm mb-4">
                        ${pkg.bonus}
                    </div>
                ` : ''}
                
                <div class="text-2xl font-bold text-gray-900 mb-6">${pkg.price} EGP</div>
                
                <button onclick="purchaseCredits('${pkg.id}')" class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                    <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                    </svg>
                    ${currentLanguage === 'ar' ? 'شراء' : 'Purchase'}
                </button>
            </div>
        `;
        
        container.appendChild(packageDiv);
    });
}

function purchaseCredits(packageId) {
    if (!isAuthenticated) {
        showFeatureLockedModal();
        return;
    }
    
    // Get package details
    const packages = {
        'basic': { credits: 20, price: 10 },
        'standard': { credits: 55, price: 20 }, // 50 + 5 bonus
        'premium': { credits: 115, price: 35 }  // 100 + 15 bonus
    };
    
    const selectedPackage = packages[packageId];
    if (!selectedPackage) return;
    
    // Simulate payment process
    const confirmPurchase = confirm(
        currentLanguage === 'ar' 
            ? `هل تريد شراء ${selectedPackage.credits} رصيد مقابل ${selectedPackage.price} ${currentUser.currency}؟`
            : `Do you want to purchase ${selectedPackage.credits} credits for ${selectedPackage.price} ${currentUser.currency}?`
    );
    
    if (confirmPurchase) {
        // Add credits to user account
        addCredits(selectedPackage.credits);
        
        alert(currentLanguage === 'ar' 
            ? `تم شراء ${selectedPackage.credits} رصيد بنجاح!`
            : `Successfully purchased ${selectedPackage.credits} credits!`
        );
    }
}