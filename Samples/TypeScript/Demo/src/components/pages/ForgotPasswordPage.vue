<template>
  <section class="flex flex-col md:flex-row h-screen items-center">
    <div class="bg-blue-600 hidden lg:block w-full md:w-1/2 xl:w-2/3 h-screen">
      <div id="canvasContainer"></div>
    </div>

    <div
      class="bg-white w-full md:max-w-md lg:max-w-full md:mx-auto md:mx-0 md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12 flex items-center justify-center"
    >
      <div class="w-full h-100">
        <h1 class="text-xl md:text-5xl font-bold leading-tight mt-4">
          Forgot password?
        </h1>
        <p class="mt-8">
          Remember your password?
          <router-link
            to="/"
            class="text-blue-600 hover:text-blue-600 font-semibold"
            >Login here</router-link
          >
        </p>
        <form class="mt-6" @submit.prevent="sendEmail">
          <div class="mt-4">
            <label class="block text-gray-700">Email address</label>
            <input
              v-model="email"
              type="text"
              placeholder="Enter your email"
              minlength="6"
              class="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-600 focus:bg-white focus:outline-none"
              required
            />
          </div>
          <div class="mt-6 pt-4 flex items-center space-x-4">
            <button
              type="submit"
              class="bg-blue-600 flex justify-center items-center w-full text-white px-4 py-3 rounded-md focus:outline-none"
            >
              Send Email
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script>
import { LAppDelegate } from "../../logic/lappdelegate";
import { LAppGlManager } from "../../logic/lappglmanager";
export default {
  mounted() {
    if (
      !LAppGlManager.getInstance() ||
      !LAppDelegate.getInstance().initialize()
    ) {
      return;
    }
    LAppDelegate.getInstance().run();
  },
  name: "ForgotPasswordPage",
};
</script>
<script setup>
import { ref } from "vue";

const email = ref("");

const sendEmail = async () => {
  try {
    const response = await fetch("http://10.4.85.21:7000/api/forget-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.value,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      alert(data.message);
      router.push("/");
    } else {
      const data = await response.json();
      alert(data.detail);
    }
  } catch (error) {
    alert(error.message);
  }
};
</script>
