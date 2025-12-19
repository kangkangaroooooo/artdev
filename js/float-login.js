import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { firebaseConfig } from './firebase-config.js';
import { allowedEmails } from './google-acc.js';

// This module builds the popup and wires Google & Guest buttons to the behavior
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

document.addEventListener('DOMContentLoaded', () => {
  // ensure login.css is present so the login-failed styles are available
  (function ensureLoginCss(){
    try {
      var existing = document.querySelector('link[href*="login.css"]');
      if (!existing) {
        var ln = document.createElement('link');
        ln.rel = 'stylesheet';
        ln.href = '../css/login.css';
        document.head.appendChild(ln);
      }
    } catch (e) { /* ignore */ }
  })();
  function buildLoginModal() {
    const overlay = document.createElement('div');
    overlay.className = 'login-overlay';

    const card = document.createElement('div');
    card.className = 'login-card';
    card.style.position = 'relative';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'login-close';
    closeBtn.type = 'button';
    closeBtn.innerHTML = '✕';
    closeBtn.setAttribute('aria-label', 'Close');
    card.appendChild(closeBtn);

    // Build structure identical to login.html so CSS matches exactly
    var logo = document.createElement('img');
    logo.src = '';
    logo.alt = 'ArtDev';
    logo.className = 'login-logo';
    card.appendChild(logo);

    const title = document.createElement('h2');
    title.textContent = 'Welcome to ArtDev!';
    card.appendChild(title);

    const googleBtn = document.createElement('button');
    googleBtn.type = 'button';
    googleBtn.className = 'google-btn';
    googleBtn.textContent = 'Login with Google';

    const guestBtn = document.createElement('button');
    guestBtn.type = 'button';
    guestBtn.className = 'guest-btn';
    guestBtn.textContent = 'Continue as Guest';

    card.appendChild(googleBtn);
    card.appendChild(guestBtn);

    // login failed message box (hidden by default)
    const failBox = document.createElement('div');
    failBox.className = 'login-failed';
    failBox.innerHTML = '<span class="icon"></span><div class="msg"></div>';
    card.appendChild(failBox);

    // info note below buttons (same markup)
    var note = document.createElement('div');
    note.className = 'note';
    var noteP = document.createElement('p');
    noteP.textContent = 'Login access is limited to authorized personnel.';
    note.appendChild(noteP);
    card.appendChild(note);
    overlay.appendChild(card);

    // handlers
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closeModal(); });

    // Google sign-in
    googleBtn.addEventListener('click', () => {
      googleBtn.disabled = true;
      signInWithPopup(auth, provider)
        .then((result) => {
          const user = result.user;
          const email = user.email;

          if (!allowedEmails || !allowedEmails.includes(email)) {
            // show inline failure message
            const msg = failBox.querySelector('.msg');
            msg.textContent = 'This Google account is not authorized.';
            failBox.classList.add('show');
            setTimeout(() => failBox.classList.remove('show'), 4000);
            signOut(auth);
            googleBtn.disabled = false;
            return;
          }

          localStorage.setItem('artdevName', user.displayName || '');
          localStorage.setItem('artdevEmail', user.email || '');
          localStorage.setItem('artdevPic', user.photoURL || '');

          window.location.href = '../admin/index1.html';
        })
        .catch((error) => {
          console.error(error);
          // show inline failure message
          const msg = failBox.querySelector('.msg');
          msg.textContent = 'Login failed. Please try again.';
          failBox.classList.add('show');
          setTimeout(() => failBox.classList.remove('show'), 4000);
          googleBtn.disabled = false;
        });
    });

    // Guest
    guestBtn.addEventListener('click', () => {
      localStorage.setItem('artdevName', 'Guest User');
      localStorage.setItem('artdevEmail', 'guest@noemail.com');
      localStorage.setItem('artdevPic', 'images/default-guest.png');
      localStorage.setItem('artdevMode', 'guest');
      window.location.href = '../guest/index2.html';
    });

    function closeModal() {
      if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
      document.body.style.overflow = '';
    }

    return overlay;
  }

  function attach() {
    const buttons = document.querySelectorAll('.floating-login');
    if (!buttons || buttons.length === 0) return;
    buttons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const modal = buildLoginModal();
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
      });
    });
  }

  attach();
});

