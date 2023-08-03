import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';
import ImageApiService from './js/ImageApiService';

const formEl = document.querySelector('#search-form');
const loadmoreBTN = document.querySelector('.load-more');
const galleryEl = document.querySelector('.gallery');

const imageApiService = new ImageApiService();

formEl.addEventListener('submit', onSubmit);
loadmoreBTN.addEventListener('click', onLoadMore);

function onSubmit(e) {
  e.preventDefault();
  if (e.currentTarget.elements.searchQuery.value.trim() === '') {
    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
      {
        position: 'center-center',
        timeout: '1000',
        clickToClose: 'true',
      }
    );
  }
  clearGalleryContainer();
  loadmoreBTN.classList.add('is-hidden');
  imageApiService.searchQuery = e.currentTarget.elements.searchQuery.value;
  imageApiService.resetPage();

  imageApiService.fetchImage().then(hits => {
    if (hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
        {
          position: 'center-center',
          timeout: '1000',
          clickToClose: 'true',
        }
      );
    } else {
      console.log(hits);
      markupGallery(hits);
    }
  });
}

function onLoadMore() {
  imageApiService.fetchImage().then(data => {
    markupGallery(data);
    console.log(data);
  });
}

function markupGallery(data) {
  loadmoreBTN.classList.remove('is-hidden');
  console.log(data);
  const makeGalleryMarkup = data => {
    const { webformatURL, tags, likes, views, comments, downloads } = data;

    return `
  <div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${likes}
    </p>
    <p class="info-item">
      <b>Views</b>
       ${views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${downloads}
    </p>
  </div>
</div>
`;
  };

  const newGalleryMarkup = data.map(makeGalleryMarkup).join('');

  galleryEl.insertAdjacentHTML('beforeend', newGalleryMarkup);
}

function clearGalleryContainer() {
  galleryEl.innerHTML = '';
}
