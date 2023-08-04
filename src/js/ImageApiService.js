import axios from 'axios';

export default class ImageApiService {
  #BASE_URL = 'https://pixabay.com/api/';
  #KEY = '38612629-f2604cf2bc8cc8583c7392e39';
  searchQuery = '';
  page = 1;
  per_page = 40;

  fetchImage() {
    const searchParams = new URLSearchParams({
      key: this.#KEY,
      q: `${this.searchQuery}`,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      page: `${this.page}`,
      per_page: `${this.per_page}`,
    });

    return axios.get(`${this.#BASE_URL}?${searchParams}`);
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
