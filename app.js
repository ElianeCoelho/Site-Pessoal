const { subjects, socials } = window.SITE_CONTENT;
const grid = document.querySelector('#subjectGrid');
const modal = document.querySelector('#subjectModal');
const modalContent = document.querySelector('#modalContent');

grid.innerHTML = subjects.map((s, i) => `
  <article class="subject-card ${s.tone}">
    <div class="card-top"><span class="subject-icon">${s.icon}</span><span class="card-number">0${i + 1}</span></div>
    <h3>${s.title}</h3><p>${s.description}</p>
    <button class="card-link" data-subject="${i}">Ver materiais <span>↗</span></button>
  </article>`).join('');

document.querySelector('#socialGrid').innerHTML = socials.map(s => `
  <a class="social-card" href="${s.url}" target="_blank" rel="noopener">
    <span class="social-icon">${s.icon}</span><span><strong>${s.name}</strong><small>${s.detail}</small></span><b>↗</b>
  </a>`).join('');

grid.addEventListener('click', (event) => {
  const button = event.target.closest('[data-subject]');
  if (!button) return;
  const s = subjects[Number(button.dataset.subject)];
  modalContent.innerHTML = `<p class="eyebrow">ÁREA DA DISCIPLINA</p><h2>${s.title}</h2><p>${s.description}</p><div class="material-list">${s.materials.map((m, i) => `<div><span>0${i+1}</span><strong>${m}</strong><small>Os arquivos serão publicados aqui conforme as aulas.</small></div>`).join('')}</div>`;
  modal.showModal();
});

document.querySelector('.modal-close').addEventListener('click', () => modal.close());
modal.addEventListener('click', e => { if (e.target === modal) modal.close(); });
document.querySelector('#year').textContent = new Date().getFullYear();

const menu = document.querySelector('.menu-button');
menu.addEventListener('click', () => {
  const open = document.body.classList.toggle('menu-open');
  menu.setAttribute('aria-expanded', open);
});
document.querySelectorAll('.nav a').forEach(a => a.addEventListener('click', () => document.body.classList.remove('menu-open')));
