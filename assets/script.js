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

searchHistory.addEventListener('click', function (e) {
    const cityName = e.target.textContent;
    if (cityName) {
        getWeather(cityName);
    }
});

function getWeather(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=imperial`;

    try {
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const forecastData = data.list;

                forecast.innerHTML = '<h2>5-Day Forecast</h2>';
                for (let i = 0; i < forecastData.length; i += 8) {
                    const { dt_txt, main: { temp, humidity } } = forecastData[i];
                    const forecastDate = new Date(dt * 1000).toLocaleDateString('en-US');
                    const iconUrl = `https://openweathermap.org/img/wn/${forecastData[i].weather[0].icon}.png`;

                    const forecastItem = document.createElement('div');
                    forecastItem.classList.add('forecast-item');
                    forecastItem.innerHTML = `
            <p>${forecastDate}</p>
            <img src="${iconUrl}" alt="${forecastData[i].weather[0].description}" />
            <p>Temperature: ${Math.round(main.temp)} &deg;F</p>
            <p>Humidity: ${humidity}%</p>
            <p>Wind Speed: ${wind.speed} MPH</p>
            `;
                    forecast.appendChild(forecastItem);
                }
            });
    } catch (error) {
        console.error('Error:', error);
    }


    function addToSearchHistory(cityName) {
        const searchHistoryItem = document.createElement('li');
        searchHistoryItem.classList.add('search-history-item');
        searchHistoryItem.textContent = cityName;
        searchHistory.appendChild(searchHistoryItem);
    }
}