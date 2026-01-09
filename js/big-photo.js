const bigPicture = document.querySelector('.big-picture');
const closeButton = bigPicture.querySelector('.big-picture__cancel');
const socialComments = bigPicture.querySelector('.social__comments');
const commentsCount = bigPicture.querySelector('.social__comment-count');
const commentsLoader = bigPicture.querySelector('.comments-loader');

const COMMENTS_PER_PORTION = 5;

// Переменные для управления комментариями
let currentComments = [];
let commentsShown = 0;

// Функция для создания элемента комментария
const createCommentElement = (comment) => {
  const commentElement = document.createElement('li');
  commentElement.classList.add('social__comment');
  commentElement.innerHTML = `
    <img
      class="social__picture"
      src="${comment.avatar}"
      alt="${comment.name}"
      width="35" height="35">
    <p class="social__text">${comment.message}</p>
  `;
  return commentElement;
};

// Функция для отрисовки порции комментариев
const renderCommentsPortion = () => {
  const commentsToShow = currentComments.slice(commentsShown, commentsShown + COMMENTS_PER_PORTION);
  commentsToShow.forEach((comment) => {
    const commentElement = createCommentElement(comment);
    socialComments.appendChild(commentElement);
  });
  commentsShown += commentsToShow.length;
  // Обновляем счетчик комментариев
  commentsCount.innerHTML = `<span class="social__comment-shown-count">${commentsShown}</span> из <span class="social__comment-total-count">${currentComments.length}</span> комментариев`;
  // Скрываем кнопку, если все комментарии показаны
  if (commentsShown >= currentComments.length) {
    commentsLoader.classList.add('hidden');
  } else {
    commentsLoader.classList.remove('hidden');
  }
};

// Функция для сброса состояния комментариев
const resetCommentsState = () => {
  currentComments = [];
  commentsShown = 0;
  socialComments.innerHTML = '';
};

// Функция для открытия полноразмерного изображения
const openFullPhoto = (photoData) => {
  resetCommentsState();
  // Заполняем основные данные
  bigPicture.querySelector('.big-picture__img img').src = photoData.url;
  bigPicture.querySelector('.big-picture__img img').alt = photoData.description;
  bigPicture.querySelector('.likes-count').textContent = photoData.likes;
  bigPicture.querySelector('.social__comment-total-count').textContent = photoData.comments.length;
  bigPicture.querySelector('.social__caption').textContent = photoData.description;
  // Сохраняем комментарии и отображаем первую порцию
  currentComments = photoData.comments;
  renderCommentsPortion();
  // Показываем блоки счётчика комментариев
  commentsCount.classList.remove('hidden');
  // Показываем окно
  bigPicture.classList.remove('hidden');
  // Добавляем класс для body
  document.body.classList.add('modal-open');
};

// Функция для закрытия полноразмерного изображения
const closeFullPhoto = () => {
  bigPicture.classList.add('hidden');
  document.body.classList.remove('modal-open');
  resetCommentsState();
};

// Обработчик загрузки дополнительных комментариев
commentsLoader.addEventListener('click', () => {
  renderCommentsPortion();
});

// Обработчик закрытия по клику на кнопку
closeButton.addEventListener('click', () => {
  closeFullPhoto();
});

// Обработчик закрытия по клавише Esc
document.addEventListener('keydown', (evt) => {
  if (evt.key === 'Escape' && !bigPicture.classList.contains('hidden')) {
    closeFullPhoto();
  }
});

// Экспортируем функцию для использования в других модулях
export { openFullPhoto };
