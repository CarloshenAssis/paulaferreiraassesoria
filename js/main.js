// Paula Ferreira Assessoria Contábil — interações
document.addEventListener('DOMContentLoaded', function () {
  // Menu mobile
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
      toggle.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
      });
    });
  }

  // Tabs de serviços
  var tabs = document.querySelectorAll('.tab-btn');
  var panels = document.querySelectorAll('.service-panel');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) { t.classList.remove('active'); });
      panels.forEach(function (p) { p.classList.remove('active'); });
      tab.classList.add('active');
      var target = document.getElementById(tab.dataset.target);
      if (target) target.classList.add('active');
    });
  });

  // Fallback de imagens: se a foto real não existir ainda, mostra placeholder
  document.querySelectorAll('img[data-fallback]').forEach(function (img) {
    img.addEventListener('error', function () {
      var wrap = img.closest('[data-photo]');
      if (wrap) wrap.classList.add('is-fallback');
    });
  });

  // Ano no rodapé
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
