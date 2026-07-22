(function () {
  const API = '/api';

  window.Auth = {
    token: () => localStorage.getItem('cc-auth-token'),

    user: () => {
      try {
        return JSON.parse(localStorage.getItem('cc-auth-user'));
      } catch {
        return null;
      }
    },

    headers: () => ({
      Authorization: `Bearer ${
        localStorage.getItem('cc-auth-token') || ''
      }`
    }),

    storageKey: (base) => {
      const user = window.Auth.user();
      return `${base}-${user?.id || 'guest'}`;
    },

    logout: () => {
      localStorage.removeItem('cc-auth-token');
      localStorage.removeItem('cc-auth-user');

      sessionStorage.clear();

      window.location.replace(window.location.pathname);
    }
  };

  async function submit(type, form, messageElement) {
    messageElement.textContent = '';

    const body = Object.fromEntries(
      new FormData(form).entries()
    );

    try {
      const response = await fetch(`${API}/auth/${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(
          data.message || 'Authentication failed'
        );
      }

      localStorage.setItem(
        'cc-auth-token',
        data.token
      );

      localStorage.setItem(
        'cc-auth-user',
        JSON.stringify(data.user)
      );

      window.location.reload();
    } catch (error) {
      messageElement.textContent = error.message;
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const authScreen =
      document.getElementById('auth-screen');

    const user = window.Auth.user();
    const token = window.Auth.token();

    if (token && user) {
      authScreen?.classList.add('hidden');

      const userName =
        document.getElementById('auth-user-name');

      if (userName) {
        userName.textContent = user.name;
      }

      return;
    }

    authScreen?.classList.remove('hidden');

    document
      .querySelectorAll('.auth-tab')
      .forEach((button) => {
        button.onclick = () => {
          document
            .querySelectorAll('.auth-tab, .auth-form')
            .forEach((element) => {
              element.classList.remove('active');
            });

          button.classList.add('active');

          const selectedForm =
            document.getElementById(
              `${button.dataset.tab}-form`
            );

          selectedForm?.classList.add('active');
        };
      });

    const loginForm =
      document.getElementById('login-form');

    const registerForm =
      document.getElementById('register-form');

    const authMessage =
      document.getElementById('auth-message');

    loginForm?.addEventListener(
      'submit',
      (event) => {
        event.preventDefault();

        submit(
          'login',
          loginForm,
          authMessage
        );
      }
    );

    registerForm?.addEventListener(
      'submit',
      (event) => {
        event.preventDefault();

        submit(
          'register',
          registerForm,
          authMessage
        );
      }
    );

    const logoutButton =
      document.getElementById('auth-logout');

    if (logoutButton) {
      logoutButton.type = 'button';

      logoutButton.addEventListener(
        'click',
        (event) => {
          event.preventDefault();
          event.stopPropagation();

          window.Auth.logout();
        }
      );
    }
  });
})();
