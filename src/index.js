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
    return err();
  }
  clearGalleryContainer();

  imageApiService.searchQuery = e.currentTarget.elements.searchQuery.value;
  imageApiService.resetPage();

  imageApiService.fetchImage().then(hits => {
    if (hits.totalHits === 0) {
      return err();
    } else {
      message(hits.totalHits);
      markupGallery(hits);
      // console.log(hits);
      if (hits.totalHits > imageApiService.per_page) {
        // console.log('Після перевірки: ', hits);
        loadmoreBTN.classList.remove('is-hidden');
      } else {
        loadmoreBTN.classList.add('is-hidden');
      }
    }
  });
}

function onLoadMore() {
  imageApiService.fetchImage().then(hits => {
    if (hits.totalHits <= imageApiService.page * imageApiService.per_page) {
      markupGallery(hits);
      loadmoreBTN.classList.add('is-hidden');
      errFull();
    } else {
      loadmoreBTN.classList.remove('is-hidden');
      console.log(hits.totalHits, imageApiService.per_page);
      markupGallery(hits);
    }
  });
}

function markupGallery({ hits }) {
  //   console.log(hits);
  const makeGalleryMarkup = hits => {
    const { webformatURL, tags, likes, views, comments, downloads } = hits;

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

  const newGalleryMarkup = hits.map(makeGalleryMarkup).join('');

  galleryEl.insertAdjacentHTML('beforeend', newGalleryMarkup);
}

function clearGalleryContainer() {
  galleryEl.innerHTML = '';
}

function err() {
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.',
    {
      position: 'center-center',
      timeout: '1000',
      clickToClose: 'true',
    }
  );
}

function errFull() {
  Notify.failure("We're sorry, but you've reached the end of search results.", {
    position: 'center-center',
    timeout: '2000',
    clickToClose: 'true',
  });
}

function message(element) {
  Notify.success(`Hooray! We found ${element} images.`, {
    position: 'center-center',
    timeout: '2000',
    clickToClose: 'true',
  });
}
