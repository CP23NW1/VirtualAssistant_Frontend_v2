<template>
  <div
    class="w-full sm:w-[520px] h-auto sm:h-[520px] rounded-[50px] shadow flex-col justify-end items-end inline-flex absolute inset-y-20 right-0 shadow-2xl"
  >
    <div
      class="flex justify-between self-stretch p-3 bg-gradient-to-r from-blue-600 to-indigo-500 rounded-t-lg"
    >
      <div
        class="text-center text-white text-3xl font-normal font-['Inter'] leading-[50px]"
      >
        Chat
      </div>

      <button
        class="self-stretch text-center text-black text-[15px] font-normal font-['Inter'] leading-[15px] items-center justify-center rounded-lg px-6 py-3 transition duration-500 ease-in-out bg-zinc-100 hover:bg-blue-400 focus:outline-none"
        @click="clearchat"
      >
        <span class="font-bold">Clear Chat</span>
      </button>
    </div>

    <div class="w-[520px] h-[520px] relative bg-white" id="chat-container">
      <div
        class="h-96 p-4 overflow-auto"
        id="chat-messages"
        ref="chatContainer"
      >
        <div
          class="h-30 px-6 py-2 overflow-auto"
          v-for="message in messages"
          :key="message.id"
        >
          <div
            :class="[
              'chat-bubble',
              message.role === 'assistant' ? 'float-left' : 'float-right',
            ]"
          >
            <div id="msg-content">
              <div class="" id="user-icon" v-if="message.role === 'user'">
                <img
                  src="../../assets/human-logo.jpg"
                  class="w-6 h-6 rounded-full float-right"
                />
                <p class="text-right">User</p>
                <p
                  class="bg-blue-600 text-white p-3 rounded-lg shadow-md"
                  id="msg"
                >
                  {{ message.content }}
                </p>
              </div>
              <div id="assistant-icon" v-if="message.role === 'assistant'">
                <img
                  src="../../assets/ai-bot-logo.jpg"
                  class="w-6 h-6 rounded-full float-left"
                />
                <p class="assistant-name">น้องมณี</p>
                <p class="bg-gray-300 p-3 rounded-lg" id="msg">
                  {{ message.content }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="self-stretch h-[65px] p-5 bg-gray-200 rounded-b-lg"
      id="chat-input"
    >
      <div
        class="self-stretch h-[20px] w-full pb-1 justify-between items-center inline-flex"
      >
        <div
          class="text-neutral-500 text-[15px] font-normal font-['Inter'] leading-tight flex-auto"
        >
          <input
            type="text"
            v-model="userQueryText"
            id="input-box"
            placeholder="Type a reply..."
            class="mt-2 rounded-md bg-white border-transparent focus:border-white bg-white focus:ring-0 w-9/12"
            @keyup.enter="handleUserSubmit"
          />

          <button
            type="button"
            @click="handleUserSubmit"
            id="send-button"
            class="inline-flex w-3/12 items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-600 hover:bg-blue-400 focus:outline-none"
          >
            <span class="font-bold">Send</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              class="h-5 w-5 ml-2 transform rotate-90"
            >
              <path
                d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>

  <footer class="fixed left-0 mt-20">
    <button
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      @click="changeModel"
    >
      Change Model
    </button>
    <div class="inline-block relative w-64">
      <select
        v-model="selectedSound"
        class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
      >
        <option
          v-for="sound in sounds"
          :key="sound"
          :selected="sound === 'Women Sound1'"
        >
          {{ sound }}
        </option>
      </select>
      <div
        class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
      >
        <svg
          class="fill-current h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path
            d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
          />
        </svg>
      </div>
    </div>
  </footer>
</template>

<script>
import { LAppLive2DManager } from "../../logic/lapplive2dmanager";
import { ConsoleLoggingListener } from "microsoft-cognitiveservices-speech-sdk/distrib/lib/src/common.browser/ConsoleLoggingListener";
export default {
  name: "Chat",
  methods: {
    changeModel() {
      const lappl2dman = LAppLive2DManager.getInstance();
      lappl2dman.nextScene();
    },
  },
};
</script>

<script setup>
import {
  MotionGroupIdle,
  MotionGroupTapBody,
  PriorityForce,
  PriorityIdle,
  PriorityNormal,
} from "../../logic/lappdefine";
import { ref, reactive, watch, onMounted } from "vue";

const selectedSound = ref("Women Sound1");
const sounds = ["Women Sound1", "Women Sound2", "Men Sound"];

const userQueryText = ref("");
const chatContainer = ref(null);
const messages = reactive([]);
const token = localStorage.getItem("token");

function clearchat() {
  fetch("http://localhost:7000/api/delete_message", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (response.ok) {
        messages.length = 0;
        localStorage.removeItem("messages");
      } else {
        console.error("Failed to delete messages from the server");
      }
    })
    .catch((error) => {
      console.error("Error during delete request:", error);
      alert("Error during delete request. Please try again.");
    });
}

function selectVoice() {
  if (selectedSound.value === "Women Sound1") {
    return "women";
  } else if (selectedSound.value === "Women Sound2") {
    return "women";
  } else {
    return "men";
  }
}

function handleUserSubmit() {
  if (!userQueryText.value.trim()) {
    alert("Please enter a message");
    return;
  }

  scrollToBottom();

  const userMsg = {
    role: "user",
    content: userQueryText.value,
  };
  messages.push(userMsg);
  // speakAssistantResponse(userQueryText.value, selectedSound.value);

  userQueryText.value = "";

  scrollToBottom();

  const assistantMsg = {
    role: "assistant",
    content: "Loading...",
  };
  messages.push(assistantMsg);
  scrollToBottom();

  const msg = {
    role: "user",
    content: userMsg.content,
    voice: selectVoice(),
  };

  try {
    // fetch("http://10.4.85.21:7000/api/user_message", {
    fetch("http://localhost:7000/api/user_message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(msg),
    })
      .then((response) => response.json())
      .then((data) => {
        const assistantResponse = {
          role: "assistant",
          content: data.content,
        };
        const index = messages.indexOf(assistantMsg);
        if (index !== -1) {
          messages.splice(index, 1, assistantResponse);
        }
        localStorage.setItem("messages", JSON.stringify(messages));

        speakAssistantResponse(data.content, selectedSound.value);
        scrollToBottom();
      })
      .catch((error) => {
        console.error("Error during fetch:", error);
        alert("Error during fetch. Please try again.");
      });
  } catch (err) {
    console.error("Error:", err);
    alert("An error occurred. Please try again.");
  }
}

function scrollToBottom() {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
}

function historyMessage() {
  if (!token) {
    alert("Token not found in localStorage");
    return;
  }
  try {
    fetch("http://10.4.85.21:7000/api/history_message", {
    // fetch("http://localhost:7000/api/history_message", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        localStorage.setItem("messages", JSON.stringify(data.history_message));
        scrollToBottom();
      })
      .catch((error) => {
        console.error("Error during history fetch:", error);
        alert("Error during history fetch. Please try again.");
      });
  } catch (err) {
    console.error("Error:", err);
    alert("An error occurred. Please try again.");
  }
}

onMounted(() => {
  historyMessage();
  const previousMessage = JSON.parse(localStorage.getItem("messages")) || [];
  messages.push(...previousMessage);
  scrollToBottom();
});

watch(messages, () => {
  scrollToBottom();
});

const sdk = require("microsoft-cognitiveservices-speech-sdk");
const key = "8d959935a5324cd6af89d3be89088263";
const region = "southeastasia";

async function speakAssistantResponse(content, selectedSound) {
  const speechConfig = sdk.SpeechConfig.fromSubscription(key, region);
  const speechSynthesizer = new sdk.SpeechSynthesizer(speechConfig);

  let ssml = "";

  if (selectedSound === "Women Sound1")
    ssml = `<speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xmlns:emo="http://www.w3.org/2009/10/emotionml" version="1.0" xml:lang="th-TH"><voice name="th-TH-PremwadeeNeural"><prosody rate="-15.00%">${content}</prosody></voice></speak>`;
  else if (selectedSound === "Women Sound2")
    ssml = `<speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xmlns:emo="http://www.w3.org/2009/10/emotionml" version="1.0" xml:lang="th-TH"><voice name="th-TH-AcharaNeural"><prosody rate="-15.00%">${content}</prosody></voice></speak>`;
  else if (selectedSound === "Men Sound")
    ssml = `<speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xmlns:emo="http://www.w3.org/2009/10/emotionml" version="1.0" xml:lang="th-TH"><voice name="th-TH-NiwatNeural"><prosody rate="-15.00%">${content}</prosody></voice></speak>`;

  const requestHeaders = new Headers();
  requestHeaders.set("Content-Type", "application/ssml+xml");
  requestHeaders.set("X-Microsoft-OutputFormat", "riff-8khz-16bit-mono-pcm");
  requestHeaders.set("Ocp-Apim-Subscription-Key", key);

  const response = await fetch(
    `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`,
    {
      method: "POST",
      headers: requestHeaders,
      body: ssml,
    },
  );

  const blob = await response.blob();
  var url = window.URL.createObjectURL(blob);
  // console.log(url);
  const audio = document.getElementById("voice");
  audio.src = url;
  audio.play();
  const lappl2dman = LAppLive2DManager.getInstance();
  const tororoModel = lappl2dman.getModel(0);
  tororoModel._wavFileHandler.start(url);
  tororoModel.startMotion("Idle", 2, PriorityForce, lappl2dman._finishedMotion);
  setTimeout(() => window.URL.revokeObjectURL(url), 3000);
}
</script>
