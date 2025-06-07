const API_KEY = "babf0f4e684e15176c2fc62d0a394fac";
const userLocation = document.getElementById("userLocation");
WEATHER_DATA_ENDPOINT = 'https://api.openweathermap.org/data/2.5/weather?appid=';
FORECAST_DATA_ENDPOINT = 'https://api.openweathermap.org/data/2.5/forecast?appid=';
function findUserLocation() {
    const Forecast = document.querySelector(".Forecast");
    const converter = document.getElementById("converter");
    const userLocation = document.getElementById("userLocation");
    const city = document.querySelector(".city");
    const weatherIcon = document.querySelector(".weatherIcon");
    const temperature = document.querySelector(".temperature");
    const feelsLike = document.querySelector(".feelsLike");
    const description = document.querySelector(".description");
    const date = document.querySelector(".date");
    const HValue = document.getElementById("HValue");
    const WValue = document.getElementById("WValue");
    // const WDValue = document.getElementById("WDValue");
    const SRValue = document.getElementById("SRValue");
    const SSValue = document.getElementById("SSValue");
    const CValue = document.getElementById("CValue");
    const UVValue = document.getElementById("UVValue");
    const PValue = document.getElementById("PValue");

    const units = converter.value;

    fetch(WEATHER_DATA_ENDPOINT + API_KEY + '&q=' + userLocation.value.trim() + '&units=${units}')
        .then((response) => response.json())
        .then((data) => {
            if (data.cod != '' && data.cod != 200) {
                alert(data.message);
                return;
            }
            console.log(data);

            //left side section
            weatherIcon.style.background = `url(https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png)`;

            temperature.innerHTML = `${units === 'metric' ? Math.round(data.main.temp - 273.15) : Math.round((data.main.temp - 273.15) * 9 / 5 + 32)}°${units === 'metric' ? 'C' : 'F'}`;

            feelsLike.innerHTML = `Feels like ${units === 'metric' ? Math.round(data.main.feels_like - 273.15) : Math.round((data.main.feels_like - 273.15) * 9 / 5 + 32)}°${units === 'metric' ? 'C' : 'F'}`;

            description.innerHTML = `<i class="fa-brands fa-cloudversify"></i>&nbsp;${data.weather[0].description}`;
            const options = {
                weekday: "long",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true
            };
            date.innerHTML = getLongFormatDateTime(data.dt, data.timezone, options);
            city.innerHTML = data.name + ", " + data.sys.country;

            //todays highlight section 
            HValue.innerHTML = Math.round(data.main.humidity) + "<span>%</span>";
            WValue.innerHTML = Math.round(data.wind.speed) + "<span>m/s</span>";
            // WDValue.innerHTML = Math.round(data.wind.deg) + "<span>°</span>";
            const options1 = {
                hour: "numeric",
                minute: "numeric",
                hour12: true
            };
            SRValue.innerHTML = getLongFormatDateTime(data.sys.sunrise, data.timezone, options1);
            SSValue.innerHTML = getLongFormatDateTime(data.sys.sunset, data.timezone, options1);
            CValue.innerHTML = data.clouds.all + "<span>%</span>";
            UVValue.innerHTML = "";
            PValue.innerHTML = data.main.pressure + "<span>hPa</span>";



            //5 days forecaast section

            fetch(`${FORECAST_DATA_ENDPOINT}${API_KEY}&lat=${data.coord.lat}&lon=${data.coord.lon}&units=${units}`)
                .then((response) => response.json())
                .then((forecastData) => {
                    const dailyMap = new Map();

                    forecastData.list.forEach(item => {
                        const date = item.dt_txt.split(" ")[0];
                        if (!dailyMap.has(date)) {
                            dailyMap.set(date, item); // pick the first entry per day
                        }
                    });

                    const forecastDays = Array.from(dailyMap.values()).slice(0, 5);
                    Forecast.innerHTML = "";

                    forecastDays.forEach(item => {
                        const date = new Date(item.dt_txt);
                        const day = date.toLocaleDateString("en-US", { weekday: 'short' });
                        const temp = Math.round(item.main.temp);
                        const icon = item.weather[0].icon;
                        const desc = item.weather[0].description;

                        Forecast.innerHTML += `
                        <div class="forecast-day">
                            <h3>${day}</h3>
                            <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}" />
                            <p>${temp}°${units === 'metric' ? 'C' : 'F'}</p>
                            <small>${desc}</small>
                        </div>
                    `;
                    });
                });

        }
        );
}
function getLongFormatDateTime(unixTimestamp, timezoneOffset, options) {
    const localTime = new Date((unixTimestamp + timezoneOffset) * 1000);
    return localTime.toLocaleString("en-US", options);
}
































// function formatUnixTime(dtValue, offSet, options = {}) {
//     const date = new Date((dtValue + offSet) * 1000);
//     return date.toLocaleTimeString([], { timeZone: "UTC", ...options });
// }

// function getLongFormatDateTime(dtValue, offSet, options) {
//     return formatUnixTime(dtValue, offSet, options)
// }
// /*function findUserLocation():
// This defines a function named findUserLocation. When called, it runs the code inside its curly braces { ... }.

// fetch(WEATHER_API_ENDPOINT + "London"):
// This line sends a network request to a URL, which is a combination of WEATHER_API_ENDPOINT and the string "London".

// For example, if WEATHER_API_ENDPOINT was "https://api.weather.com/data?city=", the full request would be:

// arduino
// Copy
// Edit
// https://api.weather.com/data?city=London
// .then((response) => response.json()):
// After the fetch completes, this line takes the raw response object and converts it into JSON format.
// This is necessary because fetch returns a Response object, not usable data directly.

// .then((data) => { console.log(data); }):
// Once the JSON is ready, this line runs a function that logs the data to the browser’s console. */




