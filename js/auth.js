// Authentication system for Wasla

// Performance: Cache DOM elements
const domCache = new Map();

function getCachedElement(id) {
    if (!domCache.has(id)) {
        domCache.set(id, document.getElementById(id));
    }
    return domCache.get(id);
}

// User state
let currentUser = null;
let isAuthenticated = false;

// Initialize authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
});

function checkAuthStatus() {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('waslaUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        isAuthenticated = true;
        updateUIForAuthenticatedUser();
    } else {
        updateUIForUnauthenticatedUser();
    }
}

function updateUIForAuthenticatedUser() {
    // Hide auth button, show user menu
    const authButton = getCachedElement('auth-button');
    const userMenu = getCachedElement('user-menu');
    const mobileAuthButton = getCachedElement('mobile-auth-button');
    const mobileUserMenu = getCachedElement('mobile-user-menu');
    
    // Batch DOM updates
    requestAnimationFrame(() => {
        if (authButton) authButton.classList.add('hidden');
        if (userMenu) userMenu.classList.remove('hidden');
        if (mobileAuthButton) mobileAuthButton.classList.add('hidden');
        if (mobileUserMenu) mobileUserMenu.classList.remove('hidden');
    });
    
    // Update user info
    updateUserInfo();
}

function updateUIForUnauthenticatedUser() {
    // Show auth button, hide user menu
    const authButton = getCachedElement('auth-button');
    const userMenu = getCachedElement('user-menu');
    const mobileAuthButton = getCachedElement('mobile-auth-button');
    const mobileUserMenu = getCachedElement('mobile-user-menu');
    
    // Batch DOM updates
    requestAnimationFrame(() => {
        if (authButton) authButton.classList.remove('hidden');
        if (userMenu) userMenu.classList.add('hidden');
        if (mobileAuthButton) mobileAuthButton.classList.remove('hidden');
        if (mobileUserMenu) mobileUserMenu.classList.add('hidden');
    });
}

function updateUserInfo() {
    if (!currentUser) return;
    
    // Cache and batch DOM updates
    requestAnimationFrame(() => {
        const userNameElements = document.querySelectorAll('#user-name, #mobile-user-name');
        const userInitialsElements = document.querySelectorAll('#user-initials, #mobile-user-initials');
        const userCreditsElements = document.querySelectorAll('#user-credits, #mobile-user-credits, #balance-credits');
        
        const initials = getInitials(currentUser.name);
        
        userNameElements.forEach(el => el.textContent = currentUser.name);
        userInitialsElements.forEach(el => el.textContent = initials);
        userCreditsElements.forEach(el => el.textContent = currentUser.credits);
    });
}

// Memoize initials calculation
const initialsCache = new Map();

function getInitials(name) {
    if (initialsCache.has(name)) {
        return initialsCache.get(name);
    }
    
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
    initialsCache.set(name, initials);
    return initials;
}

// Optimized modal functions
function showAuthModal() {
    const modal = getCachedElement('auth-modal');
    if (modal) {
        modal.classList.remove('hidden');
        switchAuthTab('signup'); // Default to signup
    }
}

function hideAuthModal() {
    const modal = getCachedElement('auth-modal');
    if (modal) {
        modal.classList.add('hidden');
        clearAuthForms();
    }
}

// Country selection
function selectCountry(country) {
    if (country === 'egypt') {
        document.getElementById('country-selection').classList.add('hidden');
        localStorage.setItem('selectedCountry', 'egypt');
    } else {
        alert(currentLanguage === 'ar' 
            ? 'هذه الميزة ستكون متاحة قريباً للدول الأخرى!'
            : 'This feature will be available soon for other countries!'
        );
    }
}

// Authentication functions
function showAuthModal() {
    document.getElementById('auth-modal').classList.remove('hidden');
    switchAuthTab('signup'); // Default to signup
}

function hideAuthModal() {
    document.getElementById('auth-modal').classList.add('hidden');
    clearAuthForms();
}

function switchAuthTab(tab) {
    const signupTab = document.getElementById('signup-tab');
    const loginTab = document.getElementById('login-tab');
    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');
    const modalTitle = document.getElementById('auth-modal-title');
    const modalSubtitle = document.getElementById('auth-modal-subtitle');
    
    // Reset tab styles
    signupTab.classList.remove('active');
    loginTab.classList.remove('active');
    signupForm.classList.remove('active');
    loginForm.classList.remove('active');
    
    if (tab === 'signup') {
        signupTab.classList.add('active');
        signupForm.classList.add('active');
        modalTitle.textContent = currentLanguage === 'ar' ? 'إنشاء حساب جديد' : 'Create New Account';
        modalSubtitle.textContent = currentLanguage === 'ar' ? 'انضم إلى مجتمع وصلة واحصل على رصيد مجاني!' : 'Join Wasla community and get free credits!';
    } else {
        loginTab.classList.add('active');
        loginForm.classList.add('active');
        modalTitle.textContent = currentLanguage === 'ar' ? 'تسجيل الدخول' : 'Sign In';
        modalSubtitle.textContent = currentLanguage === 'ar' ? 'مرحباً بعودتك إلى وصلة!' : 'Welcome back to Wasla!';
    }
}

function handleSignup() {
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value.trim();
    const currency = document.getElementById('signup-currency').value;
    
    if (!name || !email || !password) {
        alert(currentLanguage === 'ar' 
            ? 'يرجى ملء جميع الحقول المطلوبة'
            : 'Please fill in all required fields'
        );
        return;
    }
    
    if (!isValidEmail(email)) {
        alert(currentLanguage === 'ar' 
            ? 'يرجى إدخال بريد إلكتروني صحيح'
            : 'Please enter a valid email address'
        );
        return;
    }
    
    if (password.length < 6) {
        alert(currentLanguage === 'ar' 
            ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'
            : 'Password must be at least 6 characters long'
        );
        return;
    }
    
    // Create user account
    currentUser = {
        id: generateUserId(),
        name: name,
        email: email,
        currency: currency,
        credits: 10, // Free signup credits
        joinDate: new Date().toISOString()
    };
    
    // Save to localStorage
    localStorage.setItem('waslaUser', JSON.stringify(currentUser));
    isAuthenticated = true;
    
    // Update UI
    updateUIForAuthenticatedUser();
    hideAuthModal();
    
    // Show success message
    alert(currentLanguage === 'ar' 
        ? 'تم إنشاء حسابك بنجاح! حصلت على 10 رصيد مجاني.'
        : 'Account created successfully! You received 10 free credits.'
    );
}

function handleLogin() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();
    
    if (!email || !password) {
        alert(currentLanguage === 'ar' 
            ? 'يرجى ملء جميع الحقول المطلوبة'
            : 'Please fill in all required fields'
        );
        return;
    }
    
    // For demo purposes, accept any valid email/password combination
    if (!isValidEmail(email)) {
        alert(currentLanguage === 'ar' 
            ? 'يرجى إدخال بريد إلكتروني صحيح'
            : 'Please enter a valid email address'
        );
        return;
    }
    
    // Simulate login (in real app, this would be API call)
    currentUser = {
        id: generateUserId(),
        name: 'محمد محمد', // Default name for demo
        email: email,
        currency: 'EGP',
        credits: 15,
        joinDate: new Date().toISOString()
    };
    
    // Save to localStorage
    localStorage.setItem('waslaUser', JSON.stringify(currentUser));
    isAuthenticated = true;
    
    // Update UI
    updateUIForAuthenticatedUser();
    hideAuthModal();
    
    // Show success message
    alert(currentLanguage === 'ar' 
        ? 'تم تسجيل الدخول بنجاح!'
        : 'Logged in successfully!'
    );
}

function logout() {
    currentUser = null;
    isAuthenticated = false;
    localStorage.removeItem('waslaUser');
    
    // Update UI
    updateUIForUnauthenticatedUser();
    
    // Redirect to home page
    showPage('home');
    
    alert(currentLanguage === 'ar' 
        ? 'تم تسجيل الخروج بنجاح'
        : 'Logged out successfully'
    );
}

function clearAuthForms() {
    // Clear signup form
    document.getElementById('signup-name').value = '';
    document.getElementById('signup-email').value = '';
    document.getElementById('signup-password').value = '';
    document.getElementById('signup-currency').value = 'EGP';
    
    // Clear login form
    document.getElementById('login-email').value = '';
    document.getElementById('login-password').value = '';
}

// Feature access control
function checkAuthAndNavigate(page) {
    if (!isAuthenticated) {
        showFeatureLockedModal();
        return;
    }
    
    // Check if user has enough credits for certain features
    if ((page === 'chatbot' || page === 'search') && currentUser.credits <= 0) {
        alert(currentLanguage === 'ar' 
            ? 'ليس لديك رصيد كافي. يرجى شراء المزيد من الرصيد.'
            : 'You don\'t have enough credits. Please purchase more credits.'
        );
        showPage('credits');
        return;
    }
    
    showPage(page);
}

function showFeatureLockedModal() {
    document.getElementById('feature-locked-modal').classList.remove('hidden');
}

function hideFeatureLockedModal() {
    document.getElementById('feature-locked-modal').classList.add('hidden');
}

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function generateUserId() {
    return 'user_' + Math.random().toString(36).substr(2, 9);
}

// Credit management
function deductCredit() {
    if (!isAuthenticated || !currentUser) return false;
    
    if (currentUser.credits <= 0) {
        alert(currentLanguage === 'ar' 
            ? 'ليس لديك رصيد كافي. يرجى شراء المزيد من الرصيد.'
            : 'You don\'t have enough credits. Please purchase more credits.'
        );
        showPage('credits');
        return false;
    }
    
    currentUser.credits--;
    localStorage.setItem('waslaUser', JSON.stringify(currentUser));
    updateUserInfo();
    return true;
}

function addCredits(amount) {
    if (!isAuthenticated || !currentUser) return;
    
    currentUser.credits += amount;
    localStorage.setItem('waslaUser', JSON.stringify(currentUser));
    updateUserInfo();
}

// Check if country selection was already made
document.addEventListener('DOMContentLoaded', function() {
    const selectedCountry = localStorage.getItem('selectedCountry');
    if (selectedCountry === 'egypt') {
        document.getElementById('country-selection').classList.add('hidden');
    }
});