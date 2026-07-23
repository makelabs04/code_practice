(function () {
  const API = '/api';

  const get = (id) => document.getElementById(id);

  window.Auth = {
    token: () => localStorage.getItem('cc-auth-token'),

    user: () => {
      try {
        return JSON.parse(localStorage.getItem('cc-auth-user'));
      } catch {
        return null;
      }
    },

    isLoggedIn: () => Boolean(
      localStorage.getItem('cc-auth-token') &&
      localStorage.getItem('cc-auth-user')
    ),

    headers: () => {
      const token = localStorage.getItem('cc-auth-token');
      return token ? { Authorization: `Bearer ${token}` } : {};
    },

    storageKey: (base) => {
      const user = window.Auth.user();
      return `${base}-${user?.id || 'guest'}`;
    },

    open: (tab = 'login', message = '') => {
      const screen = get('auth-screen');
      if (!screen) return;
      screen.classList.remove('hidden');

      document.querySelectorAll('.auth-tab, .auth-form').forEach((el) => {
        el.classList.remove('active');
      });

      document.querySelector(`.auth-tab[data-tab="${tab}"]`)?.classList.add('active');
      get(`${tab}-form`)?.classList.add('active');

      const authMessage = get('auth-message');
      if (authMessage) authMessage.textContent = message;
    },

    close: () => get('auth-screen')?.classList.add('hidden'),

    logout: () => {
      localStorage.removeItem('cc-auth-token');
      localStorage.removeItem('cc-auth-user');
      sessionStorage.clear();
      window.location.replace(window.location.pathname);
    }
  };

  function updateHeader() {
    const loggedIn = window.Auth.isLoggedIn();
    const user = window.Auth.user();
    const userBox = get('auth-user-box');
    const guestActions = get('guest-auth-actions');
    const guestBanner = get('guest-mode-banner');

    userBox?.classList.toggle('hidden', !loggedIn);
    guestActions?.classList.toggle('hidden', loggedIn);
    guestBanner?.classList.toggle('hidden', loggedIn);

    if (loggedIn && get('auth-user-name')) {
      get('auth-user-name').textContent = user?.name || 'User';
    }
  }

  async function submit(type, form, messageElement) {
    messageElement.textContent = '';
    const body = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch(`${API}/auth/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Authentication failed');
      }

      localStorage.setItem('cc-auth-token', data.token);
      localStorage.setItem('cc-auth-user', JSON.stringify(data.user));
      window.location.reload();
    } catch (error) {
      messageElement.textContent = error.message;
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    updateHeader();
    window.Auth.close();

    document.querySelectorAll('.auth-tab').forEach((button) => {
      button.addEventListener('click', () => {
        document.querySelectorAll('.auth-tab, .auth-form').forEach((el) => {
          el.classList.remove('active');
        });
        button.classList.add('active');
        get(`${button.dataset.tab}-form`)?.classList.add('active');
      });
    });

    get('login-form')?.addEventListener('submit', (event) => {
      event.preventDefault();
      submit('login', event.currentTarget, get('auth-message'));
    });

    get('register-form')?.addEventListener('submit', (event) => {
      event.preventDefault();
      submit('register', event.currentTarget, get('auth-message'));
    });

    get('auth-close')?.addEventListener('click', window.Auth.close);
    get('continue-as-guest')?.addEventListener('click', window.Auth.close);
    get('guest-login-btn')?.addEventListener('click', () => window.Auth.open('login'));
    get('guest-register-btn')?.addEventListener('click', () => window.Auth.open('register'));
    get('guest-banner-login')?.addEventListener('click', () => window.Auth.open('login'));
    get('guest-banner-register')?.addEventListener('click', () => window.Auth.open('register'));
    get('auth-logout')?.addEventListener('click', (event) => {
      event.preventDefault();
      window.Auth.logout();
    });
  });
})();
