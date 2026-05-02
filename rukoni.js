
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

setInterval(() => {
  goToSlide((currentSlide + 1) % slides.length);
}, 5500);

// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  hamburger.classList.toggle('open');
});


// ===== SMOOTH SCROLL FOR NAVIGATION =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      // Close mobile menu if open
      navLinks.classList.remove('active');
      hamburger.classList.remove('open');
    }
  });
});

// ===== SCROLL REVEAL =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ===== MULTI-STEP FORM =====
let currentStep = 1;

function validateStep(step) {
  const stepForm = document.getElementById(`step${step}`);
  const fields = stepForm.querySelectorAll('input, select, textarea');
  let valid = true;

  fields.forEach(field => {
    const required = field.getAttribute('data-required') !== 'false';
    if (required && !field.value.trim()) {
      valid = false;
      field.classList.add('invalid');
      setTimeout(() => field.classList.remove('invalid'), 2400);
    }
  });

  return valid;
}

function nextStep(from) {
  if (!validateStep(from)) {
    alert('Please complete all required fields before continuing to the next step.');
    return;
  }

  document.getElementById(`step${from}`).classList.remove('active');
  document.getElementById(`si-${from}`).classList.remove('active');
  currentStep = from + 1;
  document.getElementById(`step${currentStep}`).classList.add('active');
  document.getElementById(`si-${currentStep}`).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function prevStep(from) {
  document.getElementById(`step${from}`).classList.remove('active');
  document.getElementById(`si-${from}`).classList.remove('active');
  currentStep = from - 1;
  document.getElementById(`step${currentStep}`).classList.add('active');
  document.getElementById(`si-${currentStep}`).classList.add('active');
}

function submitApplication() {
  if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
    alert('Please complete all required fields before submitting your application.');
    return;
  }

  const applicationData = {
    firstName: document.getElementById('firstName').value.trim(),
    lastName: document.getElementById('lastName').value.trim(),
    dob: document.getElementById('dob').value,
    gender: document.getElementById('gender').value,
    district: document.getElementById('district').value.trim(),
    applyClass: document.getElementById('applyClass').value,
    prevSchool: document.getElementById('prevSchool').value.trim(),
    pleScore: document.getElementById('pleScore').value.trim(),
    combination: document.getElementById('combination').value,
    achievements: document.getElementById('achievements').value.trim(),
    guardianName: document.getElementById('guardianName').value.trim(),
    relationship: document.getElementById('relationship').value,
    phone: document.getElementById('phone').value.trim(),
    email: document.getElementById('email').value.trim(),
    address: document.getElementById('address').value.trim(),
    message: document.getElementById('message').value.trim()
  };

  console.log('Application submission:', applicationData);
  document.querySelector('.apply-form').style.display = 'none';
  document.getElementById('successMsg').classList.add('show');

  setTimeout(() => {
    document.querySelector('.apply-form').style.display = '';
    document.getElementById('step1').classList.add('active');
    document.getElementById('si-1').classList.add('active');
    document.getElementById('step2').classList.remove('active');
    document.getElementById('step3').classList.remove('active');
    document.getElementById('si-2').classList.remove('active');
    document.getElementById('si-3').classList.remove('active');
    document.getElementById('successMsg').classList.remove('show');
    ['firstName','lastName','dob','gender','district','applyClass','prevSchool','pleScore','combination','achievements','guardianName','relationship','phone','email','address','message'].forEach(id => {
      const field = document.getElementById(id);
      if (field) field.value = '';
    });
    currentStep = 1;
  }, 5000);
}

// ===== AI CHAT =====
let chatOpen = false;

const responses = {
  "apply": "Thank you for your interest in Rukoni Secondary School. To apply online, please complete the admission form in the 'Apply' section. Provide your personal details, academic background, and guardian contact information. Our admissions team will review your submission and contact you within 3–5 working days.",
  "fees": "Our fees structure is tailored to class level and term. For the most accurate information, please contact the admissions office directly at +256 700 000 000 or info@rukoniss.ac.ug. We will share a full fee schedule for O-Level and A-Level, including any available payment options.",
  "location": "Rukoni Secondary School is located at Kakologoto, Rukoni East, Ruhaama East, Ntungamo District, Uganda. Our campus is open to visitors during official office hours: Monday to Friday, 8:00 AM to 5:00 PM, and Saturday, 9:00 AM to 1:00 PM.",
  "leadership": "Our leadership team includes Mr. Mugoya Peter, Headteacher; Mrs. Gloria, Deputy Headteacher; and Mr. Atushabire Elvis, Director of Studies. They work together to maintain high academic standards, strong pastoral care, and a safe learning environment.",
  "programs": "Rukoni SS offers a broad curriculum: O-Level classes in Sciences, Humanities, Languages, and Arts, plus A-Level combinations including PCB, PCM, HEG, MEG, and HGL. We also support co-curricular programs in sports, debate, drama, music, and leadership development.",
  "boarding": "Our school provides dedicated boarding facilities designed to support academic focus, pastoral care, and healthy routines. For boarding availability, accommodations, and rules, please contact our admissions team.",
  "transport": "Transport arrangements are managed locally and may vary by term. If you need guidance on school routes or nearby transport partners, please reach out to our office at info@rukoniss.ac.ug.",
  "contact": "For admissions or general enquiries, contact us at +256 700 000 000 or info@rukoniss.ac.ug. Our office is ready to assist with applications, fee schedules, campus visits, and student placement.",
  "headteacher": "Mr. Mugoya Peter is the Headteacher of Rukoni Secondary School. He brings extensive leadership experience and a strong commitment to academic excellence, character formation, and community engagement.",
  "dos": "Mr. Atushabire Elvis serves as Director of Studies. He leads curriculum development, examination preparation, and academic monitoring for all students at Rukoni SS.",
  "facilities": "The school campus includes modern classrooms, science laboratories, a library, computer labs, sports fields, and a school clinic. We strive to provide a well-rounded educational environment for every student.",
  "sports": "Rukoni SS supports a wide range of sports including football, basketball, netball, athletics, swimming, and chess. Students also participate in inter-school competitions and structured athletic training.",
  "default": "Thank you for your question. For detailed assistance, please contact our admissions office at +256 700 000 000 or info@rukoniss.ac.ug. You may also review the Contact section for additional ways to reach us."
};

function getResponse(text) {
  const t = text.toLowerCase();
  if (/\b(apply|admission|join|enrol|register|application|registering)\b/.test(t)) return responses.apply;
  if (/\b(fee|cost|pay|money|charge|tuition|term)\b/.test(t)) return responses.fees;
  if (/\b(locat|where|address|direction|situat|site)\b/.test(t)) return responses.location;
  if (/\b(boarding|hostel|accommodation|residence)\b/.test(t)) return responses.boarding;
  if (/\b(transport|bus|shuttle|route|pickup|drop-off)\b/.test(t)) return responses.transport;
  if (/\b(leader|management|team|staff|principal|headteacher|deputy|director)\b/.test(t)) return responses.leadership;
  if (/\b(program|subject|course|study|combination|offer|stream|curriculum)\b/.test(t)) return responses.programs;
  if (/\b(contact|phone|email|reach|call|visit|office|inquiry|enquire)\b/.test(t)) return responses.contact;
  if (/\b(headteacher|principal|mugoya)\b/.test(t)) return responses.headteacher;
  if (/\b(dos|director of studies|atushabire|elvis)\b/.test(t)) return responses.dos;
  if (/\b(facilit|infrastructure|lab|library|computer|clinic|facilities)\b/.test(t)) return responses.facilities;
  if (/\b(sport|athletic|football|netball|athletics|games|tournament)\b/.test(t)) return responses.sports;
  return responses.default;
}

function toggleChat() {
  chatOpen = !chatOpen;
  document.getElementById('chatPanel').classList.toggle('open', chatOpen);
}

function addMessage(text, isUser) {
  const messages = document.getElementById('chatMessages');
  const msg = document.createElement('div');
  msg.className = `msg ${isUser ? 'user' : 'bot'}`;
  msg.innerHTML = `<div class="msg-bubble">${text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</div>`;
  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;
}

function showTyping() {
  const messages = document.getElementById('chatMessages');
  const typing = document.createElement('div');
  typing.className = 'msg bot';
  typing.id = 'typing';
  typing.innerHTML = `<div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>`;
  messages.appendChild(typing);
  messages.scrollTop = messages.scrollHeight;
}

function removeTyping() {
  const t = document.getElementById('typing');
  if (t) t.remove();
}

function sendChat() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;
  addMessage(text, true);
  input.value = '';
  showTyping();
  setTimeout(() => {
    removeTyping();
    addMessage(getResponse(text), false);
  }, 1200);
}

function askQuestion(q) {
  if (!chatOpen) {
    chatOpen = true;
    document.getElementById('chatPanel').classList.add('open');
  }
  addMessage(q, true);
  showTyping();
  setTimeout(() => {
    removeTyping();
    addMessage(getResponse(q), false);
  }, 1200);
}

function handleKey(e) {
  if (e.key === 'Enter') sendChat();
}
