// import ImageApiService from './ImageApiService';

// const imageApiService = new ImageApiService();

// const arrImage = imageApiService.fetchImage().then(data => getGallery(data));

// let arr = [];
// function getGallery(data) {
//   console.log(data);
//   arr = data;
//   console.log(arr);
// }

// const makeGalleryMarkup = arr => {
//   const { webformatURL, tags, likes, views, comments, downloads } = arr;

//   return `
//   <div class="photo-card">
//   <img src="${webformatURL}" alt="${tags}" loading="lazy" />
//   <div class="info">
//     <p class="info-item">
//       <b>${likes}</b>
//     </p>
//     <p class="info-item">
//       <b>${views}</b>
//     </p>
//     <p class="info-item">
//       <b>${comments}</b>
//     </p>
//     <p class="info-item">
//       <b>${downloads}</b>
//     </p>
//   </div>
// </div>
// `;
// };

// const galleryEl = document.querySelector('.gallery');
// const newGalleryMarkup = arr.map(makeGalleryMarkup).join('');

// galleryEl.insertAdjacentHTML('afterbegin', newGalleryMarkup);
