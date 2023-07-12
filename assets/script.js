const API_KEY = '81e5a704082c41e715a4d895fba38cec'

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('city-input');
const currentWeather = document.getElementById('current-weather');
const forecast = document.getElementById('forecast');
const searchHistory = document.getElementById('search-history');

searchForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const city = searchInput.value;
    if (city) {
        getWeather(city);
        searchInput.value = '';
    }
});


