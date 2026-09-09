// Diagnóstico contábil gratuito — formulário em etapas com envio via WhatsApp
document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('diag-form');
  if (!form) return;

  var steps = Array.prototype.slice.call(document.querySelectorAll('.diag-step'));
  var stepLabels = ['Sua situação', 'O que precisa', 'Prioridades', 'Seus dados'];
  var LAST = steps.length - 1;
  var current = 0;

  var state = {
    perfil: '',
    situacao: '',
    necessidades: [],
    prazo: '',
    nome: '',
    telefone: ''
  };

  var stepCount = document.getElementById('diag-step-count');
  var stepLabel = document.getElementById('diag-step-label');
  var barFill = document.getElementById('diag-bar-fill');
  var backBtn = document.getElementById('diag-back');
  var nextBtn = document.getElementById('diag-next');
  var errorMsg = document.getElementById('diag-error-msg');
  var summaryText = document.getElementById('diag-summary-text');

  document.querySelectorAll('.diag-option').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var group = btn.closest('[data-group]');
      var groupName = group.dataset.group;
      var multi = group.dataset.multi === 'true';
      var value = btn.dataset.value;

      if (multi) {
        var arr = state[groupName];
        var idx = arr.indexOf(value);
        if (idx > -1) {
          arr.splice(idx, 1);
          btn.classList.remove('selected');
        } else {
          arr.push(value);
          btn.classList.add('selected');
        }
      } else {
        group.querySelectorAll('.diag-option').forEach(function (b) { b.classList.remove('selected'); });
        btn.classList.add('selected');
        state[groupName] = value;
      }
      hideError();
    });
  });

  var nomeInput = document.getElementById('diag-nome');
  var telInput = document.getElementById('diag-telefone');
  nomeInput.addEventListener('input', function () { state.nome = nomeInput.value; });
  telInput.addEventListener('input', function () { state.telefone = telInput.value; });

  function hideError() { errorMsg.classList.remove('show'); }
  function showError(msg) { errorMsg.textContent = msg; errorMsg.classList.add('show'); }

  function validateStep() {
    if (current === 0) {
      if (!state.perfil || !state.situacao) {
        showError('Selecione as duas opções para continuar.');
        return false;
      }
    }
    if (current === 1) {
      if (state.necessidades.length === 0) {
        showError('Marque ao menos uma necessidade.');
        return false;
      }
    }
    if (current === 2) {
      if (!state.prazo) {
        showError('Selecione o seu prazo para continuar.');
        return false;
      }
    }
    hideError();
    return true;
  }

  function render() {
    steps.forEach(function (s) { s.classList.remove('active'); });
    steps[current].classList.add('active');
    stepCount.textContent = '0' + (current + 1) + ' / 0' + (LAST + 1);
    stepLabel.textContent = stepLabels[current];
    barFill.style.width = (((current + 1) / (LAST + 1)) * 100) + '%';
    backBtn.disabled = current === 0;

    if (current === LAST) {
      nextBtn.innerHTML = 'Enviar pelo WhatsApp <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
      nextBtn.classList.remove('btn-primary');
      nextBtn.classList.add('btn-gold');
      summaryText.textContent = [state.perfil, state.situacao].filter(Boolean).join(' · ') +
        ' — ' + state.necessidades.join(', ') + ' — ' + state.prazo;
    } else {
      nextBtn.innerHTML = 'Continuar <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
      nextBtn.classList.remove('btn-gold');
      nextBtn.classList.add('btn-primary');
    }
  }

  backBtn.addEventListener('click', function () {
    if (current > 0) { current--; hideError(); render(); }
  });

  nextBtn.addEventListener('click', function () {
    if (!validateStep()) return;

    if (current < LAST) {
      current++;
      render();
      return;
    }

    // Última etapa: valida dados e envia
    var errNome = document.getElementById('err-nome');
    var errTel = document.getElementById('err-telefone');
    errNome.textContent = '';
    errTel.textContent = '';
    var ok = true;
    if (!state.nome || state.nome.trim().length < 2) { errNome.textContent = 'Informe seu nome.'; ok = false; }
    if (!state.telefone || state.telefone.trim().length < 8) { errTel.textContent = 'Informe um telefone válido.'; ok = false; }
    if (!ok) return;

    var msg = 'Olá, Paula! Fiz o diagnóstico contábil gratuito no site.\n\n' +
      'Nome: ' + state.nome + '\n' +
      'Telefone: ' + state.telefone + '\n\n' +
      'Perfil: ' + state.perfil + '\n' +
      'Situação contábil: ' + state.situacao + '\n\n' +
      'O que precisa resolver:\n' + state.necessidades.map(function (n) { return '• ' + n; }).join('\n') + '\n\n' +
      'Prazo: ' + state.prazo;

    var url = 'https://wa.me/5582991943598?text=' + encodeURIComponent(msg);
    window.open(url, '_blank', 'noopener');
  });

  render();
});
