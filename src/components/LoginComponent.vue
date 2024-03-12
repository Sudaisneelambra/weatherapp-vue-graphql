<script>
import axios from "axios";
import { useRouter } from 'vue-router';

export default {
  name: "LoginForm",
  data() {
    return {
      router :useRouter(),
      formData: {
        email: "",
        password: "",
      },
      already: "",
    };
  },
  methods: {
    async LoginSubmit() {
      try {
        const response = await axios.post("http://localhost:2000/graphql", {
          query: `
            mutation {
                loginuser( email: "${this.formData.email}", password: "${this.formData.password}") {
                email
                }
            }
            `,
        });
        if (response.data.errors) {
          this.already = response.data.errors[0].message;
        } else if (response.data.data.loginuser.email){
            this.router.push('/home');
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>


<template>
    <div class="w-full border-2  h-screen bg-[white] flex justify-center items-center">
      <div class="md:w-[50%] w-[90%] sm:w-[70%] shadow-lg p-3 flex flex-col items-center border-2 border-[orangered] rounded-md">
        <h2 class="text-2xl font-bold mb-4">Login</h2>
        <form @submit.prevent="LoginSubmit" class="sm:w-[90%] w-full p-4 rounded-lg">
          <div class="mb-4">
            <label for="email" class="block mb-1">Email:</label>
            <input type="email" id="email" v-model="formData.email" class="w-full p-2 border rounded-md" />
            <label for="" v-if="!formData.email" class="text-[10px] text-[red]">email required*</label>
          </div>
          <div class="mb-4">
            <label for="password" class="block mb-1">Password:</label>
            <input type="password" id="password" v-model="formData.password" class="w-full p-2 border rounded-md" />
            <label for="" v-if="!formData.password" class="text-[10px] text-[red]">password required*</label>
          </div>
          <button type="submit" class="bg-[orangered] border-2 font-bold text-white px-4 py-2 rounded-md hover:bg-blue-600">
            Login
          </button>
          <h1 class="w-full text-center text-[10px] text-[red]">{{ already }}</h1>
          <h1 class="w-full text-center text-[blue] text-[10px]">
            You don't have an account? <router-link :to="'/'"><u>Signup</u></router-link>
          </h1>
        </form>
      </div>
    </div>
  </template>
  

<style>
</style>


