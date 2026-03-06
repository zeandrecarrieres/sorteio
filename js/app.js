/**
 * Wine Raffle App — Main JavaScript
 * Handles: multi-step form navigation, validation, Firebase submission, coupon generation
 */

'use strict';

// ─── State ───────────────────────────────────────────────────────────────────
let currentStep = 1;
const TOTAL_STEPS = 3;

// ─── DOM Ready ────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  initPhoneMask();
  initConditionals();
  initNavigation();
});

// ─── Phone Mask ───────────────────────────────────────────────────────────────
function initPhoneMask() {
  const celInput = document.getElementById('celular');
  if (!celInput) return;

  celInput.addEventListener('input', function () {
    let value = this.value.replace(/\D/g, '').slice(0, 11);
    if (value.length > 6) {
      value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    } else if (value.length > 2) {
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else if (value.length > 0) {
      value = `(${value}`;
    }
    this.value = value;
  });
}

// ─── Conditional Inputs ───────────────────────────────────────────────────────
function initConditionals() {
  // "Participa de grupos?" → show text input if "Sim"
  const grupoRadios = document.querySelectorAll('input[name="participaGrupo"]');
  const grupoQuaisWrap = document.getElementById('grupoQuaisWrap');
  if (!grupoRadios.length || !grupoQuaisWrap) return;

  grupoRadios.forEach(radio => {
    radio.addEventListener('change', function () {
      if (this.value === 'sim') {
        grupoQuaisWrap.classList.add('visible');
      } else {
        grupoQuaisWrap.classList.remove('visible');
        const field = document.getElementById('grupoQuais');
        if (field) field.value = '';
      }
    });
  });
}

// ─── Navigation ───────────────────────────────────────────────────────────────
function initNavigation() {
  // Step 1 → 2
  const btnStep1Next = document.getElementById('btnStep1Next');
  if (btnStep1Next) {
    btnStep1Next.addEventListener('click', function () {
      if (validateStep1()) goToStep(2);
    });
  }

  // Step 2 → back
  const btnStep2Back = document.getElementById('btnStep2Back');
  if (btnStep2Back) btnStep2Back.addEventListener('click', () => goToStep(1));

  // Step 2 → 3
  const btnStep2Next = document.getElementById('btnStep2Next');
  if (btnStep2Next) {
    btnStep2Next.addEventListener('click', function () {
      if (validateStep2()) goToStep(3);
    });
  }

  // Step 3 → back
  const btnStep3Back = document.getElementById('btnStep3Back');
  if (btnStep3Back) btnStep3Back.addEventListener('click', () => goToStep(2));

  // Submit
  const form = document.getElementById('raffleForm');
  if (form) form.addEventListener('submit', handleSubmit);
}

function goToStep(step) {
  // Hide current
  const current = document.getElementById('step' + currentStep);
  if (current) current.classList.remove('active');

  // Show next
  const next = document.getElementById('step' + step);
  if (next) {
    next.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  currentStep = step;
  updateStepUI();
}

function updateStepUI() {
  const progress = (currentStep / TOTAL_STEPS) * 100;
  const progressBar = document.getElementById('progressBar');
  if (progressBar) progressBar.style.width = progress + '%';

  for (let i = 1; i <= TOTAL_STEPS; i++) {
    const dot = document.getElementById('dot-' + i);
    const lbl = document.getElementById('lbl-' + i);

    if (!dot || !lbl) continue;
    dot.classList.remove('active', 'done');
    lbl.classList.remove('active', 'done');

    if (i < currentStep) { dot.classList.add('done'); dot.textContent = '✓'; lbl.classList.add('done'); }
    else if (i === currentStep) { dot.classList.add('active'); dot.textContent = i; lbl.classList.add('active'); }
    else { dot.textContent = i; }
  }

  // Step connecting lines
  const line12 = document.getElementById('line-1-2');
  const line23 = document.getElementById('line-2-3');
  if (line12) line12.classList.toggle('done', currentStep > 1);
  if (line23) line23.classList.toggle('done', currentStep > 2);
}

// ─── Validation ───────────────────────────────────────────────────────────────
function showError(id, show) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.toggle('visible', show);
}

function setFieldError(inputEl, hasError) {
  if (!inputEl) return;
  inputEl.classList.toggle('error', hasError);
}

function validateStep1() {
  let valid = true;

  const nome = document.getElementById('nome');
  const email = document.getElementById('email');
  const celular = document.getElementById('celular');

  const nomeOk = nome && nome.value.trim().split(' ').length >= 2 && nome.value.trim().length >= 4;
  setFieldError(nome, !nomeOk);
  showError('err-nome', !nomeOk);
  if (!nomeOk) valid = false;

  const emailOk = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
  setFieldError(email, !emailOk);
  showError('err-email', !emailOk);
  if (!emailOk) valid = false;

  const phoneDigits = celular ? celular.value.replace(/\D/g, '') : '';
  const celularOk = phoneDigits.length >= 10;
  setFieldError(celular, !celularOk);
  showError('err-celular', !celularOk);
  if (!celularOk) valid = false;

  return valid;
}

function validateStep2() {
  let valid = true;

  const tiposVinho = document.querySelectorAll('input[name="tiposVinho"]:checked');
  const tiposOk = tiposVinho.length > 0;
  showError('err-tiposVinho', !tiposOk);
  if (!tiposOk) valid = false;

  const frequencia = document.querySelector('input[name="frequencia"]:checked');
  showError('err-frequencia', !frequencia);
  if (!frequencia) valid = false;

  const vinhosFranceses = document.querySelector('input[name="vinhosFranceses"]:checked');
  showError('err-vinhosFranceses', !vinhosFranceses);
  if (!vinhosFranceses) valid = false;

  const ondeCompra = document.querySelectorAll('input[name="ondeCompra"]:checked');
  const ondeOk = ondeCompra.length > 0;
  showError('err-ondeCompra', !ondeOk);
  if (!ondeOk) valid = false;

  const comoEscolhe = document.querySelectorAll('input[name="comoEscolhe"]:checked');
  const comoOk = comoEscolhe.length > 0;
  showError('err-comoEscolhe', !comoOk);
  if (!comoOk) valid = false;

  // Scroll to first error if any
  if (!valid) {
    const firstError = document.querySelector('#step2 .field-error.visible');
    if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  return valid;
}

function validateStep3() {
  const interesseExclusivos = document.querySelector('input[name="interesseExclusivos"]:checked');
  const ok = !!interesseExclusivos;
  showError('err-interesseExclusivos', !ok);
  return ok;
}

// ─── Coupon Generator ─────────────────────────────────────────────────────────
function generateCoupon() {
  return 'Padel2026';
}

// ─── Data Collection ──────────────────────────────────────────────────────────
function collectFormData(coupon) {
  const getChecked = (name) => [...document.querySelectorAll(`input[name="${name}"]:checked`)].map(el => el.value);
  const getRadio = (name) => { const el = document.querySelector(`input[name="${name}"]:checked`); return el ? el.value : null; };
  const getVal = (id) => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
  const getCheckbox = (id) => { const el = document.getElementById(id); return el ? el.checked : false; };

  const participaGrupo = getRadio('participaGrupo');

  return {
    nome: getVal('nome'),
    email: getVal('email').toLowerCase(),
    celular: getVal('celular'),
    cupom: coupon,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    pesquisa: {
      tiposVinho: getChecked('tiposVinho'),
      frequencia: getRadio('frequencia'),
      vinhosFranceses: getRadio('vinhosFranceses'),
      ondeCompra: getChecked('ondeCompra'),
      gruposVinho: {
        participa: participaGrupo === 'sim',
        quais: participaGrupo === 'sim' ? getVal('grupoQuais') : ''
      },
      comoEscolhe: getChecked('comoEscolhe'),
      interesseExclusivos: getRadio('interesseExclusivos'),
      autorizaEnvio: getCheckbox('autorizaEnvio')
    }
  };
}

// ─── Submit Handler ───────────────────────────────────────────────────────────
async function handleSubmit(e) {
  e.preventDefault();

  if (!validateStep3()) return;

  const btn = document.getElementById('btnSubmit');
  const btnText = document.getElementById('btnSubmitText');
  const spinner = document.getElementById('btnSpinner');

  // UI — loading state
  btn.disabled = true;
  btnText.style.display = 'none';
  spinner.style.display = 'block';

  try {
    const email = document.getElementById('email').value.trim().toLowerCase();
    const celular = document.getElementById('celular').value.trim();

    // Check duplicate email OR phone
    const [existingEmail, existingPhone] = await Promise.all([
      db.collection('participantes').where('email', '==', email).limit(1).get(),
      db.collection('participantes').where('celular', '==', celular).limit(1).get()
    ]);

    if (!existingEmail.empty || !existingPhone.empty) {
      showToast('⚠️ Você já está cadastrado no sorteio!', 'error');
      btn.disabled = false;
      btnText.style.display = 'inline';
      spinner.style.display = 'none';
      return;
    }

    // Generate unique coupon
    const coupon = generateCoupon();

    // Build data object
    const data = collectFormData(coupon);

    // Save to Firestore
    await db.collection('participantes').add(data);

    // Store coupon for success page
    sessionStorage.setItem('raffleCoupon', coupon);

    // Redirect to success page
    window.location.href = 'success.html';

  } catch (err) {
    console.error('Erro ao salvar:', err);

    // Friendly error message
    let msg = '❌ Erro ao salvar. Verifique sua conexão e tente novamente.';
    if (err.code === 'permission-denied') {
      msg = '❌ Permissão negada. Configure as regras do Firestore.';
    }
    showToast(msg, 'error');

    btn.disabled = false;
    btnText.style.display = 'inline';
    spinner.style.display = 'none';
  }
}

// ─── Toast Helper ─────────────────────────────────────────────────────────────
function showToast(msg, type = '') {
  let toast = document.getElementById('globalToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'globalToast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.className = 'toast' + (type ? ' ' + type : '');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}
