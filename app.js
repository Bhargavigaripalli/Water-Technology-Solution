document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initMobileMenu();
  initStickyNavbar();
  initCustomCursor();
  initHeroBubbles();
  initScrollReveal();
  initFiltrationFlow();
  initFaqAccordion();
  initContactForm();
  initAuthForms();
  initDashboardChart();
  initNewsletterForm();
  initAdminDashboard();
  initDashboardTabs();
  initMobileDashboardMenu();
});

/* 1. PRELOADER DISMISSAL */
function initPreloader() {
  const preloader = document.getElementById('site-preloader');
  if (!preloader) return;

  // Wait a short duration to let the loading-fill animation complete
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('fade-out');
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 500);
    }, 1200);
  });
}

/* 2. MOBILE MENU */
function initMobileMenu() {
  const toggleBtn = document.getElementById('nav-toggle');
  const closeBtn = document.getElementById('nav-close');
  const navPanel = document.getElementById('nav-panel');

  if (!toggleBtn || !navPanel) return;

  toggleBtn.addEventListener('click', () => {
    navPanel.classList.add('open');
    document.body.classList.add('menu-open');
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      navPanel.classList.remove('open');
      document.body.classList.remove('menu-open');
    });
  }

  // Close panel on link click
  const navLinks = navPanel.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navPanel.classList.remove('open');
      document.body.classList.remove('menu-open');
    });
  });
}

/* 3. STICKY NAVBAR */
function initStickyNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/* 4. CUSTOM BUBBLE CURSOR TRAIL */
function initCustomCursor() {
  const canvas = document.getElementById('cursor-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let mouse = { x: -100, y: -100 };
  let particles = [];
  let clicks = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Track mouse
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    
    // Spawn subtle tail bubbles
    if (Math.random() < 0.35) {
      particles.push(new Bubble(mouse.x, mouse.y, Math.random() * 4 + 2, (Math.random() - 0.5) * 1.2, -(Math.random() * 1.5 + 0.5)));
    }
  });

  // Handle click splash
  window.addEventListener('click', (e) => {
    clicks.push(new Ripple(e.clientX, e.clientY));
    
    // Spawn explosion bubbles
    for (let i = 0; i < 12; i++) {
      const radius = Math.random() * 6 + 3;
      const vx = (Math.random() - 0.5) * 6;
      const vy = (Math.random() - 0.5) * 6;
      particles.push(new Bubble(e.clientX, e.clientY, radius, vx, vy, 1));
    }
  });

  class Bubble {
    constructor(x, y, radius, vx, vy, type = 0) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.vx = vx;
      this.vy = vy;
      this.alpha = 0.7;
      this.type = type; // 0 for tail, 1 for click explosion
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      
      if (this.type === 0) {
        this.alpha -= 0.015;
      } else {
        this.alpha -= 0.02; // Fades faster
        this.vy += 0.05; // Drop down gravity slightly
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.strokeStyle = '#00b4d8';
      ctx.lineWidth = 1.5;
      ctx.fillStyle = 'rgba(0, 180, 216, 0.15)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      // Bubble highlight dot
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(this.x - this.radius * 0.3, this.y - this.radius * 0.3, this.radius * 0.15, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    }
  }

  class Ripple {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.radius = 2;
      this.maxRadius = 38;
      this.alpha = 1;
    }

    update() {
      this.radius += (this.maxRadius - this.radius) * 0.12;
      this.alpha = 1 - (this.radius / this.maxRadius);
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.stroke();
      
      // Secondary wave
      if (this.radius > 10) {
        ctx.strokeStyle = '#00b4d8';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius - 8, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw clicks/ripples
    for (let i = clicks.length - 1; i >= 0; i--) {
      clicks[i].update();
      clicks[i].draw();
      if (clicks[i].alpha <= 0.01) {
        clicks.splice(i, 1);
      }
    }
    
    // Draw bubble particles
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw();
      if (particles[i].alpha <= 0.01) {
        particles.splice(i, 1);
      }
    }
    
    requestAnimationFrame(loop);
  }
  loop();
}

/* 5. HERO BACKGROUND FLOATING BUBBLES */
function initHeroBubbles() {
  const canvas = document.getElementById('hero-bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const section = canvas.parentElement;

  let bubbles = [];
  const bubbleCount = 28;

  function resize() {
    canvas.width = section.clientWidth;
    canvas.height = section.clientHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class HeroBubble {
    constructor() {
      this.reset();
      this.y = Math.random() * canvas.height; // Distribute vertically initially
    }

    reset() {
      this.radius = Math.random() * 26 + 10;
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + this.radius + Math.random() * 100;
      this.speed = Math.random() * 0.8 + 0.4;
      this.wobble = Math.random() * 30 + 10;
      this.wobbleSpeed = Math.random() * 0.01 + 0.005;
      this.wobblePhase = Math.random() * Math.PI;
      this.opacity = Math.random() * 0.15 + 0.05;
    }

    update() {
      this.y -= this.speed;
      this.wobblePhase += this.wobbleSpeed;
      this.currentX = this.x + Math.sin(this.wobblePhase) * this.wobble;

      if (this.y < -this.radius) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.strokeStyle = '#90e0ef';
      ctx.lineWidth = 1;
      ctx.fillStyle = 'rgba(144, 224, 239, 0.08)';
      ctx.beginPath();
      ctx.arc(this.currentX, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Core glow dot
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(this.currentX - this.radius * 0.3, this.y - this.radius * 0.3, this.radius * 0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Populate list
  for (let i = 0; i < bubbleCount; i++) {
    bubbles.push(new HeroBubble());
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < bubbles.length; i++) {
      bubbles[i].update();
      bubbles[i].draw();
    }
    
    requestAnimationFrame(loop);
  }
  loop();
}

/* 6. SCROLL REVEAL & COUNT-UP STATS */
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  
  const options = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        
        // Trigger count-up if this contains count targets
        const counters = entry.target.querySelectorAll('.count-target');
        if (counters.length > 0) {
          counters.forEach(c => runCountUp(c));
        }
        obs.unobserve(entry.target);
      }
    });
  }, options);

  items.forEach(item => observer.observe(item));
}

function runCountUp(element) {
  if (element.classList.contains('counted')) return;
  element.classList.add('counted');

  const target = parseFloat(element.getAttribute('data-value'));
  const suffix = element.getAttribute('data-suffix') || '';
  const duration = 2000; // ms
  const frameRate = 1000 / 60; // 60fps
  const totalFrames = Math.round(duration / frameRate);
  let frame = 0;

  function formatNum(val) {
    if (val >= 1000000) {
      return (val / 1000000).toFixed(0) + 'M+';
    }
    return Math.floor(val).toLocaleString();
  }

  const timer = setInterval(() => {
    frame++;
    const progress = frame / totalFrames;
    // EaseOutQuad formula
    const easeProgress = progress * (2 - progress);
    const currentVal = target * easeProgress;
    
    if (target >= 1000000) {
      element.innerText = formatNum(currentVal);
    } else {
      element.innerText = Math.floor(currentVal) + suffix;
    }

    if (frame >= totalFrames) {
      clearInterval(timer);
      if (target >= 1000000) {
        element.innerText = formatNum(target);
      } else {
        element.innerText = target + suffix;
      }
    }
  }, frameRate);
}

/* 7. INTERACTIVE FILTRATION STAGES */
function initFiltrationFlow() {
  const btns = document.querySelectorAll('.filtration-stage-btn');
  const cards = document.querySelectorAll('.filtration-detail-card');
  
  if (btns.length === 0) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const stage = btn.getAttribute('data-stage');
      
      // Toggle button states
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Toggle card states
      cards.forEach(card => {
        card.classList.remove('active');
        if (card.getAttribute('id') === `detail-${stage}`) {
          card.classList.add('active');
        }
      });
    });
  });
}

/* 8. FAQ ACCORDION */
function initFaqAccordion() {
  const questions = document.querySelectorAll('.faq-question');
  
  questions.forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      const isActive = item.classList.contains('active');
      
      // Close all items
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      
      // Toggle clicked
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* 9. CONTACT FORM SUBMISSION GESTURE */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');

  // Enforce name rules: only alphabets/spaces, max 16 chars
  if (nameInput) {
    nameInput.maxLength = 16;
    nameInput.pattern = "[a-zA-Z\\s]+";
    nameInput.title = "Only alphabets and spaces allowed, maximum 16 characters.";
    nameInput.addEventListener('input', () => {
      nameInput.value = nameInput.value.replace(/[^a-zA-Z\s]/g, '');
    });
  }

  // Enforce email rules: Gmail format only
  if (emailInput) {
    emailInput.pattern = "[a-zA-Z0-9._%+-]+@gmail\\.com$";
    emailInput.title = "Please enter a valid Gmail address (e.g. user@gmail.com).";
  }

  // Enforce phone rules: only numbers, max 10 digits
  if (phoneInput) {
    phoneInput.maxLength = 10;
    phoneInput.pattern = "[0-9]+";
    phoneInput.title = "Only numbers allowed, maximum 10 digits.";
    phoneInput.addEventListener('input', () => {
      phoneInput.value = phoneInput.value.replace(/[^0-9]/g, '');
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Double check email ending in case of manual input manipulation
    if (emailInput && !emailInput.value.toLowerCase().endsWith('@gmail.com')) {
      alert("Please enter a valid Gmail address (ending in @gmail.com).");
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';
    btn.disabled = true;

    setTimeout(() => {
      window.location.href = '404.html';
    }, 1000);
  });
}

/* 10. AUTHENTICATION FORM VALIDATIONS & REDIRECTS */
function initAuthForms() {
  // Password Visibility Toggle
  setupPasswordToggle('password-toggle-btn', 'login-password');
  setupPasswordToggle('signup-password-toggle', 'signup-password');
  setupPasswordToggle('signup-confirm-toggle', 'signup-confirm');

  function setupPasswordToggle(btnId, inputId) {
    const btn = document.getElementById(btnId);
    const input = document.getElementById(inputId);
    if (!btn || !input) return;

    btn.addEventListener('click', () => {
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      btn.classList.toggle('fa-eye-slash', !isPassword);
      btn.classList.toggle('fa-eye', isPassword);
    });
  }

  // Name filtering for signup
  const signupName = document.getElementById('signup-name');
  if (signupName) {
    signupName.maxLength = 16;
    signupName.pattern = "[a-zA-Z\\s]+";
    signupName.title = "Only alphabets and spaces allowed, maximum 16 characters.";
    signupName.addEventListener('input', () => {
      signupName.value = signupName.value.replace(/[^a-zA-Z\s]/g, '');
    });
  }

  // Email filtering for signup
  const signupEmail = document.getElementById('signup-email');
  if (signupEmail) {
    signupEmail.pattern = "[a-zA-Z0-9._%+-]+@gmail\\.com$";
    signupEmail.title = "Please enter a valid Gmail address (ending in @gmail.com).";
  }

  // Password Rules Checker
  const passwordInput = document.getElementById('signup-password');
  const confirmInput = document.getElementById('signup-confirm');
  
  if (passwordInput) {
    passwordInput.addEventListener('input', checkPasswordRules);
    if (confirmInput) {
      confirmInput.addEventListener('input', checkPasswordRules);
    }
  }

  function checkPasswordRules() {
    const password = passwordInput.value;
    const confirm = confirmInput.value;

    const ruleLength = document.getElementById('rule-length');
    const ruleUpper = document.getElementById('rule-upper');
    const ruleNumber = document.getElementById('rule-number');
    const ruleMatch = document.getElementById('rule-match');

    // Length Rule
    const hasLength = password.length >= 8;
    updateRuleState(ruleLength, hasLength);

    // Uppercase Rule
    const hasUpper = /[A-Z]/.test(password);
    updateRuleState(ruleUpper, hasUpper);

    // Number Rule
    const hasNumber = /[0-9]/.test(password);
    updateRuleState(ruleNumber, hasNumber);

    // Passwords Match Rule
    const isMatching = password === confirm && confirm.length > 0;
    updateRuleState(ruleMatch, isMatching);
  }

  function updateRuleState(element, isValid) {
    if (!element) return;
    element.classList.toggle('valid', isValid);
    const icon = element.querySelector('i');
    if (icon) {
      icon.className = isValid ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark';
    }
  }

  // Handle Form Submissions
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      const rememberCheckbox = document.getElementById('remember-me');
      const roleSelect = document.getElementById('login-role');

      // 1. Gmail format check
      if (!email.toLowerCase().endsWith('@gmail.com')) {
        alert("Email must end with @gmail.com");
        return;
      }

      // 2. Strong password verification
      const isStrong = password.length >= 8 &&
                       /[A-Z]/.test(password) &&
                       /[a-z]/.test(password) &&
                       /[0-9]/.test(password) &&
                       /[!@#$%^&*(),.?":{}|<>]/.test(password);
      if (!isStrong) {
        alert("Password must be strong: minimum 8 characters, containing at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.");
        return;
      }

      // 3. Remember Me checkbox check
      if (!rememberCheckbox || !rememberCheckbox.checked) {
        alert("You must check 'Remember Me' to proceed with portal login.");
        return;
      }

      // 4. Authorized Redirect
      const btn = loginForm.querySelector('button[type="submit"]');
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Authorizing...';
      btn.disabled = true;

      const selectedRole = roleSelect ? roleSelect.value : 'user';

      setTimeout(() => {
        if (selectedRole === 'admin') {
          window.location.href = 'admin-dashboard.html';
        } else {
          window.location.href = 'dashboard.html';
        }
      }, 1200);
    });
  }

  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const email = signupEmail ? signupEmail.value : '';
      const password = passwordInput ? passwordInput.value : '';
      const confirm = confirmInput ? confirmInput.value : '';

      // 1. Gmail format check
      if (!email.toLowerCase().endsWith('@gmail.com')) {
        alert("Email must end with @gmail.com");
        return;
      }

      // 2. Strong password check
      const isStrong = password.length >= 8 &&
                       /[A-Z]/.test(password) &&
                       /[a-z]/.test(password) &&
                       /[0-9]/.test(password) &&
                       /[!@#$%^&*(),.?":{}|<>]/.test(password);
      if (!isStrong) {
        alert("Password must be strong: minimum 8 characters, containing at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.");
        return;
      }

      // 3. Confirm match check
      if (password !== confirm) {
        alert("Passwords do not match!");
        return;
      }

      const btn = signupForm.querySelector('button[type="submit"]');
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Deploying Node...';
      btn.disabled = true;
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1500);
    });
  }
}

/* 11. DASHBOARD TELEMETRY WAVE CHART & DIAGNOSTIC CONSOLE */
function initDashboardChart() {
  const canvas = document.getElementById('telemetry-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const parent = canvas.parentElement;

  function resize() {
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  let phase = 0;

  function drawChart() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const width = canvas.width;
    const height = canvas.height;

    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let i = 1; i < 5; i++) {
      const y = (height / 5) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Phase shift for scrolling illusion
    phase += 0.05;

    // Wave 1: Flow (Electric Indigo)
    ctx.save();
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 3;
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'rgba(99, 102, 241, 0.5)';
    ctx.beginPath();
    for (let x = 0; x < width; x++) {
      const y = (height * 0.5) + Math.sin(x * 0.015 - phase) * 45 + Math.cos(x * 0.007 + phase * 0.5) * 15;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();

    // Wave 2: Pressure (Cyan)
    ctx.save();
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2.5;
    ctx.shadowBlur = 8;
    ctx.shadowColor = 'rgba(6, 182, 212, 0.5)';
    ctx.beginPath();
    for (let x = 0; x < width; x++) {
      const y = (height * 0.5) + Math.sin(x * 0.01 + phase * 0.8) * 35 + Math.cos(x * 0.02 - phase) * 10;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();

    requestAnimationFrame(drawChart);
  }
  drawChart();

  // Diagnostics rolling logs stream
  const consoleEl = document.getElementById('terminal-console');
  if (!consoleEl) return;

  const logDatabase = [
    "Sensor node 12B online (Modbus LTE connection active)",
    "Anti-scalant chemical dosing dosage calibrated automatically",
    "Backwash cycle execution completed successfully on Sediment Filter module 1",
    "Live telemetry stream synced with Bangalore systems engineering office",
    "TDS level detected: 142 ppm (within safety guidelines)",
    "Carbon absorption efficiency index verified at 96.4%",
    "UV light tube core temperature stable at 38.6°C",
    "Emergency purge valves calibration audit checked: status normal",
    "Desalination thermal pressure cell normal (4.2 MPa)"
  ];

  function getTimestamp() {
    const d = new Date();
    const hrs = String(d.getHours()).padStart(2, '0');
    const mins = String(d.getMinutes()).padStart(2, '0');
    const secs = String(d.getSeconds()).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  }

  // Prepopulate 4 lines
  for (let i = 0; i < 4; i++) {
    const time = getTimestamp();
    const log = logDatabase[Math.floor(Math.random() * logDatabase.length)];
    consoleEl.innerHTML += `<div class="terminal-line"><span class="time">[${time}]</span> - <span class="success">SYSTEM OK:</span> ${log}</div>`;
  }
  consoleEl.scrollTop = consoleEl.scrollHeight;

  // Append logs repeatedly
  setInterval(() => {
    const time = getTimestamp();
    const isWarning = Math.random() < 0.2;
    const log = logDatabase[Math.floor(Math.random() * logDatabase.length)];
    
    if (isWarning) {
      consoleEl.innerHTML += `<div class="terminal-line"><span class="time">[${time}]</span> - <span class="warn">DIAGNOSTIC:</span> Routine diagnostics scan complete. Status: normal.</div>`;
    } else {
      consoleEl.innerHTML += `<div class="terminal-line"><span class="time">[${time}]</span> - <span class="success">SYSTEM OK:</span> ${log}</div>`;
    }
    consoleEl.scrollTop = consoleEl.scrollHeight;

    // Limit lines inside console
    if (consoleEl.children.length > 25) {
      consoleEl.removeChild(consoleEl.firstChild);
    }
  }, 3500);
}

/* 12. NEWSLETTER FORM VALIDATIONS & REDIRECTS */
function initNewsletterForm() {
  const forms = document.querySelectorAll('.newsletter-form');
  forms.forEach(form => {
    const emailInput = form.querySelector('input[type="email"]');
    if (emailInput) {
      emailInput.pattern = "[a-zA-Z0-9._%+-]+@gmail\\.com$";
      emailInput.title = "Please enter a valid Gmail address (ending in @gmail.com).";
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (emailInput && !emailInput.value.toLowerCase().endsWith('@gmail.com')) {
        alert("Please enter a valid Gmail address (ending in @gmail.com).");
        return;
      }
      
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
        btn.disabled = true;
      }

      setTimeout(() => {
        window.location.href = '404.html';
      }, 1000);
    });
  });
}

/* 13. ADMIN DASHBOARD OPERATIONS */
function initAdminDashboard() {
  const canvas = document.getElementById('admin-telemetry-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const parent = canvas.parentElement;

  function resize() {
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  let phase = 0;

  function drawAdminChart() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const width = canvas.width;
    const height = canvas.height;

    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let i = 1; i < 5; i++) {
      const y = (height / 5) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Shift offset
    phase += 0.08;

    // Admin Load line (Gold #f59e0b)
    ctx.save();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.5;
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'rgba(245, 158, 11, 0.5)';
    ctx.beginPath();
    for (let x = 0; x < width; x++) {
      const y = (height * 0.5) + Math.sin(x * 0.02 - phase) * 35 + Math.cos(x * 0.045 + phase) * 12;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();

    // Secondary load line (Cyan)
    ctx.save();
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let x = 0; x < width; x++) {
      const y = (height * 0.5) + Math.sin(x * 0.01 + phase * 0.5) * 20 + Math.cos(x * 0.03 - phase * 0.8) * 8;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();

    requestAnimationFrame(drawAdminChart);
  }
  drawAdminChart();

  // Root diagnostics logs stream
  const consoleEl = document.getElementById('admin-terminal-console');
  if (!consoleEl) return;

  const adminLogs = [
    "Remote carbon column backwash cycle completed on Mumbai Skid C",
    "Firmware update ver 4.2.1 pushed successfully to Chennai Modbus endpoints",
    "Modbus cellular telemetry path switched to backup Airtel LTE carrier",
    "User root session initialized successfully from IP 10.0.4.112",
    "TDS warning bounds checked: 0 - 250 ppm range validated",
    "Pressure bypass valves remote test success (0.42 MPa threshold)",
    "Chlorine sensor recalibrated: 0.2 mg/L baseline deviation adjusted",
    "Automated anti-scaling chemical dose flush synchronized on Bangalore Skid A",
    "Security check: TLS certificate credentials verified active"
  ];

  function getTimestamp() {
    const d = new Date();
    const hrs = String(d.getHours()).padStart(2, '0');
    const mins = String(d.getMinutes()).padStart(2, '0');
    const secs = String(d.getSeconds()).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  }

  // Prepopulate
  for (let i = 0; i < 4; i++) {
    const time = getTimestamp();
    const log = adminLogs[Math.floor(Math.random() * adminLogs.length)];
    consoleEl.innerHTML += `<div class="terminal-line"><span class="time">[${time}]</span> - <span class="admin-action">ROOT_EXEC:</span> ${log}</div>`;
  }
  consoleEl.scrollTop = consoleEl.scrollHeight;

  // Stream logs
  setInterval(() => {
    const time = getTimestamp();
    const isCritical = Math.random() < 0.2;
    const log = adminLogs[Math.floor(Math.random() * adminLogs.length)];
    
    if (isCritical) {
      consoleEl.innerHTML += `<div class="terminal-line"><span class="time">[${time}]</span> - <span class="warn">ALARM_MONITOR:</span> Global alarm limits checked - status normal.</div>`;
    } else {
      consoleEl.innerHTML += `<div class="terminal-line"><span class="time">[${time}]</span> - <span class="admin-action">ROOT_EXEC:</span> ${log}</div>`;
    }
    consoleEl.scrollTop = consoleEl.scrollHeight;

    if (consoleEl.children.length > 25) {
      consoleEl.removeChild(consoleEl.firstChild);
    }
  }, 4000);
}

/* 14. INTERACTIVE DASHBOARD TABS SYSTEM */
function initDashboardTabs() {
  const tabLinks = document.querySelectorAll('.dash-menu-link');
  if (tabLinks.length === 0) return;

  tabLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      const targetId = link.getAttribute('data-target');
      if (!targetId) return;

      // Remove active class from all links
      tabLinks.forEach(l => l.classList.remove('active'));
      // Add active class to clicked link
      link.classList.add('active');

      // Hide all panels
      const panels = document.querySelectorAll('.dash-panel');
      panels.forEach(panel => {
        panel.classList.remove('active');
        panel.style.display = 'none';
      });

      // Show targeted panel
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
        targetPanel.style.display = 'block';

        // Trigger a resize event to redraw any responsive canvas charts instantly
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
        }, 50);
      }
    });
  });
}

/* 15. MOBILE DASHBOARD SIDEBAR DRAWER TOGGLE */
function initMobileDashboardMenu() {
  const toggleBtn = document.getElementById('mobile-dash-toggle');
  const closeBtn = document.getElementById('mobile-sidebar-close');
  const sidebar = document.querySelector('.dash-sidebar');

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.add('open');
    });
  }

  if (closeBtn && sidebar) {
    closeBtn.addEventListener('click', () => {
      sidebar.classList.remove('open');
    });
  }

  // Auto-close sidebar on links selection click
  const menuLinks = document.querySelectorAll('.dash-menu-link');
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (sidebar && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
      }
    });
  });
}
