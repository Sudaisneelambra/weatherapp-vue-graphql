<template>
  <div class="w-full h-screen grid place-items-center" v-if="loading">
    <div class="loader">
      <div class="box box0">
        <div></div>
      </div>
      <div class="box box1">
        <div></div>
      </div>
      <div class="box box2">
        <div></div>
      </div>
      <div class="box box3">
        <div></div>
      </div>
      <div class="box box4">
        <div></div>
      </div>
      <div class="box box5">
        <div></div>
      </div>
      <div class="box box6">
        <div></div>
      </div>
      <div class="box box7">
        <div></div>
      </div>
      <div class="ground">
        <div></div>
      </div>
    </div>
  </div>
  <div class="w-full flex justify-center bg-[#8c8c83]" v-if="!loading">
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
              v-model="searchInput"
            />
            <button
              type="submit"
              class="ml-4 bg-[#acac72] px-1 rounded-md font-bold outline"
              @click.prevent="serchplace"
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
                {{ Number(temparature).toFixed(1) }}°
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
        <h1 class="font-bold text-[red] text-[22px]">Upcoming five days</h1>
        <div
        class="row week-forecast flex flex-wrap justify-center gap-10 mt-6"
        >
          <div
            class="col shadow-xl w-[180px] grid place-items-center bg-[#8080803e] rounded-md"
            v-for="(forecast, index) in dailyForecastsArray.slice(1)"
            :key="index"
          >
            <h3>{{ forecast.day }}</h3>
            <br />
            <img
              :src="`https://api.openweathermap.org/img/w/${forecast.icons[0]}.png`"
              alt="icon"
            />
            <br />
            <p class="weather">{{ forecast?.descriptions[0] }}</p>
            <span>{{ (forecast.temperatures[0] / 10).toFixed(1) }}°</span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useRouter } from 'vue-router';

export default {
  name: "WeatherHome",
  data() {
    return {
      router :useRouter(),
      searchInput: '',
      loading:null,
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
      dailyForecastsArray:[],
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
    this.fetchdata()
  },
  methods: {
    serchplace() {
        this.loading=true
        console.log(this.searchInput);
        this.city=this.searchInput
        const currentapikey = "374417dc2c58b9cf12e1995c20bfd8cd";
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&units=metric&appid=${this.apiKey}`;
        const futureDaysApi = `https://api.openweathermap.org/data/2.5/forecast?q=${this.city}&appid=${currentapikey}`;

        axios.get(apiUrl)
            .then(response => {
                if (response && response.data) {
                    this.loading=false
                    this.weatherData = response.data;
                    this.temperature = this.weatherData.main.temp;
                    this.description = this.weatherData.weather[0].description;
                    this.iconUrl = `https://api.openweathermap.org/img/w/${this.weatherData.weather[0].icon}.png`;
                    const d = new Date();
                    this.time = d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
                    this.date = d.getDate() + '-' + this.monthNames[d.getMonth()] + '-' + d.getFullYear();
                    this.wind = this.weatherData.wind.speed;
                    this.humidity = this.weatherData.main.humidity;
                    console.log(this.weatherData);
                    console.log(this.time);
                    console.log(this.date);
                    console.log(this.iconUrl);
                }
            })
            .catch(error => {
                alert('input value is not correct,please enter the correct input')
                this.loading=false
                this.fetchdata()
                console.error('Error fetching weather data:', error);
            }); 

            axios
            .get(futureDaysApi)
            .then((response) => {
              if (response.status === 200) {
                this.loading=false
                const futureweather = response.data;
                this.dailyForecastsArray=[]
                const dailyForecasts = {};

                futureweather.list.forEach((item) => {
                  const date = new Date(item.dt * 1000);
                  const day = date.toDateString();

                  if (!dailyForecasts[day]) {
                    dailyForecasts[day] = {
                      temperatures: [],
                      descriptions: [],
                      dates: [],
                      icons: [],
                    };
                  }

                  const temperature = item.main.temp;
                  const description = item.weather[0].description;
                  const icon = item.weather[0].icon;

                  dailyForecasts[day].temperatures.push(temperature);
                  dailyForecasts[day].descriptions.push(description);
                  dailyForecasts[day].dates.push(date);
                  dailyForecasts[day].icons.push(icon);
                });
                for (const day in dailyForecasts) {
                  const forecast = {
                        day: day,
                        temperatures: dailyForecasts[day].temperatures,
                        descriptions: dailyForecasts[day].descriptions,
                        dates: dailyForecasts[day].dates,
                        icons: dailyForecasts[day].icons,
                    };
                  this.dailyForecastsArray.push(forecast);
                }

                console.log(
                  "Daily forecasts as array after removing zero index: serrched",
                  this.dailyForecastsArray
                );
              } else {
                console.error(
                  "Failed to fetch weather data. Status:",
                  response.status
                );
              }
            })
            .catch((error) => {
              console.error("Error fetching weather data:", error);
            });
    },
    fetchdata(){
      this.loading=true
      this.dailyForecastsArray=[]
      this.searchInput=''
        if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          var latitude = position.coords.latitude;
          var longitude = position.coords.longitude;

          const currentapikey = "374417dc2c58b9cf12e1995c20bfd8cd";
          const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${currentapikey}`;

          const futuredaysapi = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${currentapikey}`;

          axios
            .get(apiUrl)
            .then((response) => {
              if (response) {
                const weatherData = response.data;
                this.temparature = weatherData.main.temp / 10;
                this.description = weatherData.weather[0].description;
                this.iconUrl = `https://api.openweathermap.org/img/w/${weatherData.weather[0].icon}.png`;
                console.log(this.iconUrl);
                const d = new Date();
                this.time =
                  d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
                this.date =
                  d.getDate() +
                  "-" +
                  this.monthNames[d.getMonth()] +
                  "-" +
                  d.getFullYear();
                this.wind = weatherData.wind.speed;
                this.humidity = weatherData.main.humidity;
                this.city = weatherData.name;
              }
            })
            .catch((error) => {
              console.error(" fetching weather ", error);
            });

          axios
            .get(futuredaysapi)
            .then((response) => {
              if (response.status === 200) {
                this.loading=false
                const futureweather = response.data;
                const dailyForecasts = {};

                futureweather.list.forEach((item) => {
                  const date = new Date(item.dt * 1000);
                  const day = date.toDateString();

                  if (!dailyForecasts[day]) {
                    dailyForecasts[day] = {
                      temperatures: [],
                      descriptions: [],
                      dates: [],
                      icons: [],
                    };
                  }

                  const temperature = item.main.temp;
                  const description = item.weather[0].description;
                  const icon = item.weather[0].icon;

                  dailyForecasts[day].temperatures.push(temperature);
                  dailyForecasts[day].descriptions.push(description);
                  dailyForecasts[day].dates.push(date);
                  dailyForecasts[day].icons.push(icon);
                });
                for (const day in dailyForecasts) {
                  const forecast = {
                        day: day,
                        temperatures: dailyForecasts[day].temperatures,
                        descriptions: dailyForecasts[day].descriptions,
                        dates: dailyForecasts[day].dates,
                        icons: dailyForecasts[day].icons,
                    };
                  this.dailyForecastsArray.push(forecast);
                }

                console.log(
                  "Daily forecasts as array after removing zero index:",
                  this.dailyForecastsArray
                );
              } else {
                console.error(
                  "Failed to fetch weather data. Status:",
                  response.status
                );
              }
            })
            .catch((error) => {
              console.error("Error fetching weather data:", error);
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
    }
  },
};
</script>

<style>
.loader {
  --duration: 3s;
  --primary: rgba(39, 94, 254, 1);
  --primary-light: #2f71ff;
  --primary-rgba: rgba(39, 94, 254, 0);
  width: 200px;
  height: 320px;
  position: relative;
  transform-style: preserve-3d;
}

@media (max-width: 480px) {
  .loader {
    zoom: 0.44;
  }
}

.loader:before,
.loader:after {
  --r: 20.5deg;
  content: "";
  width: 320px;
  height: 140px;
  position: absolute;
  right: 32%;
  bottom: -11px;
  /* change the back groung color on switching from light to dark mood */
  background: #e8e8e8;
  transform: translateZ(200px) rotate(var(--r));
  -webkit-animation: mask var(--duration) linear forwards infinite;
  animation: mask var(--duration) linear forwards infinite;
}

.loader:after {
  --r: -20.5deg;
  right: auto;
  left: 32%;
}

.loader .ground {
  position: absolute;
  left: -50px;
  bottom: -120px;
  transform-style: preserve-3d;
  transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(1);
}

.loader .ground div {
  transform: rotateX(90deg) rotateY(0deg) translate(-48px, -120px)
    translateZ(100px) scale(0);
  width: 200px;
  height: 200px;
  background: var(--primary);
  background: linear-gradient(
    45deg,
    var(--primary) 0%,
    var(--primary) 50%,
    var(--primary-light) 50%,
    var(--primary-light) 100%
  );
  transform-style: preserve-3d;
  -webkit-animation: ground var(--duration) linear forwards infinite;
  animation: ground var(--duration) linear forwards infinite;
}

.loader .ground div:before,
.loader .ground div:after {
  --rx: 90deg;
  --ry: 0deg;
  --x: 44px;
  --y: 162px;
  --z: -50px;
  content: "";
  width: 156px;
  height: 300px;
  opacity: 0;
  background: linear-gradient(var(--primary), var(--primary-rgba));
  position: absolute;
  transform: rotateX(var(--rx)) rotateY(var(--ry)) translate(var(--x), var(--y))
    translateZ(var(--z));
  -webkit-animation: ground-shine var(--duration) linear forwards infinite;
  animation: ground-shine var(--duration) linear forwards infinite;
}

.loader .ground div:after {
  --rx: 90deg;
  --ry: 90deg;
  --x: 0;
  --y: 177px;
  --z: 150px;
}

.loader .box {
  --x: 0;
  --y: 0;
  position: absolute;
  -webkit-animation: var(--duration) linear forwards infinite;
  animation: var(--duration) linear forwards infinite;
  transform: translate(var(--x), var(--y));
}

.loader .box div {
  background-color: var(--primary);
  width: 48px;
  height: 48px;
  position: relative;
  transform-style: preserve-3d;
  -webkit-animation: var(--duration) ease forwards infinite;
  animation: var(--duration) ease forwards infinite;
  transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(0);
}

.loader .box div:before,
.loader .box div:after {
  --rx: 90deg;
  --ry: 0deg;
  --z: 24px;
  --y: -24px;
  --x: 0;
  content: "";
  position: absolute;
  background-color: inherit;
  width: inherit;
  height: inherit;
  transform: rotateX(var(--rx)) rotateY(var(--ry)) translate(var(--x), var(--y))
    translateZ(var(--z));
  filter: brightness(var(--b, 1.2));
}

.loader .box div:after {
  --rx: 0deg;
  --ry: 90deg;
  --x: 24px;
  --y: 0;
  --b: 1.4;
}

.loader .box.box0 {
  --x: -220px;
  --y: -120px;
  left: 58px;
  top: 108px;
}

.loader .box.box1 {
  --x: -260px;
  --y: 120px;
  left: 25px;
  top: 120px;
}

.loader .box.box2 {
  --x: 120px;
  --y: -190px;
  left: 58px;
  top: 64px;
}

.loader .box.box3 {
  --x: 280px;
  --y: -40px;
  left: 91px;
  top: 120px;
}

.loader .box.box4 {
  --x: 60px;
  --y: 200px;
  left: 58px;
  top: 132px;
}

.loader .box.box5 {
  --x: -220px;
  --y: -120px;
  left: 25px;
  top: 76px;
}

.loader .box.box6 {
  --x: -260px;
  --y: 120px;
  left: 91px;
  top: 76px;
}

.loader .box.box7 {
  --x: -240px;
  --y: 200px;
  left: 58px;
  top: 87px;
}

.loader .box0 {
  -webkit-animation-name: box-move0;
  animation-name: box-move0;
}

.loader .box0 div {
  -webkit-animation-name: box-scale0;
  animation-name: box-scale0;
}

.loader .box1 {
  -webkit-animation-name: box-move1;
  animation-name: box-move1;
}

.loader .box1 div {
  -webkit-animation-name: box-scale1;
  animation-name: box-scale1;
}

.loader .box2 {
  -webkit-animation-name: box-move2;
  animation-name: box-move2;
}

.loader .box2 div {
  -webkit-animation-name: box-scale2;
  animation-name: box-scale2;
}

.loader .box3 {
  -webkit-animation-name: box-move3;
  animation-name: box-move3;
}

.loader .box3 div {
  -webkit-animation-name: box-scale3;
  animation-name: box-scale3;
}

.loader .box4 {
  -webkit-animation-name: box-move4;
  animation-name: box-move4;
}

.loader .box4 div {
  -webkit-animation-name: box-scale4;
  animation-name: box-scale4;
}

.loader .box5 {
  -webkit-animation-name: box-move5;
  animation-name: box-move5;
}

.loader .box5 div {
  -webkit-animation-name: box-scale5;
  animation-name: box-scale5;
}

.loader .box6 {
  -webkit-animation-name: box-move6;
  animation-name: box-move6;
}

.loader .box6 div {
  -webkit-animation-name: box-scale6;
  animation-name: box-scale6;
}

.loader .box7 {
  -webkit-animation-name: box-move7;
  animation-name: box-move7;
}

.loader .box7 div {
  -webkit-animation-name: box-scale7;
  animation-name: box-scale7;
}

@-webkit-keyframes box-move0 {
  12% {
    transform: translate(var(--x), var(--y));
  }

  25%,
  52% {
    transform: translate(0, 0);
  }

  80% {
    transform: translate(0, -32px);
  }

  90%,
  100% {
    transform: translate(0, 188px);
  }
}

@keyframes box-move0 {
  12% {
    transform: translate(var(--x), var(--y));
  }

  25%,
  52% {
    transform: translate(0, 0);
  }

  80% {
    transform: translate(0, -32px);
  }

  90%,
  100% {
    transform: translate(0, 188px);
  }
}

@-webkit-keyframes box-scale0 {
  6% {
    transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(0);
  }

  14%,
  100% {
    transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(1);
  }
}

@keyframes box-scale0 {
  6% {
    transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(0);
  }

  14%,
  100% {
    transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(1);
  }
}

@-webkit-keyframes box-move1 {
  16% {
    transform: translate(var(--x), var(--y));
  }

  29%,
  52% {
    transform: translate(0, 0);
  }

  80% {
    transform: translate(0, -32px);
  }

  90%,
  100% {
    transform: translate(0, 188px);
  }
}

@keyframes box-move1 {
  16% {
    transform: translate(var(--x), var(--y));
  }

  29%,
  52% {
    transform: translate(0, 0);
  }

  80% {
    transform: translate(0, -32px);
  }

  90%,
  100% {
    transform: translate(0, 188px);
  }
}

@-webkit-keyframes box-scale1 {
  10% {
    transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(0);
  }

  18%,
  100% {
    transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(1);
  }
}

@keyframes box-scale1 {
  10% {
    transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(0);
  }

  18%,
  100% {
    transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(1);
  }
}

@-webkit-keyframes box-move2 {
  20% {
    transform: translate(var(--x), var(--y));
  }

  33%,
  52% {
    transform: translate(0, 0);
  }

  80% {
    transform: translate(0, -32px);
  }

  90%,
  100% {
    transform: translate(0, 188px);
  }
}

@keyframes box-move2 {
  20% {
    transform: translate(var(--x), var(--y));
  }

  33%,
  52% {
    transform: translate(0, 0);
  }

  80% {
    transform: translate(0, -32px);
  }

  90%,
  100% {
    transform: translate(0, 188px);
  }
}

@-webkit-keyframes box-scale2 {
  14% {
    transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(0);
  }

  22%,
  100% {
    transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(1);
  }
}

@keyframes box-scale2 {
  14% {
    transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(0);
  }

  22%,
  100% {
    transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(1);
  }
}

@-webkit-keyframes box-move3 {
  24% {
    transform: translate(var(--x), var(--y));
  }

  37%,
  52% {
    transform: translate(0, 0);
  }

  80% {
    transform: translate(0, -32px);
  }

  90%,
  100% {
    transform: translate(0, 188px);
  }
}

@keyframes box-move3 {
  24% {
    transform: translate(var(--x), var(--y));
  }

  37%,
  52% {
    transform: translate(0, 0);
  }

  80% {
    transform: translate(0, -32px);
  }

  90%,
  100% {
    transform: translate(0, 188px);
  }
}

@-webkit-keyframes box-scale3 {
  18% {
    transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(0);
  }

  26%,
  100% {
    transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(1);
  }
}

@keyframes box-scale3 {
  18% {
    transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(0);
  }

  26%,
  100% {
    transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(1);
  }
}

@-webkit-keyframes box-move4 {
  28% {
    transform: translate(var(--x), var(--y));
  }

  41%,
  52% {
    transform: translate(0, 0);
  }

  80% {
    transform: translate(0, -32px);
  }

  90%,
  100% {
    transform: translate(0, 188px);
  }
}

@keyframes box-move4 {
  28% {
    transform: translate(var(--x), var(--y));
  }

  41%,
  52% {
    transform: translate(0, 0);
  }

  80% {
    transform: translate(0, -32px);
  }

  90%,
  100% {
    transform: translate(0, 188px);
  }
}

@-webkit-keyframes box-scale4 {
  22% {
    transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(0);
  }

  30%,
  100% {
    transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(1);
  }
}

@keyframes box-scale4 {
  22% {
    transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(0);
  }

  30%,
  100% {
    transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(1);
  }
}

@-webkit-keyframes box-move5 {
  32% {
    transform: translate(var(--x), var(--y));
  }

  45%,
  52% {
    transform: translate(0, 0);
  }

  80% {
    transform: translate(0, -32px);
  }

  90%,
  100% {
    transform: translate(0, 188px);
  }
}

@keyframes box-move5 {
  32% {
    transform: translate(var(--x), var(--y));
  }

  45%,
  52% {
    transform: translate(0, 0);
  }

  80% {
    transform: translate(0, -32px);
  }

  90%,
  100% {
    transform: translate(0, 188px);
  }
}

@-webkit-keyframes box-scale5 {
  26% {
    transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(0);
  }

  34%,
  100% {
    transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(1);
  }
}

@keyframes box-scale5 {
  26% {
    transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(0);
  }

  34%,
  100% {
    transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(1);
  }
}

@-webkit-keyframes box-move6 {
  36% {
    transform: translate(var(--x), var(--y));
  }

  49%,
  52% {
    transform: translate(0, 0);
  }

  80% {
    transform: translate(0, -32px);
  }

  90%,
  100% {
    transform: translate(0, 188px);
  }
}

@keyframes box-move6 {
  36% {
    transform: translate(var(--x), var(--y));
  }

  49%,
  52% {
    transform: translate(0, 0);
  }

  80% {
    transform: translate(0, -32px);
  }

  90%,
  100% {
    transform: translate(0, 188px);
  }
}

@-webkit-keyframes box-scale6 {
  30% {
    transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(0);
  }

  38%,
  100% {
    transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(1);
  }
}

@keyframes box-scale6 {
  30% {
    transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(0);
  }

  38%,
  100% {
    transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(1);
  }
}

@-webkit-keyframes box-move7 {
  40% {
    transform: translate(var(--x), var(--y));
  }

  53%,
  52% {
    transform: translate(0, 0);
  }

  80% {
    transform: translate(0, -32px);
  }

  90%,
  100% {
    transform: translate(0, 188px);
  }
}

@keyframes box-move7 {
  40% {
    transform: translate(var(--x), var(--y));
  }

  53%,
  52% {
    transform: translate(0, 0);
  }

  80% {
    transform: translate(0, -32px);
  }

  90%,
  100% {
    transform: translate(0, 188px);
  }
}

@-webkit-keyframes box-scale7 {
  34% {
    transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(0);
  }

  42%,
  100% {
    transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(1);
  }
}

@keyframes box-scale7 {
  34% {
    transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(0);
  }

  42%,
  100% {
    transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(1);
  }
}

@-webkit-keyframes ground {
  0%,
  65% {
    transform: rotateX(90deg) rotateY(0deg) translate(-48px, -120px)
      translateZ(100px) scale(0);
  }

  75%,
  90% {
    transform: rotateX(90deg) rotateY(0deg) translate(-48px, -120px)
      translateZ(100px) scale(1);
  }

  100% {
    transform: rotateX(90deg) rotateY(0deg) translate(-48px, -120px)
      translateZ(100px) scale(0);
  }
}

@keyframes ground {
  0%,
  65% {
    transform: rotateX(90deg) rotateY(0deg) translate(-48px, -120px)
      translateZ(100px) scale(0);
  }

  75%,
  90% {
    transform: rotateX(90deg) rotateY(0deg) translate(-48px, -120px)
      translateZ(100px) scale(1);
  }

  100% {
    transform: rotateX(90deg) rotateY(0deg) translate(-48px, -120px)
      translateZ(100px) scale(0);
  }
}

@-webkit-keyframes ground-shine {
  0%,
  70% {
    opacity: 0;
  }

  75%,
  87% {
    opacity: 0.2;
  }

  100% {
    opacity: 0;
  }
}

@keyframes ground-shine {
  0%,
  70% {
    opacity: 0;
  }

  75%,
  87% {
    opacity: 0.2;
  }

  100% {
    opacity: 0;
  }
}

@-webkit-keyframes mask {
  0%,
  65% {
    opacity: 0;
  }

  66%,
  100% {
    opacity: 1;
  }
}

@keyframes mask {
  0%,
  65% {
    opacity: 0;
  }

  66%,
  100% {
    opacity: 1;
  }
}
</style>


