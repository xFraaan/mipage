(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const progress = document.querySelector('.progress span');
  const cursor = document.querySelector('.cursor');
  const navToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('nav');
  const roles = [
    'Ingeniero en Sistemas En Computación', 'Especialista en Soporte Técnico',
    'Cybersecurity Enthusiast', 'Cloud Computing', 'IT Support',
    'Networking', 'Microsoft Azure', 'AWS', 'Google Cloud'
  ];

  function updateScroll() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${max ? (window.scrollY / max) * 100 : 0}%`;
  }

  window.addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();

  if (!reducedMotion && window.matchMedia('(pointer:fine)').matches) {
    window.addEventListener('pointermove', (event) => {
      cursor.style.left = `${event.clientX}px`;
      cursor.style.top = `${event.clientY}px`;
    });
    document.querySelectorAll('a, button, input, textarea').forEach((element) => {
      element.addEventListener('pointerenter', () => cursor.classList.add('active'));
      element.addEventListener('pointerleave', () => cursor.classList.remove('active'));
    });
  }

  navToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Cerrar navegación' : 'Abrir navegación');
  });
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => nav.classList.remove('open')));

  if (!reducedMotion) {
    const roleElement = document.querySelector('#typed-role');
    let roleIndex = 0;
    let characterIndex = roles[0].length;
    let deleting = false;
    const typeRole = () => {
      const value = roles[roleIndex];
      roleElement.textContent = value.slice(0, characterIndex);
      if (!deleting && characterIndex < value.length) {
        characterIndex += 1;
        setTimeout(typeRole, 45);
      } else if (!deleting) {
        deleting = true;
        setTimeout(typeRole, 1800);
      } else if (characterIndex > 0) {
        characterIndex -= 1;
        setTimeout(typeRole, 22);
      } else {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(typeRole, 250);
      }
    };
    setTimeout(typeRole, 1800);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal, .skill-groups').forEach((element) => observer.observe(element));

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('[data-count]').forEach((counter) => {
        const target = Number(counter.dataset.count);
        const started = performance.now();
        const duration = reducedMotion ? 0 : 950;
        const tick = (time) => {
          const amount = duration ? Math.min((time - started) / duration, 1) : 1;
          counter.textContent = Math.round(target * (1 - Math.pow(1 - amount, 3)));
          if (amount < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
      countObserver.unobserve(entry.target);
    });
  }, { threshold: 0.45 });
  countObserver.observe(document.querySelector('.metrics'));

  const modal = document.querySelector('.certificate-modal');
  const modalTitle = document.querySelector('#modal-title');
  const modalIssuer = document.querySelector('#modal-issuer');
  const modalDescription = document.querySelector('#modal-description');
  document.querySelectorAll('[data-certificate]').forEach((card) => {
    card.addEventListener('click', () => {
      const url = card.dataset.url;
      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer');
        return;
      }
      const [title, issuer, description] = card.dataset.certificate.split('|');
      modalTitle.textContent = title;
      modalIssuer.textContent = issuer;
      modalDescription.textContent = description;
      modal.showModal();
    });
  });
  document.querySelector('.modal-close').addEventListener('click', () => modal.close());
  modal.addEventListener('click', (event) => {
    if (event.target === modal) modal.close();
  });

  document.querySelector('.contact-form').addEventListener('submit', (event) => {
    event.preventDefault();
    event.currentTarget.querySelector('.form-note').textContent = 'Gracias. Configura tu servicio de correo para recibir este formulario.';
  });
  document.querySelector('#year').textContent = new Date().getFullYear();
})();
