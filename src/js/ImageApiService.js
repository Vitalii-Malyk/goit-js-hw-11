export default class ImageApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 40;
  }

  fetchImage() {
    const options = {
      key: '38612629-f2604cf2bc8cc8583c7392e39',
      q: `${this.searchQuery}`,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
    };
    const URL = 'https://pixabay.com/api/';
    return fetch(
      `${URL}?key=${options.key}&q=${options.q}&image_type=${options.image_type}&orientation=${options.orientation}&safesearch=${options.safesearch}&page=${this.page}&per_page=${this.per_page}`
    )
      .then(response => response.json())
      .then(hits => {
        this.incrementPage();
        return hits;
      });
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
