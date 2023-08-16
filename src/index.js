import { Notify } from 'notiflix/build/notiflix-notify-aio';
import ImageApiService from './js/ImageApiService';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formEl = document.querySelector('#search-form');
const loadmoreBTN = document.querySelector('.load-more');
const galleryEl = document.querySelector('.gallery');

const imageApiService = new ImageApiService();

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'Alt',
  captionDelay: 250,
});

formEl.addEventListener('submit', onSubmit);
loadmoreBTN.addEventListener('click', onLoadMore);

function onSubmit(e) {
  e.preventDefault();
  if (e.currentTarget.elements.searchQuery.value.trim() === '') {
    return err();
  }
  clearGalleryContainer();

  imageApiService.query = e.currentTarget.elements.searchQuery.value;
  imageApiService.resetPage();

  imageApiService
    .fetchImage()
    .then(({ data }) => {
      // console.log(data.totalHits);
      if (data.totalHits === 0) {
        loadmoreBTN.classList.add('is-hidden');
        return err();
      } else {
        message(data.totalHits);
        // console.log(data.hits);
        markupGallery(data.hits);
        lightbox.refresh();

        // console.log(hits);
        if (data.totalHits > imageApiService.per_page) {
          // console.log('Після перевірки: ', hits);
          loadmoreBTN.classList.remove('is-hidden');
        } else {
          loadmoreBTN.classList.add('is-hidden');
        }
      }
    })
    .catch(err => console.log(err));
}

function onLoadMore() {
  imageApiService.incrementPage();
  imageApiService
    .fetchImage()
    .then(({ data }) => {
      if (data.totalHits <= imageApiService.page * imageApiService.per_page) {
        markupGallery(data.hits);
        lightbox.refresh();
        // console.log(data.totalHits);
        loadmoreBTN.classList.add('is-hidden');
        errFull();
      } else {
        // console.log(data.totalHits);
        loadmoreBTN.classList.remove('is-hidden');
        // console.log(data.totalHits, imageApiService.per_page);
        markupGallery(data.hits);
        lightbox.refresh();
      }
    })
    .catch(err => console.log(err));
}

function markupGallery(data) {
  //   console.log(hits);
  const makeGalleryMarkup = data => {
    const {
      largeImageURL,
      webformatURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    } = data;

    return `
  <a class="gallery_link" href="${largeImageURL}">
  <div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy"/>
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
</a>
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
