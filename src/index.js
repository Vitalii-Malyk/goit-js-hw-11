import { Notify } from 'notiflix/build/notiflix-notify-aio';
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

  imageApiService.fetchImage().then(({ data }) => {
    console.log(data.totalHits);
    if (data.totalHits === 0) {
      return err();
    } else {
      message(data.totalHits);
      console.log(data.hits);
      markupGallery(data.hits);
      // console.log(hits);
      if (data.totalHits > imageApiService.per_page) {
        // console.log('Після перевірки: ', hits);
        loadmoreBTN.classList.remove('is-hidden');
      } else {
        loadmoreBTN.classList.add('is-hidden');
      }
    }
  });
}

function onLoadMore() {
  imageApiService.incrementPage();
  imageApiService.fetchImage().then(({ data }) => {
    if (data.totalHits <= imageApiService.page * imageApiService.per_page) {
      markupGallery(data.hits);
      console.log(data.totalHits);
      loadmoreBTN.classList.add('is-hidden');
      errFull();
    } else {
      console.log(data.totalHits);
      loadmoreBTN.classList.remove('is-hidden');
      console.log(data.totalHits, imageApiService.per_page);

      markupGallery(data.hits);
    }
  });
}

function markupGallery(data) {
  //   console.log(hits);
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
