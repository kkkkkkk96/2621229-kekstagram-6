import { openFullPhoto } from './big-photo.js';

// Сохраняем данные фотографий в глобальной переменной для доступа из обработчиков
let photosData = [];

// Функция для создания DOM-элемента на основе шаблона
const createThumbnailElement = (photo) => {
  const template = document.querySelector('#picture').content.querySelector('.picture');
  const thumbnailElement = template.cloneNode(true);
  const image = thumbnailElement.querySelector('.picture__img');
  const likes = thumbnailElement.querySelector('.picture__likes');
  const comments = thumbnailElement.querySelector('.picture__comments');
  // Заполняем данные согласно требованиям
  image.src = photo.url;
  image.alt = photo.description;
  likes.textContent = photo.likes;
  comments.textContent = photo.comments.length;
  // Добавляем данные фото в элемент для дальнейшего использования
  thumbnailElement.dataset.photoId = photo.id;
  return thumbnailElement;
};

// Функция для отрисовки всех миниатюр
const renderThumbnails = (photos) => {
  photosData = photos; // Сохраняем данные в глобальную переменную
  const picturesContainer = document.querySelector('.pictures');
  if (!picturesContainer) {
    return;
  }
  // Очищаем контейнер перед добавлением новых элементов
  const existingPictures = picturesContainer.querySelectorAll('.picture');
  existingPictures.forEach((picture) => picture.remove());
  // Создаем DocumentFragment для эффективной вставки
  const fragment = document.createDocumentFragment();
  photosData.forEach((photo) => {
    const thumbnailElement = createThumbnailElement(photo);
    fragment.appendChild(thumbnailElement);
  });
  // Вставляем все элементы одним действием
  picturesContainer.appendChild(fragment);
};

// Функция для инициализации обработчиков событий
const initThumbnailsHandlers = () => {
  const picturesContainer = document.querySelector('.pictures');
  if (!picturesContainer) {
    return;
  }
  // Используем делегирование событий для обработки кликов по миниатюрам
  picturesContainer.addEventListener('click', (evt) => {
    const thumbnail = evt.target.closest('.picture');
    if (thumbnail) {
      evt.preventDefault();
      const photoId = parseInt(thumbnail.dataset.photoId, 10);
      const photoData = photosData.find((photo) => photo.id === photoId);
      if (photoData) {
        openFullPhoto(photoData);
      }
    }
  });
};

export { renderThumbnails, initThumbnailsHandlers };
