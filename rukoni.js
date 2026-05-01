
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
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ===== SMOOTH SCROLL FOR NAVIGATION =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
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

function nextStep(from) {
  const currentForm = document.getElementById(`step${from}`);
  const inputs = currentForm.querySelectorAll('input, select');
  let isValid = true;

  inputs.forEach(input => {
    if (input.getAttribute('data-required') !== 'false' && !input.value.trim()) {
      isValid = false;
      input.style.borderColor = '#ff4444';
      setTimeout(() => {
        input.style.borderColor = '';
      }, 2000);
    }
  });

  if (!isValid) return;

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
  const fname = document.getElementById('firstName').value;
  const lname = document.getElementById('lastName').value;
  const phone = document.getElementById('phone').value;

  if (!fname || !lname || !phone) {
    alert('Please fill in all required fields.');
    return;
  }

  document.getElementById('step3').classList.remove('active');
  document.getElementById('successMsg').classList.add('show');

  // Reset form after 3 seconds
  setTimeout(() => {
    document.getElementById('step1').classList.add('active');
    document.getElementById('si-1').classList.add('active');
    document.getElementById('successMsg').classList.remove('show');
    document.getElementById('firstName').value = '';
    document.getElementById('lastName').value = '';
    document.getElementById('dob').value = '';
    document.getElementById('gender').value = '';
    document.getElementById('district').value = '';
    currentStep = 1;
  }, 5000);
}

// ===== AI CHAT =====
let chatOpen = false;

const responses = {
  "apply": "To apply to Rukoni Secondary School:\n1️⃣ Click 'Apply Now' in the navigation menu\n2️⃣ Fill in your personal details\n3️⃣ Provide your academic information\n4️⃣ Give parent/guardian contacts\n5️⃣ Submit — our team will contact you within 3–5 days!",
  "fees": "School fees vary by class level and term. For the current fee structure, please:\n📞 Call us: +256 700 000 000\n📧 Email: info@rukoniss.ac.ug\nOur bursar will give you a full fee breakdown for O-Level and A-Level.",
  "location": "📍 We are located in:\n**Kakologoto, Rukoni East,\nRuhaama East, Ntungamo District,\nUganda**\n\nYou can visit us during office hours: Mon-Fri 8AM–5PM, Sat 9AM–1PM.",
  "leadership": "Our school is led by:\n👨‍💼 **Headteacher**: Mr. Mugoya Peter\n👩‍💼 **Deputy Headteacher**: Mrs. Gloria\n📚 **Director of Studies**: Mr. Atushabire Elvis\n\nOur leadership is committed to excellence and student welfare.",
  "programs": "We offer:\n📗 **O-Level** (S.1 – S.4): Sciences, Humanities, Arts\n📘 **A-Level** (S.5 – S.6): PCB, PCM, HEG, MEG, HGL\n⚽ **Co-curricular**: Sports, Debate, Drama, Music",
  "contact": "📞 Phone: +256 700 000 000\n📧 Email: info@rukoniss.ac.ug\n🌐 Social: Facebook | Twitter | Instagram | YouTube | WhatsApp\n🕐 Hours: Mon–Fri 8AM–5PM",
  "headteacher": "Our Headteacher is **Mr. Mugoya Peter** — a seasoned educator with decades of experience leading schools to academic excellence in Uganda.",
  "dos": "The Director of Studies is **Mr. Atushabire Elvis**, who oversees all academic programs, examinations, and student performance at Rukoni SS.",
  "facilities": "Rukoni SS features:\n🏫 Modern classrooms with smart boards\n🧪 Well-equipped science laboratories\n📚 Comprehensive library\n⚽ Sports fields\n🎭 Art and music studios\n💻 Computer labs\n🏥 School clinic\n🍽️ Modern dining facilities",
  "sports": "We excel in:\n⚽ Football\n🏀 Basketball\n🎾 Netball\n🏃 Athletics\n🏊 Swimming\n♟️ Chess\n🎯 Archery\nRegular inter-school tournaments keep our athletes competitive.",
  "default": "Thank you for your question! 😊 For detailed information, please contact us:\n📞 +256 700 000 000\n📧 info@rukoniss.ac.ug\n\nOr scroll down to our Contact section for more options."
};

function getResponse(text) {
  const t = text.toLowerCase();
  if (t.includes('apply') || t.includes('admission') || t.includes('join') || t.includes('enrol')) return responses.apply;
  if (t.includes('fee') || t.includes('cost') || t.includes('pay') || t.includes('money')) return responses.fees;
  if (t.includes('locat') || t.includes('where') || t.includes('address') || t.includes('direction')) return responses.location;
  if (t.includes('leader') || t.includes('management') || t.includes('team') || t.includes('staff')) return responses.leadership;
  if (t.includes('program') || t.includes('subject') || t.includes('course') || t.includes('study') || t.includes('combina')) return responses.programs;
  if (t.includes('contact') || t.includes('phone') || t.includes('email') || t.includes('reach') || t.includes('call')) return responses.contact;
  if (t.includes('headteacher') || t.includes('head teacher') || t.includes('principal') || t.includes('mugoya')) return responses.headteacher;
  if (t.includes('dos') || t.includes('director') || t.includes('atushabire') || t.includes('elvis')) return responses.dos;
  if (t.includes('facilit') || t.includes('infrastructure') || t.includes('lab') || t.includes('library')) return responses.facilities;
  if (t.includes('sport') || t.includes('athletic') || t.includes('football') || t.includes('netball')) return responses.sports;
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

