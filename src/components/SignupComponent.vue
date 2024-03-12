<script>
import axios from "axios";
import { useRouter } from 'vue-router';

export default {
  name: "SignUpForm",
  data() {
    return {
      router :useRouter(),
      formData: {
        name: "",
        email: "",
        password: "",
      },
      already: "",
    };
  },
  methods: {
    async submitData() {
      try {
        const response = await axios.post("http://localhost:2000/graphql", {
          query: `
            mutation {
                addUser(name: "${this.formData.name}", email: "${this.formData.email}", password: "${this.formData.password}") {
                name
                }
            }
            `,
        });
        if (response.data.errors) {
          this.already = response.data.errors[0].message;
        } else {
          this.router.push('/home')
          this.resetForm();
        }
      } catch (error) {
        console.log(error);
      }
    },

    submitForm(event) {
      event.preventDefault(); 
      if (
        this.formData.name != "" &&
        this.formData.email != "" &&
        this.formData.password != ""
      ) {
        this.submitData(); 
      } else {
        alert("Please fill in all the fields.");
      }
    },
    resetForm() {
      this.formData.name = "";
      this.formData.email = "";
      this.formData.password = "";
    },
  },
};
</script>


<template>

    <div
    class="w-full border-2 h-screen bg-[white] flex justify-center items-center"
  >
  <div
    class="md:w-[50%] w-[90%] sm:w-[70%] shadow-lg p-3 flex flex-col items-center border-2 border-[orangered] rounded-md"
  >
    <h2 class="text-2xl font-bold mb-4">Sign Up</h2>
    <form @submit.prevent="submitForm" class="sm:w-[90%] w-full p-2 rounded-lg">
      <div class="mb-4">
        <label for="name" class="block mb-1">Name:</label>
        <input
          type=" text"
          id="name"
          v-model="formData.name"
          class="w-full p-2 border rounded-md"
        />
        <label for="" v-if="!formData.name" class="text-[10px] text-[red]"
          >name required*</label
        >
      </div>
      <div class="mb-4">
        <label for="email" class="block mb-1">Email:</label>
        <input
          type="email"
          id="email"
          v-model="formData.email"
          class="w-full p-2 border rounded-md"
        />
        <label for="" v-if="!formData.email" class="text-[10px] text-[red]"
          >email required*</label
        >
      </div>
      <div class="mb-4">
        <label for="password" class="block mb-1">Password:</label>
        <input
          type="password"
          id="password"
          v-model="formData.password"
          class="w-full p-2 border rounded-md"
        />
        <label for="" v-if="!formData.password" class="text-[10px] text-[red]"
          >password required*</label
        >
      </div>
      <button
        type="submit"
        class=" border-2 bg-[orangered] text-[white] font-bold px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Sign Up
      </button>
      <h1 class="w-full text-center text-[10px] text-[red]">{{ already }}</h1>
      <h1 class="w-full text-center text-[blue] text-[10px] my-3">
        You have Already account?<router-link :to="'/login'"
          ><u>Login</u></router-link
        >
      </h1>
    </form>
  </div>
    </div>
</template>


<style>
</style>
