import './css/styles.css';
import { fetchCountries } from './modules/fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
const DEBOUNCE_DELAY = 300;

const refs = {
  searchBox: document.getElementById('search-box'),
  countryList: document.querySelector('ul.country-list'),
  countryInfo: document.querySelector('div.country-info'),
};

function getCountryСard({ name, capital, population, flags, languages }) {
  return `
    <div class="country-info__container">
      <div class="country-info__wrapper">
        <img class="country-info__flags" src="${flags.svg}" alt="${name.official}" width="80" />
        <h2 class="country-info__name">${name.official}</h2>
      </div>
      <p class="country-info__capital"><span class="country-info__weight">Capital:</span> ${capital}</p>
      <p class="country-info__population"><span class="country-info__weight">Population:</span> ${population}</p>
      <p class="country-info__languages"><span class="country-info__weight">Languages:</span> ${Object.values(
        languages,
      )}</p>
    </div>
  `;
}

function getCountryList({ flags, name }) {
  return `
  <li class="country-list__item">
    <img class="country-list__flags" src="${flags.svg}" alt="${name.official}" width="35" />
    <h2 class="country-list__name">${name.official}</h2>
  </li>
  `;
}

refs.searchBox.addEventListener('input', debounce(onInputCountry, DEBOUNCE_DELAY));

function onInputCountry(e) {
    e.preventDefault();
  const countryName = refs.searchBox.value.trim();
  if (countryName === '') {
    refs.countryInfo.innerHTML = '';
    refs.countryList.innerHTML = '';
    return;
  }

  fetchCountries(countryName)
    .then(countries => {
      if (countries.length > 10) {
        Notify.info('Too many matches found. Please enter a more specific name.');
        refs.countryInfo.innerHTML = '';
        refs.countryList.innerHTML = '';
        return;
      }

      if (countries.length <= 10) {
        const listMarkup = countries.map(country => getCountryList(country));
        refs.countryList.innerHTML = listMarkup.join('');
        refs.countryInfo.innerHTML = '';
      }

      if (countries.length === 1) {
        const markup = countries.map(country => getCountryСard(country));
        refs.countryInfo.innerHTML = markup.join('');
        refs.countryList.innerHTML = '';
      }
    })
    .catch(error => {
      Notify.failure('Oops, there is no country with that name');
      refs.countryInfo.innerHTML = '';
      refs.countryList.innerHTML = '';
      return error;
    });
}