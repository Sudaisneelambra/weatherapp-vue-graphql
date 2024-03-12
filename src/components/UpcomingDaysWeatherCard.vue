<script>
    export default {
        props: {
          dailyForecastsArray: Array,
        }
      }
</script>

<template>
    <section class="">
        <h1 class="font-bold text-[red] text-[22px]">Upcoming days</h1>
        <div
          class="row week-forecast flex flex-wrap justify-center gap-10 mt-6"
        >
          <template v-for="(forecast, index) in dailyForecastsArray"
          :key="index">
            <div v-if="dailyForecastsArray.length <= 5 || dailyForecastsArray.length > 5 && index !== 0"
            class="col shadow-xl w-[180px] grid place-items-center bg-[#8080803e] rounded-md"
            
          >
            <h3 class="font-[cursive] text-[12px] mt-2">{{ forecast?.day }}</h3>
            <br />
            <img
              :src="`https://api.openweathermap.org/img/w/${forecast?.icons?.[0]}.png`"
              alt="icon"
            />
            <br />
            <p class="weather font-[cursive] text-[16px]">
              {{ forecast?.descriptions?.[0] }}
            </p>
            <span class="mb-2"
              >{{ (forecast?.temperatures?.[0] / 10).toFixed(1) }}°</span
            >
          </div>
          </template>
        </div>
      </section>
</template>