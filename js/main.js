import { renderThumbnails, initThumbnailsHandlers } from './pictures.js';
import { initForm, setFormSubmit } from './form.js';
import { initScaleEditor } from './scale-photo.js';
import { getData } from './api.js';
import { showAlert } from './message.js';
import { initFilters } from './filters.js';
import { debounce } from './util.js';

getData()
  .then((photos) => {
    renderThumbnails(photos);
    initFilters(photos, debounce(renderThumbnails));
    initThumbnailsHandlers();
  })
  .catch((err) => {
    showAlert(err.message);
  });

setFormSubmit();
initForm();
initScaleEditor();
