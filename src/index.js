import Notiflix from 'notiflix';
import axios from 'axios';

const formEl = document.querySelector('#search-form');

formEl.addEventListener('Submit', onSubmit);

function onSubmit() {
  console.log(formEl.element.searchQuery.value);
}

const options = {
  key: 555,
  q: 222,
};
