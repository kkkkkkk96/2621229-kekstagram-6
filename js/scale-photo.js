const SCALE_STEP = 25;
const SCALE_MIN = 25;
const SCALE_MAX = 100;
const SCALE_DEFAULT = 100;
const DEFAULT_EFFECT_LEVEL = 100;

const EFFECTS = {
  none: {
    range: { min: 0, max: 100 },
    start: 100,
    step: 1,
    unit: '',
    connect: 'lower',
    style: 'none'
  },
  chrome: {
    range: { min: 0, max: 1 },
    start: 1,
    step: 0.1,
    unit: '',
    style: 'grayscale'
  },
  sepia: {
    range: { min: 0, max: 1 },
    start: 1,
    step: 0.1,
    unit: '',
    style: 'sepia'
  },
  marvin: {
    range: { min: 0, max: 100 },
    start: 100,
    step: 1,
    unit: '%',
    style: 'invert'
  },
  phobos: {
    range: { min: 0, max: 3 },
    start: 3,
    step: 0.1,
    unit: 'px',
    style: 'blur'
  },
  heat: {
    range: { min: 1, max: 3 },
    start: 3,
    step: 0.1,
    unit: '',
    style: 'brightness'
  }
};

let currentScale = SCALE_DEFAULT;
let currentEffect = 'none';
let isSliderInitialized = false;

let imagePreview;
let scaleValueInput;
let effectLevelInput;
let effectSliderContainer;
let effectRadios;

function initDOMElements() {
  const form = document.querySelector('.img-upload__form');
  imagePreview = form.querySelector('.img-upload__preview img');
  scaleValueInput = form.querySelector('.scale__control--value');
  effectLevelInput = form.querySelector('.effect-level__value');
  effectSliderContainer = form.querySelector('.effect-level__slider');
  effectRadios = form.querySelectorAll('input[name="effect"]');
}

function initEffectSlider() {
  if (!effectSliderContainer || isSliderInitialized) {
    return;
  }

  noUiSlider.create(effectSliderContainer, {
    range: {
      min: 0,
      max: 100,
    },
    start: 100,
    step: 1,
    connect: 'lower',
    format: {
      to: function (value) {
        if (Number.isInteger(value)) {
          return value.toFixed(0);
        }
        return value.toFixed(1);
      },
      from: function (value) {
        return parseFloat(value);
      },
    },
  });

  isSliderInitialized = true;

  effectSliderContainer.noUiSlider.on('update', () => {
    const value = effectSliderContainer.noUiSlider.get();
    updateEffectLevel(value);
  });
}

function resetEffectSlider() {
  if (!effectSliderContainer) {
    return;
  }

  effectSliderContainer.closest('.img-upload__effect-level').classList.add('hidden');

  if (isSliderInitialized) {
    effectSliderContainer.noUiSlider.set(DEFAULT_EFFECT_LEVEL);
  }

  if (effectLevelInput) {
    effectLevelInput.value = '';
  }

  if (imagePreview) {
    imagePreview.style.filter = 'none';
  }
  currentEffect = 'none';
}

function updateEffectLevel(value) {
  if (!effectLevelInput || !imagePreview) {
    return;
  }

  effectLevelInput.value = value;

  applyEffect(currentEffect, value);
}

function applyEffect(effectName, level) {
  if (!imagePreview) {
    return;
  }

  const effect = EFFECTS[effectName] || EFFECTS.none;

  if (effect.style === 'none') {
    imagePreview.style.filter = 'none';
    return;
  }

  imagePreview.style.filter = `${effect.style}(${level}${effect.unit})`;
}

function updateScaleValue() {
  if (scaleValueInput) {
    scaleValueInput.value = `${currentScale}%`;
  }

  if (imagePreview) {
    imagePreview.style.transform = `scale(${currentScale / 100})`;
  }
}

function onScaleSmallerClick() {
  currentScale = Math.max(currentScale - SCALE_STEP, SCALE_MIN);
  updateScaleValue();
}

function onScaleBiggerClick() {
  currentScale = Math.min(currentScale + SCALE_STEP, SCALE_MAX);
  updateScaleValue();
}

function resetScale() {
  currentScale = SCALE_DEFAULT;
  updateScaleValue();
}

function resetImage() {
  if (imagePreview) {
    imagePreview.src = 'img/upload-default-image.jpg';
    imagePreview.style.filter = '';
    imagePreview.style.transform = '';
  }
}

function initEventHandlers() {
  const form = document.querySelector('.img-upload__form');
  const scaleSmallerBtn = form.querySelector('.scale__control--smaller');
  const scaleBiggerBtn = form.querySelector('.scale__control--bigger');

  if (scaleSmallerBtn) {
    scaleSmallerBtn.addEventListener('click', onScaleSmallerClick);
  }

  if (scaleBiggerBtn) {
    scaleBiggerBtn.addEventListener('click', onScaleBiggerClick);
  }

  effectRadios.forEach((radio) => {
    radio.addEventListener('change', function() {
      const effectName = this.value;
      currentEffect = effectName;
      const effectConfig = EFFECTS[effectName];
      const effectSlider = effectSliderContainer.closest('.img-upload__effect-level');

      if (effectName !== 'none') {
        if (effectSlider) {
          effectSlider.classList.remove('hidden');
        }

        if (!isSliderInitialized) {
          initEffectSlider();
        }

        effectSliderContainer.noUiSlider.updateOptions({
          range: effectConfig.range,
          step: effectConfig.step,
          start: effectConfig.start,
        });

        // Force update to apply the start value immediately
        effectSliderContainer.noUiSlider.set(effectConfig.start);
      } else {
        if (effectSlider) {
          effectSlider.classList.add('hidden');
        }
        applyEffect('none');
      }
    });
  });
}

// Основная функция инициализации
function initScaleEditor() {
  initDOMElements();
  updateScaleValue();
  resetEffectSlider();
  initEventHandlers();
}

// Экспорт функций для внешнего использования
export {
  initScaleEditor,
  onScaleSmallerClick,
  onScaleBiggerClick,
  resetScale,
  resetEffectSlider,
  resetImage,
  applyEffect,
  updateEffectLevel
};
