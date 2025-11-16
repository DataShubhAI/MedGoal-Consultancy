// scripts.js — form handling, nav toggle, small UX
document.addEventListener('DOMContentLoaded', () => {
  // year
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // mobile nav
  const navToggle = document.getElementById('nav-toggle');
  const navList = document.getElementById('nav-list');
  navToggle && navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    if (navList.style.display === 'flex') navList.style.display = 'none';
    else navList.style.display = 'flex';
  });

  // FORMSPREE: IMPORTANT - create a form on https://formspree.io/ (free) and copy your endpoint here:
  // Example endpoint: https://formspree.io/f/abcdxyz
  // After you paste it, form submissions will be delivered to medgoalconsultancy1@gmail.com
  const FORM_ENDPOINT = "REPLACE_WITH_YOUR_FORMSPREE_ENDPOINT";

  function showMessage(msg, ok = true) {
    const note = document.getElementById('form-note');
    if (!note) { alert(msg); return; }
    note.textContent = msg;
    note.style.color = ok ? 'green' : 'crimson';
    setTimeout(() => {
      note.textContent = 'We respect your privacy. This inquiry will be used only to contact you regarding admissions guidance.';
      note.style.color = '';
    }, 7000);
  }

  async function postToEndpoint(form) {
    const fd = new FormData(form);
    if (FORM_ENDPOINT && !FORM_ENDPOINT.includes("REPLACE_WITH_YOUR_FORMSPREE_ENDPOINT")) {
      try {
        const res = await fetch(FORM_ENDPOINT, {
          method: 'POST',
          body: fd,
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          form.reset();
          showMessage('Thanks — your enquiry was sent. We will contact you shortly.');
        } else {
          console.error('Form error', res.status);
          showMessage('Could not send — please try again or contact +91 72940 52983', false);
        }
      } catch (err) {
        console.error(err);
        showMessage('Network error — please contact +91 72940 52983', false);
      }
    } else {
      // fallback: open mail client with prefilled email
      const formData = Object.fromEntries(fd.entries());
      const subject = encodeURIComponent('New Inquiry from MedGoal Website');
      let body = '';
      Object.keys(formData).forEach(k => body += `${k}: ${formData[k]}\n`);
      window.location.href = `mailto:medgoalconsultancy1@gmail.com?subject=${subject}&body=${encodeURIComponent(body)}`;
      showMessage('If your email client opened, please send the message to complete the inquiry.');
    }
  }

  // hook forms
  const quickForm = document.getElementById('quick-form');
  const contactForm = document.getElementById('contact-form');

  [quickForm, contactForm].forEach(form => {
    if (!form) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      postToEndpoint(form);
      // local copy for quick review (localStorage)
      try {
        const arrKey = form.id === 'quick-form' ? 'medgoal_quick' : 'medgoal_contacts';
        const fd = new FormData(form);
        const obj = Object.fromEntries(fd.entries());
        obj.ts = Date.now();
        const arr = JSON.parse(localStorage.getItem(arrKey) || '[]');
        arr.push(obj);
        localStorage.setItem(arrKey, JSON.stringify(arr));
      } catch (err) {
        console.warn('local save failed', err);
      }
    });
  });

  // reset button
  const resetBtn = document.getElementById('reset-btn');
  if (resetBtn && contactForm) resetBtn.addEventListener('click', () => contactForm.reset());

  // smooth anchors
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', evt => {
      const href = a.getAttribute('href');
      if (href.length > 1 && href.startsWith('#')) {
        evt.preventDefault();
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (navList && window.innerWidth < 980) navList.style.display = 'none';
      }
    });
  });

});
