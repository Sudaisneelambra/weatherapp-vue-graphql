<template>
  <div class="w-full flex justify-center bg-[#8c8c83]">
    <div class="shadow-2xl p-5 rounded-lg mt-10 mb-10 w-[80%] bg-[#a2b67f]">
      <section class="container">
        <div class="row">
          <form class="col w-full flex justify-center p-2" id="search-form">
            <input
              type="text"
              id="search-input"
              aria-describedby="searchCity"
              placeholder="Search city..."
              class="search-form p-1 rounded-md outline w-[70%]"
              autocomplete="off"
            />
            <button
              type="submit"
              class="ml-4 bg-[#acac72] px-1 rounded-md font-bold outline"
            >
              Search
            </button>
          </form>
          <h1
            class="col d-flex justify-content-center align-items-center city-title"
            id="searched-city"
          >
            {{ city }}
          </h1>
        </div>
        <span class="measurements">
          <a href="#" id="celcius-link">C°</a> |
          <a href="#" id="fahrenheit-link">F°</a>
        </span>
      </section>

      <!-- temp and day info -->
      <section class="current-weather">
        <div class="container w-full">
          <div class="flex flex-col sm:flex-row sm:gap-0 row sm:flex gap-4">
            <div class="sm:w-[40%] grid place-items-center">
              <h1
                class="col temp-title text-[30px] text-center"
                id="current-temperature "
              >
                {{ temparature }}°
              </h1>
              <img :src="iconUrl" alt="icon" />
            </div>
            <div
              class="col todays-info sm:w-[30%] flex flex-col justify-around items-center"
            >
              <p id="current-time ">{{ time }}</p>
              <h2 id="current-day " class="font-bold text-[30px]">Today</h2>
              <p id="weather-type">{{ description }}</p>
            </div>
            <div
              class="col d-flex align-items-center side-info sm:w-[30%] grid place-items-center text-center p-3 sm:p-0"
            >
              <ul>
                <li>Humidity: {{ humidity }}<span id="humidity"></span></li>
                <li>Wind: {{ wind }} <span id="wind"></span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!--5 day forecast-->
      <section class="">
        <div class="row week-forecast flex flex-wrap justify-center gap-3 mt-3">
          <div class="col shadow-xl w-[180px] grid place-items-center">
            <h3>Fri</h3>
            <br /><img
              src="https://img.icons8.com/color-glass/42/000000/rain.png"
            /><br />
            <p class="weather">Rain</p>
            <span>2°</span>
          </div>
          <div class="col shadow-xl w-[180px] grid place-items-center">
            <h3>Sat</h3>
            <br /><img
              src="https://img.icons8.com/color-glass/42/000000/cloud.png"
            /><br />
            <p class="weather">Cloudy</p>
            <span>4°</span>
          </div>
          <div class="col shadow-xl w-[180px] grid place-items-center">
            <h3>Sun</h3>
            <br /><img
              src="https://img.icons8.com/color-glass/42/000000/partly-cloudy-day.png"
            /><br />
            <p class="weather">Partly cloudy</p>
            <span>6°</span>
          </div>
          <div class="col shadow-xl w-[180px] grid place-items-center">
            <h3>Mon</h3>
            <br /><img
              src="https://img.icons8.com/color-glass/42/000000/sun.png"
            /><br />
            <p class="weather">Sunny</p>
            <span>8°</span>
          </div>
          <div class="col shadow-xl w-[180px] grid place-items-center">
            <h3>Tues</h3>
            <br /><img
              src="https://img.icons8.com/color-glass/42/000000/wind.png"
            /><br />
            <p class="weather">Windy</p>
            <span>5°</span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "WeatherHome",
  data() {
    return {
      weatherData: null,
      city: null,
      apiKey: "374417dc2c58b9cf12e1995c20bfd8cd",
      temparature: null,
      description: null,
      iconUrl: null,
      date: null,
      time: null,
      wind: null,
      humidity: null,
      monthNames: [
        "january",
        "february",
        "march",
        "april",
        "may",
        "june",
        "july",
        "augest",
        "september",
        "octobar",
        "november",
        "desember",
      ],
    };
  },
  mounted() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
          (position)=>{
          var latitude = position.coords.latitude;
          var longitude = position.coords.longitude;

          const currentapikey = "374417dc2c58b9cf12e1995c20bfd8cd";
          const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${currentapikey}`;

          axios
            .get(apiUrl)
            .then((response) => {
              if (response) {
                const weatherData = response.data;
                console.log(weatherData);
                this.temparature = weatherData.main.temp.toFixed(1)/10;
                this.description=weatherData.weather[0].description
                this.iconUrl=`https://api.openweathermap.org/img/w/${weatherData.weather[0].icon}.png`
                const d= new Date()
                this.time=d.getHours() + ':' + d.getMinutes() + ':'+ d.getSeconds();
                this.date=d.getDate()+'-' + this.monthNames[d.getMonth()]+ '-' + d.getFullYear();
                this.wind = weatherData.wind.speed;
                this.humidity = weatherData.main.humidity;
                this.city=weatherData.name
              }
            })
            .catch((error) => {
              console.error(" fetching weather ", error);
            });
        },
        function (error) {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              console.log("User denied the request for Geolocation.");
              break;
            case error.POSITION_UNAVAILABLE:
              console.log("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              console.log("The request to get user location timed out.");
              break;
            case error.UNKNOWN_ERROR:
              console.log("An unknown error occurreded.");
              break;
          }
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  },
  methods(){

  },
};
</script>

<style></style>
























<!-- const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&units=metric&appid=${this.apiKey}`;

axios.get(apiUrl)
  .then(response => {
    this.weatherData = response.data;
    this.temparatute=this.weatherData.main.temp
    this.description=this.weatherData.weather[0].description
    this.iconUrl=`https://api.openweathermap.org/img/w/${this.weatherData.weather[0].icon}.png`
    const d= new Date()
    this.time=d.getHours() + ':' + d.getMinutes() + ':'+ d.getSeconds();
    this.date=d.getDate()+'-' + this.monthNames[d.getMonth()]+ '-' + d.getFullYear();
    this.wind = this.weatherData.wind.speed;
    this.humidity = this.weatherData.main.humidity;
    console.log(this.weatherData);
    console.log(this.time);
    console.log(this.date);
    console.log(this.iconUrl);



  })
  .catch(error => {
    console.error('Error fetching weather data:', error);
  }); -->
