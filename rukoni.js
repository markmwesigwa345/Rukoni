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
setInterval(() => goToSlide((currentSlide + 1) % slides.length), 3000); // Fast 3-second interval

// ===== NAVBAR & SCROLL FEATURES =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  if (window.scrollY > 400) {
    backToTopBtn.classList.add('show');
  } else {
    backToTopBtn.classList.remove('show');
  }
});

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

// ===== SCROLL REVEAL & COUNTERS =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      // Counter animation
      const counters = e.target.querySelectorAll('.counter');
      counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
          current += increment;
          if (current < target) {
            counter.innerText = Math.ceil(current);
            requestAnimationFrame(updateCounter);
          } else {
            counter.innerText = target;
          }
        };
        updateCounter();
        counter.classList.remove('counter'); // Prevent re-animating
      });
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal, .hero-content').forEach(el => observer.observe(el));

// ===== MULTI-STEP SMART FORM =====
let currentStep = 1;

function toggleSubjectSelection() {
  const classVal = document.getElementById('applyClass').value;
  const olevelSec = document.getElementById('olevelSection');
  const alevelSec = document.getElementById('alevelSection');
  const alevelBranch = document.getElementById('alevelBranch');
  const combination = document.getElementById('combination');
  
  if (classVal === 'o-level') {
    olevelSec.style.display = 'block';
    alevelSec.style.display = 'none';
    if(alevelBranch) alevelBranch.setAttribute('data-required', 'false');
    if(combination) combination.setAttribute('data-required', 'false');
  } else if (classVal === 'a-level') {
    olevelSec.style.display = 'none';
    alevelSec.style.display = 'block';
    if(alevelBranch) alevelBranch.setAttribute('data-required', 'true');
    toggleAlevelBranch();
  } else {
    olevelSec.style.display = 'none';
    alevelSec.style.display = 'none';
    if(alevelBranch) alevelBranch.setAttribute('data-required', 'false');
    if(combination) combination.setAttribute('data-required', 'false');
  }
}

const sciCombos = ['PCB (Physics, Chemistry, Biology)', 'PCM (Physics, Chemistry, Maths)', 'BCM (Biology, Chemistry, Maths)', 'PEM (Physics, Economics, Maths)', 'BCA (Biology, Chemistry, Agriculture)', 'MEG (Maths, Economics, Geography)'];
const artCombos = ['HEG (History, Economics, Geography)', 'HGL (History, Geography, Literature)', 'HEL (History, Economics, Literature)', 'DEG (Divinity, Economics, Geography)', 'LEG (Literature, Economics, Geography)'];

function toggleAlevelBranch() {
  const branch = document.getElementById('alevelBranch') ? document.getElementById('alevelBranch').value : '';
  const comboGroup = document.getElementById('comboGroup');
  const combination = document.getElementById('combination');
  
  if (!comboGroup || !combination) return;

  if (!branch) {
    comboGroup.style.display = 'none';
    combination.setAttribute('data-required', 'false');
    return;
  }
  
  comboGroup.style.display = 'flex';
  combination.setAttribute('data-required', 'true');
  
  // Populate options
  combination.innerHTML = '<option value="">Select combination</option>';
  const list = branch === 'sciences' ? sciCombos : artCombos;
  list.forEach(c => {
    const opt = document.createElement('option');
    opt.value = opt.textContent = c;
    combination.appendChild(opt);
  });
}

function validateStep(step) {
  const stepForm = document.getElementById(`step${step}`);
  if (!stepForm) return true;
  let valid = true;
  stepForm.querySelectorAll('input, select, textarea').forEach(field => {
    // Only validate visible fields
    if (field.offsetParent !== null && field.getAttribute('data-required') !== 'false' && !field.value.trim()) {
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
  
  // Hide form steps
  document.querySelector('.apply-steps').style.display = 'none';
  document.querySelector('.apply-form').style.display = 'none';
  
  // Show success message
  document.getElementById('successMsg').classList.add('show');
  scrollToForm();
  
  // Reset form after delay
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
    
    // Clear inputs
    ['firstName','lastName','dob','gender','district','applyClass','prevSchool','pleScore','combination','achievements','guardianName','relationship','phone','email','address','message'].forEach(id => { 
      const f = document.getElementById(id); 
      if (f) f.value = ''; 
    });
    // Clear checkboxes
    document.querySelectorAll('.subject-checkboxes input[type="checkbox"]:not(:disabled)').forEach(cb => cb.checked = false);
    toggleSubjectSelection();
    
    currentStep = 1;
  }, 9000);
}

// ===== AI CHAT =====
let chatOpen = false;
const responses = {
  apply: "Use the <strong>Online Admission</strong> form on this page. Fill in your details and our team will contact you within <strong>3–5 working days</strong>.",
  fees: "Contact our office at <strong>+256 782 879 068</strong> or <strong>rukonisecondaryschool@yahoo.com</strong> for the current fee structure.",
  location: "We're at <strong>Kakorogoto, Rukoni West, Ruhaama, Ntungamo District</strong>. P.O Box 04, Ntungamo. Mon–Fri 8AM–5PM.",
  leadership: "<strong>Mr. Mugoya Peter</strong> (Headteacher), <strong>Mrs. Gloria</strong> (Deputy), <strong>Mr. Atushabire Elvis</strong> (D.O.S).",
  programs: "O-Level (S.1–S.4) including STEM & Arts electives. A-Level combinations include PCB, PCM, BCM, MEG, HEG, and more.",
  motto: "Our motto: <strong>&ldquo;Work and Never Tire&rdquo;</strong> — a call to relentless excellence since 1941.",
  default: "For detailed help, contact us at <strong>+256 782 879 068</strong> or <strong>rukonisecondaryschool@yahoo.com</strong>."
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
