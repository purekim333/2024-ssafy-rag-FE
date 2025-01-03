<template>
  <div :class="['chat-container', darkMode ? 'dark' : 'light']">
    <!-- Main Chat -->
    <div class="chat-main">
      <header class="chat-header">
        <button @click="toggleDarkMode" class="toggle-btn">
          {{ darkMode ? 'Light Mode' : 'Dark Mode' }}
        </button>
        <button @click="startNewChat" class="new-chat-btn">
          <PlusIcon class="icon" />
          + New Chat
        </button>
      </header>
      <div class="chat-box">
        <ul>
          <li
            v-for="(msg, index) in messages"
            :key="index"
            :class="{ user: msg.role === 'user', assistant: msg.role === 'assistant' }"
          >
            <div class="message-container">
              <div
                :class="['avatar', msg.role === 'user' ? 'user-avatar' : 'assistant-avatar']"
              >
                <User v-if="msg.role === 'user'" class="icon" />
                <Bot v-else class="icon" />
              </div>
              <div
                class="message"
                v-html="msg.role === 'assistant' ? renderMarkdown(msg.content) : msg.content"
              ></div>
              <span class="timestamp">{{ getCurrentTime() }}</span>
            </div>
          </li>
        </ul>
      </div>
      <form @submit.prevent="sendMessage" class="input-container">
        <input
          v-model="userMessage"
          type="text"
          placeholder="당신이 궁금한 기업에 대해 질문하세요!"
        />
        <button type="submit">
          <SendIcon class="w-5 h-5" />
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useCounterStore } from "@/stores/counter";
import { SendIcon, User, Bot } from "lucide-vue-next";
import { marked } from "marked";

// 서버 URL 설정
const BASE_URL = useCounterStore().BASE_URL;

const userMessage = ref(""); // 사용자 입력 메시지
const messages = ref([]); // 메시지 저장 배열
const darkMode = ref(false); // 다크 모드 상태

const toggleDarkMode = () => {
  darkMode.value = !darkMode.value;
};

const sendMessage = async () => {
  if (!userMessage.value.trim()) return; // 빈 메시지 처리

  // 사용자 메시지 추가
  messages.value.push({ role: "user", content: userMessage.value });

  try {
    // 서버로 메시지 전송
    const response = await axios.post(`${BASE_URL}chat`, {
      message: userMessage.value,
    });

    // 서버 응답 추가
    messages.value.push({ role: "assistant", content: response.data.reply });
  } catch (error) {
    console.error("Error:", error);
    messages.value.push({
      role: "assistant",
      content: "Error occurred while connecting to the server.",
    });
  }

  userMessage.value = ""; // 입력 필드 초기화
};

const startNewChat = () => {
  // 메시지 배열 초기화
  messages.value = [];
  userMessage.value = "";
  console.log("Chat has been reset.");
};

const getCurrentTime = () => {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

// Markdown 렌더링 함수
const renderMarkdown = (text) => {
  return marked(text, { sanitize: true }); // XSS 방지를 위해 sanitize 옵션 사용
};


</script>

<style scoped>

/* 전체 화면 채우기 */
.chat-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 99vw;
  height: 97vh;
  background: var(--background-color);
  color: var(--text-color);
}
/* 
.chat-container.light {
  --background-color: #ffffff;
  --text-color: #333;
  --header-bg: #2e2e4a;
  --user-bg: z#fafafa;
  --background-outline: #333;
  --assistant-bg: #fff9c4;
}

.chat-container.dark {
  --background-color: #1e1e2e;
  --text-color: #e0e0e0;
  --header-bg: #2e2e4a;
  --user-bg: #4a4a6a;
  --assistant-bg: #3a3a5a;
} */

.chat-main {
  width: 100%; /* 전체 너비 */
  height: 100%; /* 전체 높이 */
  background: white;
  display: flex;
  flex-direction: column;
}

.chat-header {
  background: var(--header-bg);
  color: white;
  text-align: center;
  padding: 5px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-box {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: var(--background-color);
}

.chat-box ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.chat-box li {
  display: flex;
  margin-bottom: 15px;
}

.user {
  justify-content: flex-end; /* 사용자 메시지 오른쪽 정렬 */
}

.assistant {
  justify-content: flex-start; /* Bot 메시지 왼쪽 정렬 */
}

.message {
  background: var(--user-bg);
  padding: 10px 15px;
  border-radius: 12px;
  border: 1px solid #cdcdcd;
  text-align: left; /* 텍스트 왼쪽 정렬 */
  font-size: 14px;
  line-height: 1.5;
  max-width: 80%; /* 메시지 최대 너비 설정 */
  display: inline-block;
}

.user .message {
  background: var(--user-bg);
  color: var(--text-color);
  align-self: flex-end;
  text-align: left; 
}

.assistant .message {
  background: var(--user-bg);;
  color: var(--text-color);
  align-self: flex-start;
  text-align: left; /* 텍스트 왼쪽 정렬 */
}

.timestamp {
  font-size: 10px;
  color: #aaa;
  margin-top: 4px;
  text-align: right;
}

.input-container {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  background: white;
  border-top: 1px solid #ddd;
}

input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
  margin-right: 10px;
  outline: none;
}

button {
  padding: 10px 16px;
  background: var(--header-bg);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}

button:hover {
  background: #5846d6;
}



.toggle-btn {
  margin-left: auto; /* 오른쪽 정렬 */
  padding: 8px 10px;
  background: transparent;
  color: white;
  /* border: 1px solid white; */
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
}

.toggle-btn:hover {
  background: white;
  color: var(--header-bg);
}

/* .new-chat-btn {
  margin-left: 10px;
  padding: 8px 12px;
  background: var(--header-bg);
  color: white;
  border: 1px solid white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.new-chat-btn:hover {
  background: white;
  color: var(--header-bg);
} */

.message-container {
  display: flex;
  align-items: flex-end;
  margin-bottom: 15px;
}

.avatar {
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: bold;
  color: white;
  border-radius: 50%;
  margin-right: 10px;
  flex-shrink: 0;
}

.avatar .icon {
  width: 24px;
  height: 24px;
}

.user-avatar {
  background: linear-gradient(to bottom right, #f06292, #4fc3f7); 
}

.assistant-avatar {
  background: linear-gradient(to bottom right, #64b5f6, #3f51b5); 
}


.chat-container.light {
  --background-color: #ffffff; /* 밝은 보라색 배경 */
  --text-color: #333; /* 어두운 텍스트 */
  --header-bg: #5e4cc9; /* 헤더의 연한 보라색 */
  --user-bg: #f4f3fc; /* 사용자 메시지의 부드러운 배경 */
  --assistant-bg: #ffffff; /* Bot 메시지의 부드러운 보라색 */
}

.chat-container.dark {
  --background-color: #1e1e2e; /* 어두운 배경 */
  --text-color: #e0e0e0; /* 텍스트 색상 */
  --header-bg: #2e2e4a; /* 헤더의 어두운 톤 */
  --user-bg: #3b3a50; /* 사용자 메시지 배경 */
  --assistant-bg: #2f2e46; /* Bot 메시지 배경 */
}

.new-chat-btn {
  background: transparent;
  color: white; /* 버튼 텍스트 흰색 */
  font-size: 14px;
}

.new-chat-btn:hover {
  background: white;
  color: var(--header-bg);
}



</style>
