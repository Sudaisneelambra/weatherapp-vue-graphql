<script>
// importing axiosis
import axios from "axios";
// importing vue router
import { useRouter } from "vue-router";
import DailyWeatherCard from "../components/DailyWeatherCard.vue";
import UpcomingDaysWeatherCard from '../components/UpcomingDaysWeatherCard'


// data initialisation
export default {
  name: "WeatherHome",
  data() {
    return {
      place: "",
      router: useRouter(),
      msg: "",
      searchInput: "",
      loading: null,
      weatherData: null,
      city: null,
      apiKey: `${process.env.VUE_APP_WEATHER_API}`,
      temparature: null,
      description: null,
      iconUrl: null,
      date: null,
      time: null,
      wind: null,
      humidity: null,
      selecetedplaces: [],
      dailyForecastsArray: [],
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
  components: {
    DailyWeatherCard,
    UpcomingDaysWeatherCard
  },
  // initial time
  mounted() {
    this.fetchdata();
  },

  // methods
  methods: {

    // getting selected cities
    async selectedplace() {
      try {
        const response = await axios.post("http://localhost:2000/graphql", {
          query: `
            {
              getplaces {
                placename
              }
            }
          `,
        });
        this.selecetedplaces = response.data.data.getplaces;
      } catch (error) {
        console.log(`errors ${error}`);
      }
    },
    // city adding to 
    async addcity() {
      try {
        const response = await axios.post("http://localhost:2000/graphql", {
          query: `
                {
                    getplaces {
                        placename
                    }
                }
            `,
        });
        this.selecetedplaces = response.data.data.getplaces;
        if (this.selecetedplaces.length > 4) {
          this.msg = "your selection limit is over";
          setTimeout(() => {
            this.msg = "";
          }, 2000);
        } else {
          const response = await axios.post("http://localhost:2000/graphql", {
            query: `
                  mutation {
                    addcity( placename: "${this.city}") {
                      placename
                      }
                  }
                  `,
          });
          if (response.data.errors) {
            this.msg = response.data.errors[0].message;
            setTimeout(() => {
              this.msg = "";
            }, 2000);
          } else if (response.data.data.addcity.placename) {
            this.msg = "city added successfully";
            setTimeout(() => {
              this.msg = "";
            }, 2000);
            this.searchplace();
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    // searching city
    searchplace() {
      this.place = "";
      if (this.searchInput !== "") {
        this.selectedplace();
        this.loading = true;
        this.city = this.searchInput;
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&units=metric&appid=${this.apiKey}`;
        const futureDaysApi = `https://api.openweathermap.org/data/2.5/forecast?q=${this.city}&appid=${this.apiKey}`;
        axios
          .get(apiUrl)
          .then((response) => {
            if (response && response.data) {
              this.loading = false;
              this.weatherData = response.data;
              this.temperature = this.weatherData.main.temp;
              this.description = this.weatherData.weather[0].description;
              this.iconUrl = `https://api.openweathermap.org/img/w/${this.weatherData.weather[0].icon}.png`;
              const d = new Date();
              this.time =
                d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
              this.date =
                d.getDate() +
                "-" +
                this.monthNames[d.getMonth()] +
                "-" +
                d.getFullYear();
              this.wind = this.weatherData.wind.speed;
              this.humidity = this.weatherData.main.humidity;
            }
          })
          .catch((error) => {
            alert(
              "inputed location is not valid,please enter the valid locatin name"
            );
            this.loading = false;
            this.fetchdata();
            console.error(` fetching weather data error ${error}`);
          });

        axios
          .get(futureDaysApi)
          .then((response) => {
            if (response.status === 200) {
              this.loading = false;
              const futureweather = response.data;
              this.dailyForecastsArray = [];
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
            } else {
              console.error(
                `Failed to fetch weather data. Status 
                ${response.status}`
              );
            }
          })
          .catch((error) => {
            console.error(`fetching weather data error ${error}`);
          });
      }
    },
    // selection of selected city
    handleSelection() {
      this.searchInput = "";
      if (this.place != "") {
        this.loading = true;
        this.city = this.place;
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&units=metric&appid=${this.apiKey}`;
        const futureDaysApi = `https://api.openweathermap.org/data/2.5/forecast?q=${this.city}&appid=${this.apiKey}`;

        axios
          .get(apiUrl)
          .then((response) => {
            if (response && response.data) {
              this.loading = false;
              this.weatherData = response.data;
              this.temperature = this.weatherData.main.temp;
              this.description = this.weatherData.weather[0].description;
              this.iconUrl = `https://api.openweathermap.org/img/w/${this.weatherData.weather[0].icon}.png`;
              const d = new Date();
              this.time =
                d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
              this.date =
                d.getDate() +
                "-" +
                this.monthNames[d.getMonth()] +
                "-" +
                d.getFullYear();
              this.wind = this.weatherData.wind.speed;
              this.humidity = this.weatherData.main.humidity;
            }
          })
          .catch((error) => {
            alert(
              "inputed location is not valid,please enter the valid location name"
            );
            this.loading = false;
            this.fetchdata();
            console.error(`fetching weather data error ${error}`);
          });

        axios
          .get(futureDaysApi)
          .then((response) => {
            if (response.status === 200) {
              this.loading = false;
              const futureweather = response.data;
              this.dailyForecastsArray = [];
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
            } else {
              console.error(
                `Failed to fetch weather data
                ${response.status}`
              );
            }
          })
          .catch((error) => {
            console.error(`fetching weather data error ${error}`);
          });
      }
    },
    // fetching current location and weather
    fetchdata() {
      this.selectedplace();
      this.place = "";
      this.loading = true;
      this.dailyForecastsArray = [];
      this.searchInput = "";
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;

      
            const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${ this.apiKey}`;

            const futuredaysapi = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${ this.apiKey}`;

            axios
              .get(apiUrl)
              .then((response) => {
                if (response) {
                  const weatherData = response.data;
                  console.log(response.data);
                  this.temparature = weatherData.main.temp / 10;
                  this.description = weatherData.weather[0].description;
                  this.iconUrl = `https://api.openweathermap.org/img/w/${weatherData.weather[0].icon}.png`;
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
                console.error( `fetching weather ${error}`);
              });

            axios
              .get(futuredaysapi)
              .then((response) => {
                if (response.status === 200) {
                  this.loading = false;
                  const futureweather = response.data;
                  this.dailyForecastsArray = [];
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
                } else {
                  console.error(
                    `failed to fetch weather
                    ${response.status}`
                  );
                }
              })
              .catch((error) => {
                console.error(`fetching data error ${error}`);
              });
          },
          (error) => {
            switch (error.code) {
              case error.PERMISSION_DENIED:
                alert(
                  "user cancelled the request  please give permission"
                );
                this.router.push("/login");
                console.log("User canceled the request for Geolocation.");
                break;
              case error.POSITION_UNAVAILABLE:
                console.log("location information is unavailable.");
                break;
              case error.TIMEOUT:
                console.log("get user location timed out.");
                break;
              case error.UNKNOWN_ERROR:
                console.log("unknown error.");
                break;
            }
          }
        );
      } else {
        console.log("geolocation is not supported by this browser.");
      }
    },
    async deleteplace() {
      const response = await axios.post("http://localhost:2000/graphql", {
            query: `
              mutation {
                deleteplace {
                  placename
                }
              }
            `
          });
          this.fetchdata()
          console.log(response);
    },
    logout() {
      this.$router.push('/login');
    }
  },
};

</script>


<template>
  <!-- loading of the page  -->

  <div class="w-full h-screen grid place-items-center" v-if="loading">
    <div
      class="loader absolute top-[50%] left-[50%] transform translate-x-[-50%] -translate-y-1/2 w-[150px] h-[150px] bg-transparent border-2 border-[0,102,255,0.1] rounded-[50%] text-center leading-[150px] font-sans text-[20px] text-[#0066ff]"
    >
      Loading
      <span></span>
    </div>
  </div>

  <!-- main view -->
  <div class="w-full flex justify-center bg-[#ffff]" v-if="!loading">
    <div
      class="shadow-2xl p-10 rounded-lg mt-10 mb-10 w-[85%] bg-[#fff] border-2 border-[orangered]"
    >
      <div
        class="w-full flex flex-wrap sm:gap-0 gap-6 items-center justify-between font-bold cursor-pointer"
      >
        <h1 @click="fetchdata" class="links">Current location</h1>
        <h1 class="links">
          <label for="selectedcity" class="mr-1">saved cities</label>
          <select
            name="cities"
            class="bg-[#75727229] rounded-sm font-normal outline-none"
            id="cities"
            v-model="place"
            @change="handleSelection"
          >
            <option value="">Select</option>
            <option
              v-for="(city, index) in selecetedplaces"
              :key="index"
              :value="city.placename"
            >
              {{ city.placename }}
            </option>
          </select>
        </h1>
        <h1 class="links" @click="deleteplace">Reset savedcity</h1>

        <h1 class="links" @click="logout">Logout</h1>
      </div>

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
              class="ml-4 bg-[orangered] text-[white] px-3 rounded-md font-bold outline"
              @click.prevent="searchplace"
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

      <!-- todays temparature -->
      <DailyWeatherCard :iconUrl="iconUrl" :temparature="temparature" :humidity="humidity" :wind="wind" :time="time"></DailyWeatherCard>

      <!--weather of upcoming days-->
      <UpcomingDaysWeatherCard :dailyForecastsArray="dailyForecastsArray"></UpcomingDaysWeatherCard>

      
      <h1 class="w-full text-center text-[red] text-[10px] mt-2">{{ msg }}</h1>
      <h1 class="w-full text-center mt-2">
        <button
          class="py-1 px-2 rounded-md font-bold bg-[orangered] text-[white]"
          @click="addcity"
        >
          Save the location
        </button>
      </h1>
    </div>
  </div>
</template>



<style>
.links {
  position: relative;
  background-color: #75727229;
  border-radius: 2px;
  padding: 4px;
}
.links::after {
  content: "";
  display: block;
  height: 2px;
  width: 100%;
  background-color: black;
  position: absolute;
  bottom: 0;
  left: 0;
  transform: scaleX(0);
  transition: all 0.5s;
}
.links:hover::after {
  transform: scaleX(1);
}

.loader {
  letter-spacing: 2px;
  text-transform: uppercase;
  text-shadow: 0 0 10px #0066ff;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
}

.loader::before {
  content: "";
  position: absolute;
  top: -3px;
  left: -3px;
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-top: 3px solid #0066ff;
  border-right: 3px solid #0066ff;
  border-radius: 50%;
  animation: animateC 2s linear infinite;
}

.loader span {
  display: block;
  position: absolute;
  top: calc(50% - 2px);
  left: 50%;
  width: 50%;
  height: 4px;
  background: transparent;
  transform-origin: left;
  animation: animate 2s linear infinite;
}

.loader span::before {
  content: "";
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #00aeff;
  top: -6px;
  right: -8px;
  box-shadow: 0 0 20px 5px #0066ff;
}

@keyframes animateC {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@keyframes animate {
  0% {
    transform: rotate(45deg);
  }

  100% {
    transform: rotate(405deg);
  }
}
</style>
