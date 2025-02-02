class Auth {
    constructor() {
        this.USERS_KEY = 'quranTracker_users';
        this.CURRENT_USER_KEY = 'quranTracker_currentUser';
        this.initializeUsers();
        this.setupAuthUI();
    }

    initializeUsers() {
        if (!localStorage.getItem(this.USERS_KEY)) {
            localStorage.setItem(this.USERS_KEY, JSON.stringify([]));
        }
    }

    setupAuthUI() {
        // Add auth UI to navbar
        const navContent = document.querySelector('.nav-content');
        const authDiv = document.createElement('div');
        authDiv.className = 'auth-buttons';
        
        if (this.getCurrentUser()) {
            authDiv.innerHTML = `
                <span class="user-name">مرحباً, ${this.getCurrentUser().name}</span>
                <button id="logoutBtn" class="button">تسجيل الخروج</button>
            `;
        } else {
            authDiv.innerHTML = `
                <button id="loginBtn" class="button">تسجيل الدخول</button>
                <button id="registerBtn" class="button">إنشاء حساب</button>
            `;
        }
        
        navContent.appendChild(authDiv);
        this.setupAuthListeners();
    }

    setupAuthListeners() {
        const loginBtn = document.getElementById('loginBtn');
        const registerBtn = document.getElementById('registerBtn');
        const logoutBtn = document.getElementById('logoutBtn');

        if (loginBtn) {
            loginBtn.addEventListener('click', () => this.showLoginModal());
        }
        if (registerBtn) {
            registerBtn.addEventListener('click', () => this.showRegisterModal());
        }
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
    }

    showLoginModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2>تسجيل الدخول</h2>
                <form id="loginForm">
                    <div class="form-group">
                        <label for="email">البريد الإلكتروني</label>
                        <input type="email" id="email" required>
                    </div>
                    <div class="form-group">
                        <label for="password">كلمة المرور</label>
                        <input type="password" id="password" required>
                    </div>
                    <button type="submit" class="button">تسجيل الدخول</button>
                </form>
            </div>
        `;

        document.body.appendChild(modal);
        this.setupModalListeners(modal);

        const loginForm = document.getElementById('loginForm');
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.login(
                loginForm.querySelector('#email').value,
                loginForm.querySelector('#password').value
            );
            modal.remove();
        });
    }

    showRegisterModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2>إنشاء حساب جديد</h2>
                <form id="registerForm">
                    <div class="form-group">
                        <label for="name">الاسم</label>
                        <input type="text" id="name" required>
                    </div>
                    <div class="form-group">
                        <label for="email">البريد الإلكتروني</label>
                        <input type="email" id="email" required>
                    </div>
                    <div class="form-group">
                        <label for="password">كلمة المرور</label>
                        <input type="password" id="password" required>
                    </div>
                    <button type="submit" class="button">إنشاء حساب</button>
                </form>
            </div>
        `;

        document.body.appendChild(modal);
        this.setupModalListeners(modal);

        const registerForm = document.getElementById('registerForm');
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.register(
                registerForm.querySelector('#name').value,
                registerForm.querySelector('#email').value,
                registerForm.querySelector('#password').value
            );
            modal.remove();
        });
    }

    setupModalListeners(modal) {
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }

    register(name, email, password) {
        const users = JSON.parse(localStorage.getItem(this.USERS_KEY));
        if (users.some(user => user.email === email)) {
            alert('هذا البريد الإلكتروني مسجل مسبقاً');
            return;
        }

        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password, // In a real app, this should be hashed
            settings: {
                dailyGoal: 5,
                theme: 'light'
            }
        };

        users.push(newUser);
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
        this.setCurrentUser(newUser);
        window.location.reload();
    }

    login(email, password) {
        const users = JSON.parse(localStorage.getItem(this.USERS_KEY));
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            this.setCurrentUser(user);
            window.location.reload();
        } else {
            alert('البريد الإلكتروني أو كلمة المرور غير صحيحة');
        }
    }

    logout() {
        localStorage.removeItem(this.CURRENT_USER_KEY);
        window.location.reload();
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem(this.CURRENT_USER_KEY));
    }

    setCurrentUser(user) {
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
    }
}