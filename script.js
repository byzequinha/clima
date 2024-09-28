const apiKey = '(sua chave de API do Openweather aqui)'; // Chave da API de clima
const apiUrlCurrent = 'https://api.openweathermap.org/data/2.5/weather'; // Clima atual
const apiUrlForecast = 'https://api.openweathermap.org/data/2.5/forecast'; // Previsão de 5 dias
const locationElement = document.getElementById('location');
const temperatureElement = document.getElementById('temperature');
const conditionElement = document.getElementById('condition');
const forecastContainer = document.getElementById('forecast-container');
const updateButton = document.getElementById('search-button'); // Botão de busca por cidade
const locationButton = document.getElementById('location-button'); // Botão de geolocalização
const cityInput = document.getElementById('city-input');

// Função para obter o clima por nome da cidade
async function getWeatherByCity(city) {
    const fullUrl = `${apiUrlCurrent}?q=${city}&appid=${apiKey}&units=metric&lang=pt`;
    try {
        const response = await fetch(fullUrl);
        const data = await response.json();
        if (response.ok) {
            const roundedTemp = Math.ceil(data.main.temp);
            locationElement.innerText = data.name;
            temperatureElement.innerHTML = `${roundedTemp} °C`;
            conditionElement.innerText = `${data.weather[0].description}`;

            // Exibir o ícone do clima
            const iconCode = data.weather[0].icon;
            const weatherIcon = document.getElementById('weather-icon');
            weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
            weatherIcon.style.display = 'block'; // Exibe o ícone

            getForecastByCity(city); // Chama a previsão de 5 dias para a cidade
        } else {
            alert(`Erro da API: ${data.message}`);
        }
    } catch (error) {
        alert('Erro ao carregar dados');
        console.log('Erro ao fazer requisição:', error);
    }
}

// Função para obter o clima atual por geolocalização
async function getWeather(lat, lon) {
    const fullUrl = `${apiUrlCurrent}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pt`;
    try {
        const response = await fetch(fullUrl);
        const data = await response.json();
        if (response.ok) {
            const roundedTemp = Math.ceil(data.main.temp);
            locationElement.innerText = data.name;
            temperatureElement.innerHTML = `${roundedTemp} °C`;
            conditionElement.innerText = `${data.weather[0].description}`;

            // Exibir o ícone do clima ao lado da temperatura
            const iconCode = data.weather[0].icon;
            const weatherIcon = document.getElementById('weather-icon');
            weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
            weatherIcon.style.display = 'block'; // Exibe o ícone

            getForecast(lat, lon); // Chama a previsão de 5 dias
        } else {
            alert(`Erro da API: ${data.message}`);
        }
    } catch (error) {
        alert('Erro ao carregar dados');
        console.log('Erro ao fazer requisição:', error);
    }
}

// Função para obter a previsão de 5 dias por geolocalização
async function getForecast(lat, lon) {
    const fullUrl = `${apiUrlForecast}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pt`;
    try {
        const response = await fetch(fullUrl);
        const data = await response.json();
        if (response.ok) {
            const dailyForecasts = data.list.filter(forecast => forecast.dt_txt.includes("12:00:00"));
            displayForecast(dailyForecasts);
        } else {
            alert(`Erro da API: ${data.message}`);
        }
    } catch (error) {
        alert('Erro ao carregar previsão');
        console.log('Erro ao fazer requisição:', error);
    }
}

// Função para obter a previsão de 5 dias por nome da cidade
async function getForecastByCity(city) {
    const fullUrl = `${apiUrlForecast}?q=${city}&appid=${apiKey}&units=metric&lang=pt`;
    try {
        const response = await fetch(fullUrl);
        const data = await response.json();
        if (response.ok) {
            const dailyForecasts = data.list.filter(forecast => forecast.dt_txt.includes("12:00:00"));
            displayForecast(dailyForecasts);
        } else {
            alert(`Erro da API: ${data.message}`);
        }
    } catch (error) {
        alert('Erro ao carregar previsão');
        console.log('Erro ao fazer requisição:', error);
    }
}

// Função para exibir a previsão dos próximos 5 dias
function displayForecast(forecasts) {
    forecastContainer.innerHTML = ''; // Limpa o container de previsão
    forecasts.forEach(forecast => {
        const date = new Date(forecast.dt_txt).toLocaleDateString('pt-BR', {
            weekday: 'short', day: 'numeric', month: 'short'
        });
        const tempMin = Math.floor(forecast.main.temp_min);
        const tempMax = Math.ceil(forecast.main.temp_max);
        const iconCode = forecast.weather[0].icon;

        const forecastElement = document.createElement('div');
        forecastElement.classList.add('forecast-item');
        forecastElement.innerHTML = `
            <h3>${date}</h3>
            <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="Ícone do clima" />
            <div class="forecast-temp">
                <span>${tempMin}°C</span>
                <span>${tempMax}°C</span>
            </div>
        `;
        forecastContainer.appendChild(forecastElement);
    });
}

// Função para obter a geolocalização
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            getWeather(latitude, longitude); // Pega o clima atual
        }, (error) => {
            console.error("Erro ao obter a localização:", error);
            alert('Erro ao obter a localização');
        });
    } else {
        alert('Geolocalização não suportada pelo navegador');
    }
}

// Evento para buscar por cidade
updateButton.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeatherByCity(city);
    } else {
        alert('Por favor, insira o nome de uma cidade.');
    }
});

// Evento para retornar à geolocalização
locationButton.addEventListener('click', () => {
    getLocation();
});

// Inicializar o clima com a geolocalização do usuário ao carregar a página
window.onload = getLocation;
