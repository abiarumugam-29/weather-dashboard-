// ==========================================
// WEATHER DASHBOARD
// ==========================================


// ------------------------------------------
// 1. DOM ELEMENTS
// ------------------------------------------

const cityInput = document.getElementById("cityInput");

const searchBtn = document.getElementById("searchBtn");

const loading = document.getElementById("loading");

const errorMessage = document.getElementById("errorMessage");

const weatherCard = document.getElementById("weatherCard");

const cityName = document.getElementById("cityName");

const countryName = document.getElementById("countryName");

const temperature = document.getElementById("temperature");

const humidity = document.getElementById("humidity");

const windSpeed = document.getElementById("windSpeed");

const condition = document.getElementById("condition");

const weatherDescription =
    document.getElementById("weatherDescription");

const weatherIcon =
    document.getElementById("weatherIcon");


// ------------------------------------------
// 2. WEATHER CODE MAPPING
// ------------------------------------------

function getWeatherInfo(code) {

    const weatherCodes = {

        0: {
            description: "Clear Sky",
            icon: "☀️"
        },

        1: {
            description: "Mainly Clear",
            icon: "🌤️"
        },

        2: {
            description: "Partly Cloudy",
            icon: "⛅"
        },

        3: {
            description: "Overcast",
            icon: "☁️"
        },

        45: {
            description: "Foggy",
            icon: "🌫️"
        },

        48: {
            description: "Foggy",
            icon: "🌫️"
        },

        51: {
            description: "Light Drizzle",
            icon: "🌦️"
        },

        53: {
            description: "Drizzle",
            icon: "🌦️"
        },

        55: {
            description: "Heavy Drizzle",
            icon: "🌧️"
        },

        61: {
            description: "Light Rain",
            icon: "🌧️"
        },

        63: {
            description: "Rain",
            icon: "🌧️"
        },

        65: {
            description: "Heavy Rain",
            icon: "🌧️"
        },

        71: {
            description: "Light Snow",
            icon: "🌨️"
        },

        73: {
            description: "Snow",
            icon: "❄️"
        },

        75: {
            description: "Heavy Snow",
            icon: "❄️"
        },

        80: {
            description: "Rain Showers",
            icon: "🌦️"
        },

        81: {
            description: "Rain Showers",
            icon: "🌧️"
        },

        82: {
            description: "Heavy Rain Showers",
            icon: "⛈️"
        },

        95: {
            description: "Thunderstorm",
            icon: "⛈️"
        },

        96: {
            description: "Thunderstorm with Hail",
            icon: "⛈️"
        },

        99: {
            description: "Severe Thunderstorm",
            icon: "⛈️"
        }

    };


    return weatherCodes[code] || {

        description: "Unknown",

        icon: "🌡️"

    };

}


// ------------------------------------------
// 3. SHOW LOADING
// ------------------------------------------

function showLoading() {

    loading.style.display = "block";

    errorMessage.style.display = "none";

    weatherCard.style.display = "none";

}


// ------------------------------------------
// 4. HIDE LOADING
// ------------------------------------------

function hideLoading() {

    loading.style.display = "none";

}


// ------------------------------------------
// 5. SHOW ERROR
// ------------------------------------------

function showError(message) {

    hideLoading();

    errorMessage.textContent = message;

    errorMessage.style.display = "block";

    weatherCard.style.display = "none";

}


// ------------------------------------------
// 6. SEARCH CITY
// ------------------------------------------

async function searchCity(city) {

    const url =
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;


    const response = await fetch(url);


    if (!response.ok) {

        throw new Error(
            "Unable to connect to the location service."
        );

    }


    const data = await response.json();


    if (!data.results || data.results.length === 0) {

        throw new Error(
            "City not found. Please check the city name."
        );

    }


    return data.results[0];

}


// ------------------------------------------
// 7. GET WEATHER DATA
// ------------------------------------------

async function getWeather(latitude, longitude) {

    const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`;


    const response = await fetch(url);


    if (!response.ok) {

        throw new Error(
            "Unable to fetch weather data."
        );

    }


    const data = await response.json();


    return data;

}


// ------------------------------------------
// 8. DISPLAY WEATHER
// ------------------------------------------

function displayWeather(location, weatherData) {

    const current = weatherData.current;


    // Get weather information
    const weatherInfo =
        getWeatherInfo(current.weather_code);


    // Location
    cityName.textContent = location.name;


    countryName.textContent =
        location.country || "Unknown Country";


    // Temperature
    temperature.textContent =
        Math.round(current.temperature_2m);


    // Humidity
    humidity.textContent =
        current.relative_humidity_2m;


    // Wind
    windSpeed.textContent =
        Math.round(current.wind_speed_10m);


    // Condition
    condition.textContent =
        weatherInfo.description;


    // Description
    weatherDescription.textContent =
        weatherInfo.description;


    // Icon
    weatherIcon.textContent =
        weatherInfo.icon;


    // Show card
    weatherCard.style.display = "block";

}


// ------------------------------------------
// 9. MAIN WEATHER FUNCTION
// ------------------------------------------

async function getWeatherByCity(city) {

    try {

        showLoading();


        // Step 1:
        // Convert city name into coordinates

        const location =
            await searchCity(city);


        // Step 2:
        // Fetch weather using coordinates

        const weatherData =
            await getWeather(
                location.latitude,
                location.longitude
            );


        // Step 3:
        // Display the data

        displayWeather(
            location,
            weatherData
        );


        hideLoading();


    }

    catch (error) {

        console.error(error);

        showError(
            error.message ||
            "Something went wrong. Please try again."
        );

    }

}


// ------------------------------------------
// 10. SEARCH BUTTON
// ------------------------------------------

searchBtn.addEventListener(
    "click",
    function () {

        const city =
            cityInput.value.trim();


        if (city === "") {

            showError(
                "Please enter a city name."
            );

            return;

        }


        getWeatherByCity(city);

    }
);


// ------------------------------------------
// 11. ENTER KEY
// ------------------------------------------

cityInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            searchBtn.click();

        }

    }
);


// ------------------------------------------
// 12. DEFAULT CITY
// ------------------------------------------

// Load a city when the application starts

getWeatherByCity("Chennai");
