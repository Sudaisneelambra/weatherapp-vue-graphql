<script>
    export default {
        props: {
          iconUrl: String,
          temparature: String,
          humidity:String,
          wind:String,
          time:String
        }
      }
</script>

<template>
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
              <img :src="iconUrl" alt="icons" />
            </div>
            <div
              class="col todays-info sm:w-[30%] flex flex-col justify-around items-center"
            >
              <p id="current-time ">{{ time }}</p>
              <h2 id="current-day " class="font-bold text-[30px]">Today</h2>
              <!-- <p id="weather-type">{{ description }}</p> -->
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
</template>