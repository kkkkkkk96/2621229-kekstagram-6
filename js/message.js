import { isEscapeKey } from './util.js';

const successTemplate = document.querySelector('#success').content.querySelector('.success');
const errorTemplate = document.querySelector('#error').content.querySelector('.error');

let isErrorShown = false;

const showMessage = (template, closeButtonClass, isError = false) => {
  const messageElement = template.cloneNode(true);
  const closeButton = messageElement.querySelector(closeButtonClass);

  if (isError) {
    isErrorShown = true;
  }

  const onCloseButtonClick = () => {
    messageElement.remove();
    document.removeEventListener('keydown', onDocumentKeydown);
    document.removeEventListener('click', onDocumentClick);
    if (isError) {
      isErrorShown = false;
    }
  };

  function onDocumentKeydown(evt) {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      onCloseButtonClick();
    }
  }

  function onDocumentClick(evt) {
    if (evt.target === messageElement) {
      onCloseButtonClick();
    }
  }

  closeButton.addEventListener('click', onCloseButtonClick);
  document.addEventListener('keydown', onDocumentKeydown);
  document.addEventListener('click', onDocumentClick);

  document.body.append(messageElement);
};

const showSuccessMessage = () => showMessage(successTemplate, '.success__button');
const showErrorMessage = () => showMessage(errorTemplate, '.error__button', true);
const isErrorMessageShown = () => isErrorShown;

const showAlert = (message) => {
  const alertContainer = document.createElement('div');
  alertContainer.classList.add('data-error');

  alertContainer.textContent = message;

  document.body.append(alertContainer);

  setTimeout(() => {
    alertContainer.remove();
  }, 5000);
};

export { showSuccessMessage, showErrorMessage, showAlert, isErrorMessageShown };
