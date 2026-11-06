(() => {
  'use strict';

  document.documentElement.classList.add('js');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const WHATSAPP = '5524981402661';

  /* ---------- Projects ---------- */
  const projects = [
    {
      name: 'Governo Presente',
      tag: 'Aplicativo · Setor público',
      sub: 'App oficial da Prefeitura de Barra Mansa',
      challenge: 'Alvarás, recadastramento e benefícios dependiam de atendimento presencial e de dias de análise manual.',
      delivery: 'App que aproxima o cidadão dos serviços públicos: valida laudos médicos e carteiras PCD automaticamente, levando aprovações de dias para minutos.',
      stack: 'React Native · Laravel · Docker · IA',
      url: 'https://appbarramansa.com.br/',
      img: 'assets/images/governo-presente.jpg',
    },
    {
      name: 'Restly',
      tag: 'SaaS · Restaurantes & delivery',
      sub: 'Gestão completa de estabelecimentos',
      challenge: 'Pedido anotado errado, conta que demora, caixa que não fecha e estoque controlado no “achômetro”.',
      delivery: 'SaaS que coloca o restaurante no controle — do QR Code na mesa e do delivery em tempo real ao fechamento do caixa.',
      stack: 'SaaS · Tempo real · Multi-tenant',
      url: 'https://restly.com.br/',
      img: 'assets/images/restly.jpg',
    },
    {
      name: 'Circular Kids',
      tag: 'Sistema de gestão · Varejo',
      sub: 'Painel administrativo da loja',
      challenge: 'A operação da loja estava espalhada entre planilhas e controles manuais.',
      delivery: 'Sistema de gestão completo da loja em um só painel, com acesso autenticado e controle da operação de ponta a ponta.',
      stack: 'Backend · Painel administrativo · Autenticação',
      url: 'https://circularkids.com.br/login',
      img: 'assets/images/circularkids.jpg',
    },
    {
      name: 'Adapt Social',
      tag: 'Ferramenta interna · Adapt Crew',
      sub: 'Widgets de reels integrados ao Instagram',
      challenge: 'Clientes queriam exibir seus reels nos sites sem depender de plugins genéricos e engessados.',
      delivery: 'Sistema interno para criar widgets de reels personalizados, integrados ao Instagram e prontos para embutir em qualquer site.',
      stack: 'Integração Instagram · Widgets · Webhooks',
      url: 'https://adaptsocial.igdev.com.br/',
      img: 'assets/images/adapt-social.jpg',
    },
    {
      name: 'Terra Gaúcha',
      tag: 'Site institucional · Restaurante · EUA',
      sub: 'Churrascaria brasileira autêntica',
      challenge: 'Uma rede de churrascarias com várias unidades precisava converter visitas em reservas e grupos.',
      delivery: 'Site com cardápio, unidades, promoções, eventos para grupos, gift cards e programa de fidelidade, com reserva sempre a um clique.',
      stack: 'WordPress · Integrações sob medida · GTM',
      url: 'https://terragaucha.com/',
      img: 'assets/images/terra-gaucha.jpg',
    },
    {
      name: 'Original Ice Cream',
      tag: 'Site institucional · Alimentos · EUA',
      sub: 'Picolés artesanais 100% naturais',
      challenge: 'A marca vendia para o consumidor final e para revendedores, mas não tinha um canal claro para cada público.',
      delivery: 'Site com catálogo de produtos e fluxos para parceiros, white label e distribuidores, além de eventos, carreiras e contato direto via WhatsApp.',
      stack: 'WordPress · Elementor · Integrações',
      url: 'https://originalicecream.com/',
      img: 'assets/images/original-ice-cream.jpg',
    },
    {
      name: 'IBP Outdoor Living',
      tag: 'Site institucional · Construção · EUA',
      sub: 'Pavers, pergolados e áreas externas na Flórida',
      challenge: 'Projetos de alto padrão precisavam de uma vitrine à altura e de um caminho direto para o orçamento.',
      delivery: 'Site com serviços, portfólio de obras, áreas de atuação e blog, com captação de orçamento gratuita em destaque.',
      stack: 'WordPress · Elementor · Captação de leads',
      url: 'https://ibpoutdoorliving.com/',
      img: 'assets/images/ibp-outdoor-living.jpg',
    },
  ];

  const section = document.getElementById('projetos');
  if (section) {
    const info = section.querySelector('.projects__info');
    const tabsEl = section.querySelector('.projects__tabs');
    const deck = section.querySelector('[data-p="deck"]');
    const field = (k) => section.querySelector(`[data-p="${k}"]`);
    const DURATION = 7000;
    const N = projects.length;
    const MAX_DEPTH = 3;
    let current = 0;
    let timer = null;

    // Build the stacked deck: one card per project
    const cards = projects.map((p, i) => {
      const a = document.createElement('a');
      a.className = 'deck__card';
      a.href = p.url;
      a.target = '_blank';
      a.rel = 'noopener';
      a.innerHTML = `
        <span class="deck__inner">
          <span class="deck__bar" aria-hidden="true"><i></i><i></i><i></i><span class="deck__url"></span></span>
          <span class="deck__view"><img alt="" width="1440" height="900" decoding="async"></span>
        </span>`;
      a.querySelector('.deck__url').textContent = new URL(p.url).host;
      const im = a.querySelector('img');
      im.src = p.img;
      im.alt = `Tela do projeto ${p.name}`;
      // cards behind the front one bring their project forward instead of opening the link
      a.addEventListener('click', (e) => {
        if (i !== current) { e.preventDefault(); go(i); restart(); }
      });
      a.addEventListener('animationend', () => a.classList.remove('is-leaving'));
      deck.appendChild(a);
      return a;
    });

    // Depth 0 = front. The card right behind is the previous project, so
    // "next" pulls the backmost card to the front (as in the reference).
    function layout(prev) {
      cards.forEach((c, i) => {
        const d = (current - i + N) % N;
        // only the first few cards fan out; the rest wait hidden at the back
        c.style.setProperty('--d', Math.min(d, MAX_DEPTH));
        c.classList.toggle('is-back', d !== 0);
        c.classList.toggle('is-hidden', d > MAX_DEPTH);
        c.tabIndex = d === 0 ? 0 : -1;
        c.setAttribute('aria-hidden', String(d !== 0));
      });
      // a front card that is sent to the very back slides out instead of popping behind
      if (prev != null && prev !== current && !reduceMotion) {
        const dPrev = (current - prev + N) % N;
        if (dPrev === N - 1 && N > 2) {
          cards[prev].classList.remove('is-leaving');
          void cards[prev].offsetWidth;
          cards[prev].classList.add('is-leaving');
        }
      }
    }

    const tabs = projects.map((p, i) => {
      const b = document.createElement('button');
      b.className = 'tab';
      b.type = 'button';
      b.role = 'tab';
      b.textContent = p.name;
      b.setAttribute('aria-selected', 'false');
      b.addEventListener('click', () => { go(i); restart(); });
      tabsEl.appendChild(b);
      return b;
    });
    section.style.setProperty('--dur', `${DURATION}ms`);

    function fill(p) {
      field('tag').textContent = p.tag;
      field('name').textContent = p.name;
      field('sub').textContent = p.sub;
      field('challenge').textContent = p.challenge;
      field('delivery').textContent = p.delivery;
      field('stack').textContent = p.stack;
      field('url').href = p.url;
    }

    function go(i, instant = false) {
      const prev = current;
      current = (i + N) % N;
      // deselect all + reflow so the progress bar animation restarts
      tabs.forEach((t) => t.setAttribute('aria-selected', 'false'));
      void tabsEl.offsetWidth;
      tabs[current].setAttribute('aria-selected', 'true');
      const p = projects[current];
      if (instant || reduceMotion || prev === current) { layout(); fill(p); return; }
      layout(prev);
      info.classList.add('is-out');
      setTimeout(() => {
        fill(p);
        info.classList.remove('is-out');
      }, 320);
    }

    function restart() {
      clearInterval(timer);
      if (reduceMotion) return;
      timer = setInterval(() => go(current + 1), DURATION);
    }

    section.querySelectorAll('.arrow').forEach((a) =>
      a.addEventListener('click', () => { go(current + Number(a.dataset.dir)); restart(); })
    );

    const stage = section.querySelector('.projects__grid');
    stage.addEventListener('mouseenter', () => { clearInterval(timer); section.classList.add('is-paused'); });
    stage.addEventListener('mouseleave', () => { section.classList.remove('is-paused'); go(current, true); restart(); });

    section.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { go(current + 1); restart(); }
      if (e.key === 'ArrowLeft') { go(current - 1); restart(); }
    });

    go(0, true);
    restart();
  }

  /* ---------- Marquee: duplicate items for seamless loop ---------- */
  document.querySelectorAll('.marquee__track').forEach((t) => {
    t.innerHTML += t.innerHTML;
    [...t.children].slice(t.children.length / 2).forEach((c) => c.setAttribute('aria-hidden', 'true'));
  });

  /* ---------- Split headings into words ---------- */
  document.querySelectorAll('.split').forEach((el) => {
    let i = 0;
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            const w = document.createElement('span');
            w.className = 'w';
            w.innerHTML = '<span></span>';
            w.firstChild.textContent = part;
            w.firstChild.style.setProperty('--i', i++);
            frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') {
          walk(n);
        }
      });
    };
    walk(el);
    el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
  });

  /* ---------- Reveal on scroll ---------- */
  const groups = new Map();
  document.querySelectorAll('.reveal').forEach((el) => {
    const parent = el.parentElement;
    const idx = groups.get(parent) || 0;
    el.style.setProperty('--d', `${Math.min(idx, 6) * 80}ms`);
    groups.set(parent, idx + 1);
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal, .split, .deck').forEach((el) => io.observe(el));

  /* ---------- Active nav link ---------- */
  const links = [...document.querySelectorAll('.nav a')];
  const navIo = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((l) => l.classList.toggle('is-active', l.getAttribute('href') === `#${e.target.id}`));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  links.forEach((l) => { const s = document.querySelector(l.getAttribute('href')); if (s) navIo.observe(s); });

  /* ---------- Scroll-driven bits: back-to-top + footer wordmark ---------- */
  const toTop = document.querySelector('.to-top');
  const mark = document.querySelector('.contact__mark');
  const contact = document.getElementById('contato');
  let ticking = false;
  const onScroll = () => {
    ticking = false;
    toTop.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.8);
    if (mark && !reduceMotion) {
      const r = contact.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, 1 - r.top / window.innerHeight));
      mark.style.setProperty('--mark-y', `${(1 - progress) * 40 + 10}%`);
    }
  };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* ---------- Accordion: keep one open ---------- */
  const accs = [...document.querySelectorAll('.acc')];
  accs.forEach((d) => d.addEventListener('toggle', () => {
    if (d.open) accs.forEach((o) => { if (o !== d) o.open = false; });
  }));

  /* ---------- Contact form -> WhatsApp ---------- */
  const form = document.getElementById('contact-form');
  if (form) {
    const err = form.querySelector('.form__error');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const nome = (data.get('nome') || '').toString().trim();
      if (!nome) { err.hidden = false; form.nome.focus(); return; }
      err.hidden = true;
      const empresa = (data.get('empresa') || '').toString().trim();
      const tipos = data.getAll('tipo');
      const msg = (data.get('mensagem') || '').toString().trim();
      const lines = [
        `Olá, Igor! Meu nome é ${nome}${empresa ? `, da ${empresa}` : ''}.`,
        tipos.length ? `Preciso de: ${tipos.join(', ')}.` : '',
        msg,
      ].filter(Boolean);
      window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener');
    });
  }

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
