const cityInput = document.querySelector(".city-input");
const searchBtn = document.querySelector(".search-btn");

const weatherInfoSection = document.querySelector(".weather-info");
const notFoundSection = document.querySelector(".not-found");
const searchCitySection = document.querySelector(".search-city");

const countrytxt = document.querySelector(".country-text");
const datetxt = document.querySelector(".current-date-txt");
const temptxt = document.querySelector(".temp-text");
const conditiontxt = document.querySelector(".condition-txt");
const humiditytxt = document.querySelector(".humidity-value-txt");
const windtxt = document.querySelector(".wind-value-txt");
const weatherIcon = document.querySelector(".weather-summary-img");

const forecastItemsContainer = document.querySelector(
  ".forecast-items-container"
);



searchBtn.addEventListener("click", () => {
  if (cityInput.value.trim() === "") {
    alert("Please enter a city name");
    return;
  } else {
    updateWeatherInfo(cityInput.value);
    cityInput.value = "";
    cityInput.blur();
  }
});

cityInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    if (cityInput.value.trim() === "") {
      alert("Please enter a city name");
      return;
    } else {
      updateWeatherInfo(cityInput.value);
      cityInput.value = "";
      cityInput.blur();
    }
  }
});

const getFetchdata = async (endPoint, city) => {
  const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${CONFIG.apiKey}&units=metric`;

  const response = await fetch(apiUrl);
  return response.json();
};

function getWeatherIcon(id) {
  if (id <= 232) return "thunderstorm.svg";
  if (id <= 321) return "drizzle.svg";
  if (id <= 531) return "rain.svg";
  if (id <= 622) return "snow.svg";
  if (id <= 781) return "atmosphere.svg";
  if (id <= 800) return "clear.svg";
  else return "clouds.svg";
}

function getCurrentDate() {
  const currentDate = new Date();
  const options = {
    weekday: "short",
    day: "2-digit",
    month: "short",
  };

  return currentDate.toLocaleDateString("en-GB", options);
}
const updateWeatherInfo = async (city) => {
  const weatherData = await getFetchdata("weather", city);

  if (weatherData.cod != 200) {
    showDisplaySection(notFoundSection);
    return;
  }
  console.log(weatherData);

  const {
    name: country,
    main: { temp, humidity },
    weather: [{ id, main }],
    wind: { speed },
  } = weatherData;

  countrytxt.textContent = country;
  temptxt.textContent = Math.round(temp) + " °C";
  conditiontxt.textContent = main;
  humiditytxt.textContent = humidity + " %";
  windtxt.textContent = speed + " M/s";

  datetxt.textContent = getCurrentDate();
  weatherIcon.src = `assets/weather/${getWeatherIcon(id)}`;

  await updateForecastsInfo(city);
  showDisplaySection(weatherInfoSection);
};

async function updateForecastsInfo(city) {
  const forecastData = await getFetchdata("forecast", city);

  const timeTaken = "12:00:00";
  const todayDate = new Date().toISOString().split("T")[0];

  forecastItemsContainer.innerHTML = "";
  forecastData.list.forEach((forecastWeather) => {
    if (
      forecastWeather.dt_txt.includes(timeTaken) &&
      !forecastWeather.dt_txt.includes(todayDate)
    ) {
      updateForecastItem(forecastWeather);
    }
  });
}

function updateForecastItem(weatherData) {
  console.log(weatherData);
  const {
    dt_txt: date,
    weather: [{ id }],
    main: { temp },
  } = weatherData;

  const dateTaken = new Date(date);
  const dateOptions = {
    day: "2-digit",
    month: "short",
  };

  const dateResult = dateTaken.toLocaleDateString("en-US", dateOptions);

  const forecastItem = `
     <div class="forecast-item">
            <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
            <img
              src="assets/weather/${getWeatherIcon(id)}"
              class="forecast-item-img"
            />
            <h5 class="forecast-item-temp">${Math.round(temp)}  °C</h5>
          </div>`;

  forecastItemsContainer.insertAdjacentHTML("beforeend", forecastItem);
}

function showDisplaySection(section) {
  [weatherInfoSection, searchCitySection, notFoundSection].forEach(
    (section) => {
      section.style.display = "none";
    }
  );

  section.style.display = "flex";
}
