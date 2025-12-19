document.addEventListener('DOMContentLoaded', function () {
  function doLogout(redirectPath) {
    try {
      // Clear stored user info used by the app
      localStorage.removeItem('artdevName');
      localStorage.removeItem('artdevEmail');
      localStorage.removeItem('artdevPic');
      localStorage.removeItem('artdevMode');

      // If Firebase auth is available, sign out gracefully
      if (window.firebase && window.firebase.auth) {
        try { window.firebase.auth().signOut(); } catch (e) { /* ignore */ }
      }
    } catch (e) {
      console.error('Logout cleanup failed', e);
    }

    // Default redirect: guest index1.html relative to many pages
    var target = redirectPath || '../guest/index2.html';
    window.location.href = target;
  }

  function attach() {
    var els = document.querySelectorAll('.floating-logout');
    if (!els || els.length === 0) return;
    els.forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        var override = el.getAttribute('data-redirect');
        doLogout(override);
      });
    });
  }

  attach();
});
