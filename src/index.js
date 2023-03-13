import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import fetchCountries from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const inputSearch = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

inputSearch.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
  if (!inputSearch.value) {
    countryListEl.innerHTML = '';
    countryInfoEl.innerHTML = '';
    return null;
  }

  const name = e.target.value.trim();

  fetchCountries(name).then(renderMarkup).catch(onError);
}

function renderMarkup(data) {
  console.log(data);
  let markup = '';

  if (data.length > 10) {
    countryListEl.innerHTML = '';
    countryInfoEl.innerHTML = '';
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  }

  if (data.length >= 2 && data.length <= 10) {
    countryInfoEl.innerHTML = '';
    data.map(({ name, flags }) => {
      markup += `<li class='itemsCountry'>
            <img src ='${flags.svg}' alt ='${flags.alt}' width='80'>
            <p class='name_country'>${name.common}</p></li>`;
    });
    countryListEl.innerHTML = markup;
  }

  if (data.length === 1) {
    countryListEl.innerHTML = '';
    data.map(({ name, capital, population, languages, flags }) => {
      markup = `<div class='name-thumb'>
            <img src ='${flags.svg}' alt ='${flags.alt}' width='100'>
            <p class='name_country'>${name.common}</p>
            </div>
            <p class='text'><span class='country-info'>Capital: </span> ${capital}</p>
            <p class='text'><span class='country-info'>Population: </span> ${population}</p>
            <p class='text'><span class='country-info'>Languages: </span> ${Object.values(
              languages
            )}</p>`;
    });
    countryInfoEl.innerHTML = markup;
  }
}
function onError() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
  countryListEl.innerHTML = '';
  countryInfoEl.innerHTML = '';
}
