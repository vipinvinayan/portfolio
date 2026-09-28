/**
 * VIPIN CHANDRAN A — QUANTUM AI & COMPUTER VISION PORTFOLIO
 * Interactive Client-Side Logic (Vanilla ES6+)
 */

document.addEventListener('DOMContentLoaded', () => {
  /* ========================================================================
     1. THEME TOGGLE (Dark / Light Mode with Persistence)
     ======================================================================== */
  const rootEl = document.documentElement;
  const themeToggleBtn = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('vipin_portfolio_theme') || 'dark';
  rootEl.setAttribute('data-theme', savedTheme);

  function toggleTheme() {
    const current = rootEl.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    rootEl.setAttribute('data-theme', next);
    localStorage.setItem('vipin_portfolio_theme', next);
    showToast(`Switched to ${next === 'dark' ? 'Quantum Dark' : 'Editorial Light'} mode`);
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }

  /* ========================================================================
     2. MOBILE MENU & SCROLL PROGRESS / SCROLLSPY
     ======================================================================== */
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mainNav = document.getElementById('mainNav');
  const scrollProgress = document.getElementById('scrollProgress');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('main section[id]');

  if (mobileMenuBtn && mainNav) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (scrollProgress) {
      scrollProgress.style.width = `${pct}%`;
    }

    // Active section highlight
    let currentSectionId = '';
    sections.forEach((sec) => {
      const top = sec.offsetTop - 130;
      if (scrollTop >= top) {
        currentSectionId = sec.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle(
        'active',
        link.getAttribute('href') === `#${currentSectionId}`
      );
    });
  });

  /* ========================================================================
     3. SCROLL REVEAL OBSERVER
     ======================================================================== */
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  /* ========================================================================
     4. INTERACTIVE 8-QUBIT QUANTUM & VISION CANVAS
     ======================================================================== */
  const canvas = document.getElementById('quantumCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let qubits = [];
    const mouse = { x: -1000, y: -1000 };

    function resizeCanvas() {
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initQubits();
    }

    function initQubits() {
      qubits = [];
      const count = 16; // 8 primary qubits + 8 latent vision nodes
      for (let i = 0; i < count; i++) {
        const isPrimaryQubit = i < 8;
        qubits.push({
          x: Math.random() * (width - 60) + 30,
          y: Math.random() * (height - 60) + 30,
          vx: (Math.random() - 0.5) * 0.65,
          vy: (Math.random() - 0.5) * 0.65,
          radius: isPrimaryQubit ? 5.5 : 3.2,
          isPrimary: isPrimaryQubit,
          label: isPrimaryQubit ? `|q${i}⟩` : '',
          phase: Math.random() * Math.PI * 2
        });
      }
    }

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    canvas.addEventListener('mouseleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });

    function animateCanvas() {
      ctx.clearRect(0, 0, width, height);

      // Update positions
      for (let i = 0; i < qubits.length; i++) {
        const q = qubits[i];
        q.x += q.vx;
        q.y += q.vy;
        q.phase += 0.03;

        if (q.x < 20 || q.x > width - 20) q.vx *= -1;
        if (q.y < 20 || q.y > height - 20) q.vy *= -1;

        // Subtle attraction to cursor
        const dx = mouse.x - q.x;
        const dy = mouse.y - q.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 110 && dist > 5) {
          q.x += (dx / dist) * 0.45;
          q.y += (dy / dist) * 0.45;
        }
      }

      // Draw entanglement links
      for (let i = 0; i < qubits.length; i++) {
        for (let j = i + 1; j < qubits.length; j++) {
          const a = qubits[i];
          const b = qubits[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 125) {
            const alpha = (1 - dist / 125) * 0.45;
            ctx.strokeStyle =
              a.isPrimary && b.isPrimary
                ? `rgba(34, 211, 238, ${alpha})`
                : `rgba(129, 140, 248, ${alpha * 0.7})`;
            ctx.lineWidth = a.isPrimary && b.isPrimary ? 1.4 : 0.9;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Draw qubit nodes
      for (let i = 0; i < qubits.length; i++) {
        const q = qubits[i];
        const pulse = Math.sin(q.phase) * 1.5;

        if (q.isPrimary) {
          ctx.fillStyle = 'rgba(34, 211, 238, 0.18)';
          ctx.beginPath();
          ctx.arc(q.x, q.y, q.radius + 5 + pulse, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = q.isPrimary ? '#22d3ee' : '#818cf8';
        ctx.beginPath();
        ctx.arc(q.x, q.y, q.radius, 0, Math.PI * 2);
        ctx.fill();

        if (q.isPrimary) {
          ctx.font = '500 10px "JetBrains Mono", monospace';
          ctx.fillStyle = 'rgba(226, 232, 240, 0.82)';
          ctx.fillText(q.label, q.x + 8, q.y + 3);
        }
      }

      requestAnimationFrame(animateCanvas);
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    requestAnimationFrame(animateCanvas);
  }

  /* ========================================================================
     5. INTERACTIVE LAB WIDGETS (QCNN & FLOODNET)
     ======================================================================== */
  // QCNN View Switcher
  const qviewBtns = document.querySelectorAll('[data-qview]');
  const qviewMetrics = document.getElementById('qview-metrics');
  const qviewPipeline = document.getElementById('qview-pipeline');

  qviewBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      qviewBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const mode = btn.getAttribute('data-qview');
      if (mode === 'metrics') {
        qviewMetrics.classList.add('active');
        qviewPipeline.classList.remove('active');
      } else {
        qviewPipeline.classList.add('active');
        qviewMetrics.classList.remove('active');
      }
    });
  });

  // FloodNet Architecture Explorer
  const archData = {
    unet: {
      title: 'U-Net Encoder–Decoder',
      focus: 'Skip-Connection Boundary Precision',
      desc: 'Symmetric encoder-decoder with multi-scale skip connections that preserve fine-grained spatial boundaries between flooded roads, inundated buildings, and vegetation in high-resolution UAV imagery.'
    },
    deeplab: {
      title: 'DeepLab (Atrous Spatial Pyramid Pooling)',
      focus: 'Multi-Scale Contextual Receptive Field',
      desc: 'Employs dilated (atrous) convolutions and ASPP modules to capture multi-scale flood water extent and large-footprint infrastructure without losing spatial resolution.'
    },
    segnet: {
      title: 'SegNet (Pooling-Index Upsampling)',
      focus: 'Memory-Efficient Aerial Inference',
      desc: 'Uses max-pooling indices from the encoder for non-linear upsampling in the decoder, enabling memory-efficient semantic segmentation for rapid UAV disaster response pipelines.'
    }
  };

  const archBtns = document.querySelectorAll('[data-arch]');
  const archTitle = document.getElementById('archTitle');
  const archFocus = document.getElementById('archFocus');
  const archDescription = document.getElementById('archDescription');

  archBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      archBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const key = btn.getAttribute('data-arch');
      const info = archData[key];
      if (info && archTitle && archFocus && archDescription) {
        archTitle.textContent = info.title;
        archFocus.textContent = info.focus;
        archDescription.textContent = info.desc;
      }
    });
  });

  // FloodNet Semantic Class Highlight
  const legendChips = document.querySelectorAll('[data-highlight]');
  const uavZones = document.querySelectorAll('.uav-zone');

  legendChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      legendChips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      const target = chip.getAttribute('data-highlight');

      uavZones.forEach((zone) => {
        if (target === 'all') {
          zone.classList.remove('dimmed');
        } else {
          const matches = zone.classList.contains(`zone-${target}`);
          zone.classList.toggle('dimmed', !matches);
        }
      });
    });
  });

  /* ========================================================================
     6. PROJECTS FILTER & DETAIL MODAL
     ======================================================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  const projectDetails = {
    'voice-robot': {
      badge: 'Robotics & Embedded Systems · NIT Calicut',
      title: 'Voice-Controlled Object-Picking Robot',
      subtitle: 'Arduino ESP8266 · Dual DC & Servo Actuation · Real-Time Speech Control',
      paragraphs: [
        'Designed and built a wheeled mobile manipulator capable of interpreting real-time voice commands to navigate environments and pick up target objects.',
        'Integrated two DC gear motors for differential wheeled locomotion and two precision servo motors for robotic arm elevation and gripper actuation.',
        'Programmed on an Arduino ESP8266 microcontroller with low-latency wireless voice command parsing and closed-loop motor driver control logic during research training at NIT Calicut.'
      ],
      tags: ['Arduino ESP8266', 'Voice Recognition', 'DC Motors', 'Servo Kinematics', 'Embedded C++', 'NIT Calicut']
    },
    'recipe-ai': {
      badge: 'Computer Vision & Generative AI',
      title: 'AI-Powered Recipe Generation via Ingredient Image Analysis',
      subtitle: 'Deep Learning Image Classifier (2,000+ Images) + OpenAI API Synthesis',
      paragraphs: [
        'Developed a multi-stage computer vision and generative AI pipeline that identifies raw culinary ingredients directly from photographs and generates structured recipes.',
        'Trained and validated deep learning image classification models on a curated dataset of 2,000 ingredient images across diverse lighting and background conditions.',
        'Coupled the visual classifier output with the OpenAI API to synthesize context-aware recipes, nutritional breakdowns, and step-by-step cooking instructions.'
      ],
      tags: ['Computer Vision', 'Deep Learning', 'OpenAI API', 'Image Classification', 'Python', '2,000-Image Dataset']
    },
    'phase-space': {
      badge: 'Quantum Computing & Theoretical Physics',
      title: 'Quantum Computing Study — Phase Space Representations',
      subtitle: 'Wigner Functions · Husimi Q-Functions · Positive Operator-Valued Measures (POVMs)',
      paragraphs: [
        'Conducted an independent theoretical and computational study on phase-space formulations of quantum mechanics as part of foundational quantum computing coursework.',
        'Analyzed the Wigner quasi-probability distribution to visualize quantum interference and non-classical negativity in continuous-variable and qubit states.',
        'Investigated Husimi Q-functions and Positive Operator-Valued Measures (POVMs) for generalized quantum state tomography and measurement theory.'
      ],
      tags: ['Quantum Computing', 'Wigner Function', 'Husimi Q-Function', 'POVMs', 'Quantum State Tomography']
    },
    'ripple-effect': {
      badge: 'Data Science & Predictive Analytics',
      title: 'The Ripple Effect — Employee Turnover Analysis',
      subtitle: 'Supervised Classification & Exploratory Data Analysis for Retention Strategy',
      paragraphs: [
        'Executed an end-to-end data science investigation into organizational attrition patterns to identify key drivers of employee turnover.',
        'Performed comprehensive Exploratory Data Analysis (EDA), feature engineering, and correlation mapping across satisfaction, workload, tenure, and compensation variables.',
        'Trained and evaluated supervised classification models to predict high-risk attrition cohorts and formulated actionable, data-driven HR risk mitigation strategies.'
      ],
      tags: ['Classification Models', 'Exploratory Data Analysis', 'Scikit-learn', 'Feature Engineering', 'Risk Mitigation']
    },
    'salary-prediction': {
      badge: 'Supervised Machine Learning',
      title: 'Multi-Regression Salary Prediction Model',
      subtitle: 'Hyperparameter-Tuned Regression Pipeline · RMSE, MAE & R² Evaluation',
      paragraphs: [
        'Built a supervised machine learning framework for predicting compensation benchmarks across experience levels, roles, and technical specializations.',
        'Benchmarked multiple regression algorithms with systematic feature preprocessing, encoding, and grid-search hyperparameter optimization.',
        'Evaluated generalization performance rigorously using Root Mean Squared Error (RMSE), Mean Absolute Error (MAE), and R-squared (R²) goodness-of-fit metrics.'
      ],
      tags: ['Regression Algorithms', 'Hyperparameter Tuning', 'RMSE / MAE / R²', 'Scikit-learn', 'Python']
    },
    'distance-sensor': {
      badge: 'Embedded Systems & Ultrasonic Telemetry',
      title: 'Real-Time Ultrasonic Distance Measurement Sensor',
      subtitle: 'Arduino UNO · HC-SR04 Ultrasonic Transducer · LCD & Audio Proximity Alerting',
      paragraphs: [
        'Engineered a real-time non-contact distance measurement and proximity warning system using an Arduino UNO and HC-SR04 ultrasonic sensor.',
        'Calculated time-of-flight acoustic echo reflections to display live centimeter/inch telemetry on a 16×2 LCD screen with contrast adjustment via potentiometer.',
        'Implemented programmable threshold logic triggering a piezo buzzer alarm for obstacle detection and automated proximity alerting.'
      ],
      tags: ['Arduino UNO', 'HC-SR04 Sensor', 'LCD Interfacing', 'Piezo Buzzer', 'Embedded C']
    }
  };

  const projectModal = document.getElementById('projectModal');
  const closeProjectModal = document.getElementById('closeProjectModal');
  const modalBadge = document.getElementById('modalBadge');
  const modalTitle = document.getElementById('modalTitle');
  const modalSubtitle = document.getElementById('modalSubtitle');
  const modalBody = document.getElementById('modalBody');
  const modalTags = document.getElementById('modalTags');

  document.querySelectorAll('[data-open-modal]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-open-modal');
      const data = projectDetails[id];
      if (!data || !projectModal) return;

      modalBadge.textContent = data.badge;
      modalTitle.textContent = data.title;
      modalSubtitle.textContent = data.subtitle;
      modalBody.innerHTML = data.paragraphs.map((p) => `<p>${p}</p>`).join('');
      modalTags.innerHTML = data.tags
        .map((t) => `<span class="tech-pill">${t}</span>`)
        .join('');

      projectModal.showModal();
    });
  });

  if (closeProjectModal && projectModal) {
    closeProjectModal.addEventListener('click', () => projectModal.close());
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) projectModal.close();
    });
  }

  /* ========================================================================
     7. COMMAND PALETTE (Ctrl+K / Cmd+K)
     ======================================================================== */
  const cmdModal = document.getElementById('cmdModal');
  const openCmdBtn = document.getElementById('openCmdBtn');
  const closeCmdBtn = document.getElementById('closeCmdBtn');
  const cmdInput = document.getElementById('cmdInput');
  const cmdList = document.getElementById('cmdList');

  const commands = [
    { title: 'Go to Research Experience (FloodNet & QCNN)', meta: 'Section 01', action: () => scrollToSection('#research') },
    { title: 'Open Interactive QCNN & FloodNet Lab', meta: 'Section 02', action: () => scrollToSection('#lab-showcase') },
    { title: 'Browse Featured Projects (6 Projects)', meta: 'Section 03', action: () => scrollToSection('#projects') },
    { title: 'View Technical Skills & Quantum Stack', meta: 'Section 04', action: () => scrollToSection('#skills') },
    { title: 'View Education & Certifications', meta: 'Section 05', action: () => scrollToSection('#education') },
    { title: 'View UNSW Offer (#19 QS) & Conferences', meta: 'Section 06', action: () => scrollToSection('#leadership') },
    { title: 'Copy Email (vipinchandran.1737@gmail.com)', meta: 'Clipboard', action: () => copyText('vipinchandran.1737@gmail.com') },
    { title: 'Copy Phone (+91 7902386639)', meta: 'Clipboard', action: () => copyText('+91 7902386639') },
    { title: 'Toggle Dark / Light Theme', meta: 'Appearance', action: () => toggleTheme() },
    { title: 'Print / Save Academic CV as PDF', meta: 'Document', action: () => window.print() }
  ];

  function scrollToSection(hash) {
    const target = document.querySelector(hash);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  }

  function renderCommands(filterText = '') {
    if (!cmdList) return;
    const q = filterText.toLowerCase().trim();
    const filtered = commands.filter(
      (c) => c.title.toLowerCase().includes(q) || c.meta.toLowerCase().includes(q)
    );

    cmdList.innerHTML = filtered
      .map(
        (c, idx) => `
        <button type="button" class="cmd-item" data-cmd-idx="${idx}">
          <span class="cmd-item-title">${c.title}</span>
          <span class="cmd-item-meta">${c.meta}</span>
        </button>
      `
      )
      .join('');

    cmdList.querySelectorAll('.cmd-item').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.getAttribute('data-cmd-idx'));
        if (filtered[idx]) {
          cmdModal.close();
          filtered[idx].action();
        }
      });
    });
  }

  function openCommandPalette() {
    if (!cmdModal) return;
    renderCommands('');
    if (cmdInput) cmdInput.value = '';
    cmdModal.showModal();
    if (cmdInput) cmdInput.focus();
  }

  if (openCmdBtn) openCmdBtn.addEventListener('click', openCommandPalette);
  if (closeCmdBtn && cmdModal) {
    closeCmdBtn.addEventListener('click', () => cmdModal.close());
    cmdModal.addEventListener('click', (e) => {
      if (e.target === cmdModal) cmdModal.close();
    });
  }

  if (cmdInput) {
    cmdInput.addEventListener('input', (e) => renderCommands(e.target.value));
  }

  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (cmdModal && cmdModal.open) {
        cmdModal.close();
      } else {
        openCommandPalette();
      }
    }
  });

  /* ========================================================================
     8. CLIPBOARD COPY, PRINT CV & CONTACT FORM
     ======================================================================== */
  const toastEl = document.getElementById('toast');
  let toastTimeout = null;

  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toastEl.classList.remove('show');
    }, 2800);
  }

  function copyText(text) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`Copied to clipboard: ${text}`);
    });
  }

  document.querySelectorAll('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const val = btn.getAttribute('data-copy');
      if (val) copyText(val);
    });
  });

  const printCvBtn = document.getElementById('printCvBtn');
  if (printCvBtn) {
    printCvBtn.addEventListener('click', () => {
      window.print();
    });
  }

  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('senderName').value.trim();
      const email = document.getElementById('senderEmail').value.trim();
      const topic = document.getElementById('inquiryTopic').value;
      const message = document.getElementById('senderMessage').value.trim();

      const subject = encodeURIComponent(`[Portfolio Inquiry] ${topic} — ${name}`);
      const body = encodeURIComponent(
        `Hi Vipin,\n\n${message}\n\nBest regards,\n${name}\n${email}`
      );
      window.location.href = `mailto:vipinchandran.1737@gmail.com?subject=${subject}&body=${body}`;

      if (formStatus) {
        formStatus.textContent = 'Opening your default email client with pre-filled message...';
      }
      showToast('Launching email composer...');
    });
  }
});
