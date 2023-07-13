const API_KEY = '81e5a704082c41e715a4d895fba38cec';

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('city-input');
const currentWeather = document.getElementById('current-weather');
const forecast = document.getElementById('forecast');
const searchHistory = document.getElementById('search-history');
const clearHistoryButton = document.getElementById('clear-history-button');

searchForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const city = searchInput.value;
    if (city) {
        getWeather(city);
        searchInput.value = '';
    }
});

searchHistory.addEventListener('click', function (e) {
    const cityName = e.target.textContent;
    if (cityName) {
        getWeather(cityName);
    }
});

clearHistoryButton.addEventListener('click', function () {
    clearSearchHistory();
});

function getWeather(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=imperial`;

    try {
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const { name, main: { temp, humidity }, wind: { speed }, dt } = data;
                const currentDate = new Date(dt * 1000).toLocaleDateString('en-US');
                const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

                currentWeather.innerHTML = `
          <h2>${name} (${currentDate}) <img src="${iconUrl}" alt="${data.weather[0].description}" /></h2>
          <p>Temperature: ${Math.round(temp)} &deg;F</p>
          <p>Humidity: ${humidity}%</p>
          <p>Wind Speed: ${speed} MPH</p>
        `;

                addToSearchHistory(name);
                saveSearchHistory();

                return fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=imperial`);
            })
            .then(response => response.json())
            .then(data => {
                const forecastData = data.list;

                forecast.innerHTML = '<h2>5-Day Forecast</h2>';
                for (let i = 0; i < forecastData.length; i += 8) {
                    const { dt_txt, main: { temp, humidity }, weather, wind } = forecastData[i];
                    const forecastDate = new Date(dt_txt).toLocaleDateString('en-US');
                    const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}.png`;

                    const forecastItem = document.createElement('div');
                    forecastItem.classList.add('forecast-item');
                    forecastItem.innerHTML = `
            <p>${forecastDate}</p>
            <img src="${iconUrl}" alt="${weather[0].description}" />
            <p>Temperature: ${Math.round(temp)} &deg;F</p>
            <p>Humidity: ${humidity}%</p>
            <p>Wind Speed: ${wind.speed} MPH</p>
          `;
                    forecast.appendChild(forecastItem);
                }
            });
    } catch (error) {
        console.error('Error:', error);
    }
}

function addToSearchHistory(cityName) {
    const isCityInHistory = Array.from(searchHistory.children).some(item => item.textContent === cityName);
    if (!isCityInHistory) {
        const searchHistoryItem = document.createElement('li');
        searchHistoryItem.classList.add('search-history-item');
        searchHistoryItem.textContent = cityName;
        searchHistory.appendChild(searchHistoryItem);
    }
}

function saveSearchHistory() {
    const searchHistoryItems = document.querySelectorAll('.search-history-item');
    const cities = Array.from(searchHistoryItems).map(item => item.textContent);
    localStorage.setItem('searchHistory', JSON.stringify(cities));
}

function loadSearchHistory() {
    const searchHistoryItems = JSON.parse(localStorage.getItem('searchHistory'));
    if (searchHistoryItems) {
        searchHistoryItems.forEach(city => {
            addToSearchHistory(city);
        });
    }
}

function clearSearchHistory() {
    searchHistory.innerHTML = '';
    localStorage.removeItem('searchHistory');
}

loadSearchHistory();