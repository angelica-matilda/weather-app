//Global varibles
const tempNow = document.getElementById('tempNow')
const tempTextCelsius = document.querySelector('.tempTextCelsius')
const cityName = document.getElementById('cityName')
const localTime = document.getElementById('localTime');
const localDate = document.getElementById('localDate')
const weatherDescription = document.getElementById('weatherDescription')
const weatherIcon = document.getElementById('weatherIcon')
const humidity = document.getElementById('humidityToday')
const windSpeed = document.getElementById('windSpeed')
const atmosphericPressure = document.getElementById('atmosphericPressure')
const searchBtn = document.getElementById('searchBtn');
const inputField = document.getElementById('inputField');
const cityText = document.querySelector('.cityText');
const tempText = document.querySelector('.tempText');
const describeText = document.querySelector('.describeText');

// Variables to automate API-fethcing:
const apiKey = 'db941dc1ae55d326b2190768faf7a16d';
let city = 'Stockholm'; // Default city
let data = {};

// Function to fetch today's weather for a city
const todaysWeatherFeature = (city) => {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=${apiKey}`)
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      data = json // Store the fetched data
      mappingData() // Process the data and update the HTML elements
    })
};

// Function to map the fetched data to HTML elements
const mappingData = () => {
  //Get today's weather
  let { icon } = data?.weather[0];
  cityName.innerText = `${data.name}`;
  tempNow.innerText = `${data.main.temp.toFixed(0)}`;
  tempTextCelsius.innerText = `°C`;
  weatherDescription.innerText = `${data.weather[0].description}`;
  weatherIcon.innerHTML = `<img src="http://openweathermap.org/img/wn/${icon}.png" alt="weather icon" class="main-icon">`
  humidityToday.innerText = `Humidity: ${data.main.humidity} %`;
  windSpeed.innerText = `Wind speed: ${data.wind.speed} km/h`;
  atmosphericPressure.innerText = `Atmospheric pressure: ${data.main.pressure} hPa`;

  // Get current time in the city's time zone
  const time = new Date()
  let h = time.getUTCHours();
  let m = time.getUTCMinutes();
  let s = time.getUTCSeconds();
  const offset = data.timezone / 3600
  h = h + offset

  // Function to add leading zero if needed
  function checkTime(i) {
    if (i < 10) { i = "0" + i };  // add zero in front of numbers < 10
    return i;
  }
  m = checkTime(m);
  s = checkTime(s);

  // Update HTML with time
  localTime.innerHTML = h + ":" + m + ":" + s;

  // Get current date
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  let yyyy = today.getFullYear();
  today = dd + '/' + mm + '/' + yyyy;

  // Update HTML with date
  localDate.innerHTML = `Date: ${today}`
  setTimeout(mappingData, 1000); // Update the data and time every second
}
// Update weather info every 30 minutes
setInterval(() => {
  updateWeather('Stockholm');
}, 30 * 60 * 1000);

// Function to handle the search functionality
const searchFunction = () => {
  let searchedCity = inputField.value

  todaysWeatherFeature(searchedCity);

  // Clears the input field
  inputField.value = "";
};

// Fetch and display weather for default city on page load
todaysWeatherFeature('Stockholm');

// Event listeners
searchBtn.addEventListener('click', searchFunction) // Event listener for search button
inputField.addEventListener('keyup', function (event) { // Event listener for pressing Enter key in the input field
  if (event.key == "Enter") {
    searchFunction();
  }
}
);