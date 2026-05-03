// ===== SLIDESHOW =====
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');

function goToSlide(n) {
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = n;
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}
setInterval(() => goToSlide((currentSlide + 1) % slides.length), 5500);

// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');

window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 60));

function closeNav() {
  navLinks.classList.remove('active');
  hamburger.classList.remove('open');
  navOverlay.classList.remove('active');
  document.body.classList.remove('menu-open');
  document.querySelectorAll('.has-dropdown').forEach(d => d.classList.remove('open-dd'));
}

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('active');
  hamburger.classList.toggle('open');
  navOverlay.classList.toggle('active');
  document.body.classList.toggle('menu-open');
  if (!isOpen) document.querySelectorAll('.has-dropdown').forEach(d => d.classList.remove('open-dd'));
});

navOverlay.addEventListener('click', closeNav);

// Mobile dropdown toggle
document.querySelectorAll('.has-dropdown > a').forEach(link => {
  link.addEventListener('click', function(e) {
    if (window.innerWidth <= 900) {
      e.preventDefault();
      this.parentElement.classList.toggle('open-dd');
    }
  });
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    if (this.classList.contains('dd-arrow') || (this.parentElement.classList.contains('has-dropdown') && window.innerWidth <= 900)) return;
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      closeNav();
    }
  });
});

// ===== SCROLL REVEAL =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ===== MULTI-STEP FORM =====
let currentStep = 1;

function validateStep(step) {
  const stepForm = document.getElementById(`step${step}`);
  if (!stepForm) return true;
  let valid = true;
  stepForm.querySelectorAll('input, select, textarea').forEach(field => {
    if (field.getAttribute('data-required') !== 'false' && !field.value.trim()) {
      valid = false;
      field.classList.add('invalid');
      setTimeout(() => field.classList.remove('invalid'), 2400);
    }
  });
  return valid;
}

function scrollToForm() {
  const el = document.getElementById('apply');
  if (el) {
    const y = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
}

function showFormAlert(msg) {
  let alert = document.getElementById('formAlert');
  if (!alert) {
    alert = document.createElement('div');
    alert.id = 'formAlert';
    alert.className = 'form-alert';
    document.querySelector('.apply-form').prepend(alert);
  }
  alert.textContent = msg;
  alert.classList.add('show');
  setTimeout(() => alert.classList.remove('show'), 3500);
}

function nextStep(from) {
  if (!validateStep(from)) { showFormAlert('Please complete all required fields.'); return; }
  document.getElementById(`step${from}`).classList.remove('active');
  document.getElementById(`si-${from}`).classList.remove('active');
  document.getElementById(`si-${from}`).classList.add('completed');
  currentStep = from + 1;
  document.getElementById(`step${currentStep}`).classList.add('active');
  document.getElementById(`si-${currentStep}`).classList.add('active');
  scrollToForm();
}

function prevStep(from) {
  document.getElementById(`step${from}`).classList.remove('active');
  document.getElementById(`si-${from}`).classList.remove('active');
  currentStep = from - 1;
  document.getElementById(`step${currentStep}`).classList.add('active');
  document.getElementById(`si-${currentStep}`).classList.add('active');
  scrollToForm();
}

function submitApplication() {
  if (!validateStep(3)) { showFormAlert('Please complete all required fields.'); return; }
  const fn = document.getElementById('firstName').value.trim();
  const ln = document.getElementById('lastName').value.trim();
  console.log('Application submitted:', { fn, ln });
  const sn = document.getElementById('successName');
  if (sn) sn.textContent = `${fn} ${ln}`;
  document.querySelector('.apply-steps').style.display = 'none';
  document.querySelector('.apply-form').style.display = 'none';
  document.getElementById('successMsg').classList.add('show');
  scrollToForm();
  setTimeout(() => {
    document.querySelector('.apply-steps').style.display = '';
    document.querySelector('.apply-form').style.display = '';
    document.getElementById('successMsg').classList.remove('show');
    for (let i = 1; i <= 3; i++) {
      const s = document.getElementById(`step${i}`), si = document.getElementById(`si-${i}`);
      if (s) s.classList.remove('active');
      if (si) si.classList.remove('active', 'completed');
    }
    document.getElementById('step1').classList.add('active');
    document.getElementById('si-1').classList.add('active');
    ['firstName','lastName','dob','gender','district','applyClass','prevSchool','pleScore','combination','achievements','guardianName','relationship','phone','email','address','message'].forEach(id => { const f = document.getElementById(id); if (f) f.value = ''; });
    currentStep = 1;
  }, 9000);
}

// ===== AI CHAT =====
let chatOpen = false;
const responses = {
  apply: "Use the <strong>Online Admission</strong> form on this page. Fill in your details and our team will contact you within <strong>3–5 working days</strong>.",
  fees: "Contact our office at <strong>+256 752 462 598</strong> or <strong>info@rukoniss.ac.ug</strong> for the current fee structure.",
  location: "We're at <strong>Kakorogoto, Rukoni West, Ruhaama, Ntungamo District</strong>. P.O Box 04, Ntungamo. Mon–Fri 8AM–5PM.",
  leadership: "<strong>Mr. Mugoya Peter</strong> (Headteacher), <strong>Mrs. Gloria</strong> (Deputy), <strong>Mr. Atushabire Elvis</strong> (D.O.S).",
  programs: "O-Level (S.1–S.4) and A-Level combinations: PCB, PCM, HEG, MEG, HGL. Plus sports, debate, drama and music.",
  motto: "Our motto: <strong>&ldquo;Work and Never Tire&rdquo;</strong> — a call to relentless excellence.",
  default: "For detailed help, contact us at <strong>+256 752 462 598</strong> or <strong>info@rukoniss.ac.ug</strong>."
};

function getResponse(t) {
  t = t.toLowerCase();
  if (/\b(apply|admission|join|enrol|register)\b/.test(t)) return responses.apply;
  if (/\b(fee|cost|pay|tuition)\b/.test(t)) return responses.fees;
  if (/\b(locat|where|address|direction|map)\b/.test(t)) return responses.location;
  if (/\b(leader|staff|headteacher|principal|director)\b/.test(t)) return responses.leadership;
  if (/\b(program|subject|course|combination|offer|curriculum)\b/.test(t)) return responses.programs;
  if (/\b(motto|never tire)\b/.test(t)) return responses.motto;
  return responses.default;
}

function toggleChat() { chatOpen = !chatOpen; document.getElementById('chatPanel').classList.toggle('open', chatOpen); }
function addMessage(text, isUser) {
  const m = document.getElementById('chatMessages'), d = document.createElement('div');
  d.className = `msg ${isUser ? 'user' : 'bot'}`;
  d.innerHTML = `<div class="msg-bubble">${text}</div>`;
  m.appendChild(d); m.scrollTop = m.scrollHeight;
}
function showTyping() {
  const m = document.getElementById('chatMessages'), d = document.createElement('div');
  d.className = 'msg bot'; d.id = 'typing';
  d.innerHTML = '<div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>';
  m.appendChild(d); m.scrollTop = m.scrollHeight;
}
function removeTyping() { const t = document.getElementById('typing'); if (t) t.remove(); }
function sendChat() {
  const i = document.getElementById('chatInput'), t = i.value.trim();
  if (!t) return; addMessage(t, true); i.value = ''; showTyping();
  setTimeout(() => { removeTyping(); addMessage(getResponse(t), false); }, 1000);
}
function askQuestion(q) {
  if (!chatOpen) { chatOpen = true; document.getElementById('chatPanel').classList.add('open'); }
  addMessage(q, true); showTyping();
  setTimeout(() => { removeTyping(); addMessage(getResponse(q), false); }, 1000);
}
function handleKey(e) { if (e.key === 'Enter') sendChat(); }
