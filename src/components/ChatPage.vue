<template>
  <div class="chat-page">
    <header class="chat-header">
      <router-link to="/home" class="header-logo">
        <img :src="logoImage" alt="Logo" />
      </router-link>
      <span class="chat-title">🤖 AI 聊天室</span>
      <div class="user-avatar" @click="toggleUserDropdown">
        <img :src="userAvatarImage" alt="User Avatar" />
        <div v-if="showUserDropdown" class="user-dropdown">
          <div class="dropdown-item" @click.stop="goToPersonalCenter">个人中心</div>
          <div class="dropdown-item" @click.stop="goToRegister">注册</div>
        </div>
      </div>
    </header>
    <div class="main-content-area">
      <div class="sidebar">
        <h3>历史消息</h3>
        <ul class="history-list">
          <li v-for="(chat, index) in chatHistory" :key="chat.id" @click="loadChat(chat.id)"
            :class="{ 'active': chat.id === chatId }">
            {{ chat.preview }}
          </li>
        </ul>
      </div>
      <div class="chat-inner">
        <main class="chat-main" ref="chatMainRef">
          <div class="chat-history">
            <transition-group name="msg-fade" tag="div">
              <div v-for="(msg, idx) in messages" :key="idx" :class="['chat-msg', msg.role]">
                <template v-if="msg.role==='ai'">
                  <div class="msg-avatar">🤖</div>
                  <div class="msg-content" v-html="formatContent(msg.content)"></div>
                </template>
                <template v-else>
                  <div class="msg-content">{{ msg.content }}</div>
                  <div class="msg-avatar user-avatar">🧑</div>
                </template>
              </div>
            </transition-group>
            <div v-if="streamingMsg" class="chat-msg ai">
              <div class="msg-avatar">🤖</div>
              <div class="msg-content streaming" v-html="formatContent(streamingMsg)"></div>
            </div>
          </div>
        </main>
        <footer class="chat-footer">
          <input v-model="input" @keyup.enter="sendMessage" placeholder="请输入内容..." :disabled="loading" />
          <button @click="sendMessage" :disabled="loading || !input">
            <span v-if="!loading">发送</span>
            <span v-else class="loading-dot">●●●</span>
          </button>
        </footer>
      </div>
      <div class="system-prompt-section">
        <h3>System Prompt</h3>
        <textarea v-model="systemPrompt" placeholder="请输入System Prompt..."></textarea>
        <button @click="applySystemPrompt">应用</button>
        <!-- 其他信息输入栏 -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import axios from 'axios'
import logoImage from '@/assets/image/头像.png'
import userAvatarImage from '@/assets/image/用户头像.png'
import { useRouter } from 'vue-router'
import { marked } from 'marked';

marked.setOptions({
  breaks: true , // 自动将 \n 转换为 <br>
  gfm: true
});

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

const chatId = ref('')
const input = ref('')
const messages = ref([])
const streamingMsg = ref('')
const loading = ref(false)
const systemPrompt = ref('')
const chatHistory = ref([])
const showUserDropdown = ref(false)
const router = useRouter()
let eventSource = null

const chatMainRef = ref(null)

onMounted(() => {
  initChat()
  loadChatHistory()
})

onUnmounted(() => {
})

watch(chatId, (newId, oldId) => {
  if (newId !== oldId) {
    saveCurrentChat()
    messages.value = []
    streamingMsg.value = ''
    systemPrompt.value = ''
  }
})

function initChat() {
  chatId.value = uuidv4()
}

function scrollToBottom() {
  nextTick(() => {
    if (chatMainRef.value) {
      chatMainRef.value.scrollTop = chatMainRef.value.scrollHeight
    }
  })
}

function sendMessage() {
  if (!input.value.trim()) return
  const userMsg = { role: 'user', content: input.value }
  messages.value.push(userMsg)
  loading.value = true
  streamingMsg.value = ''
  scrollToBottom()

  if (eventSource) {
    eventSource.close()
  }

  let url = `http://localhost:8123/api/chat/sse?message=${encodeURIComponent(input.value)}&chatId=${chatId.value}`
  if (systemPrompt.value) {
    url += `&systemPrompt=${encodeURIComponent(systemPrompt.value)}`
  }

  eventSource = new EventSource(url)

  eventSource.onmessage = (event) => {
    if (event.data) {
      streamingMsg.value += event.data
      scrollToBottom()
    }
  }
  eventSource.onerror = () => {
    finishStream()
    saveCurrentChat()
  }
  eventSource.onopen = () => {
    input.value = ''
  }
}

function finishStream() {
  if (streamingMsg.value) {
    messages.value.push({ role: 'ai', content: streamingMsg.value })
    streamingMsg.value = ''
    scrollToBottom()
  }
  loading.value = false
  if (eventSource) {
    eventSource.close()
    eventSource = null
  }
}

function loadChatHistory() {
  const history = localStorage.getItem('chatHistory')
  if (history) {
    chatHistory.value = JSON.parse(history)
  }
}

function saveCurrentChat() {
  if (messages.value.length > 0) {
    const existingChatIndex = chatHistory.value.findIndex(chat => chat.id === chatId.value)
    const chatPreview = messages.value[0].content.substring(0, 30) + '...'

    if (existingChatIndex !== -1) {
      chatHistory.value[existingChatIndex] = { id: chatId.value, messages: messages.value, systemPrompt: systemPrompt.value, preview: chatPreview }
    } else {
      chatHistory.value.unshift({ id: chatId.value, messages: messages.value, systemPrompt: systemPrompt.value, preview: chatPreview })
    }
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory.value))
  }
}

function loadChat(id) {
  saveCurrentChat()
  const chatToLoad = chatHistory.value.find(chat => chat.id === id)
  if (chatToLoad) {
    chatId.value = chatToLoad.id
    messages.value = chatToLoad.messages
    systemPrompt.value = chatToLoad.systemPrompt || ''
    nextTick(() => scrollToBottom())
  }
}

function applySystemPrompt() {
  // For now, applying the system prompt just means it's available for the next message.
  // If the user wants immediate effects or a specific action, this function can be expanded.
  console.log("System Prompt applied:", systemPrompt.value)
  saveCurrentChat()
}

function formatContent(text) {
  return marked(text.replace(/^(\s{0,3}#{1,6})([^\s#])/gm, '$1 $2'));
  // if (!text) return ''
  // // Convert \n to <br>, and basic HTML escaping
  // return text.replace(/&/g, '&amp;')
  //            .replace(/</g, '&lt;')
  //            .replace(/>/g, '&gt;')
  //            .replace(/\n/g, '<br>')
}

function toggleUserDropdown() {
  showUserDropdown.value = !showUserDropdown.value
}

function goToPersonalCenter() {
  console.log("Go to Personal Center")
  router.push('/personal-center')
  showUserDropdown.value = false
}

function goToRegister() {
  console.log("Go to Register")
  router.push('/')
  showUserDropdown.value = false
}
</script>

<style scoped>
.chat-page {
  display: flex;
  flex-direction: column; /* Stack header and main content vertically */
  width: 100vw;
  height: 100vh;
  min-width: 900px; /* Ensure minimum width for desktop */
  max-width: none;
  margin: 0;
  background: linear-gradient(135deg, #1a0f26 0%, #0a0510 100%); /* Dark, moody background */
}

.main-content-area {
  flex: 1; /* Allow main content to take up remaining vertical space */
  display: flex;
  flex-direction: row; /* Arrange sidebar, chat-inner, system-prompt-section horizontally */
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background: rgba(18, 18, 28, 0.9); /* Darker, almost black */
  border-bottom: 1px solid rgba(0, 255, 255, 0.2); /* Subtle neon border */
  box-shadow: 0 2px 15px rgba(0, 255, 255, 0.3);
  color: #00ffff; /* Neon cyan text */
  z-index: 10;
}

.header-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  box-shadow: 0 0 10px #00ffff;
  background-color: #00ffff;
  color: #1a0f26;
  overflow: hidden; /* Ensure image content is clipped to the circle */
}

.header-logo img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Cover the area, cropping if necessary */
  border-radius: 50%; /* Ensure the image itself is circular */
}

.user-avatar {
  position: relative; /* Add this for dropdown positioning */
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #ff00ff; /* Neon magenta for user avatar */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #1a0f26;
  box-shadow: 0 0 15px #ff00ff;
  cursor: pointer; /* Changed cursor to pointer as it's now clickable */
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Cover the area, cropping if necessary */
  border-radius: 50%; /* Ensure the image itself is circular */
}

.user-dropdown {
  position: absolute;
  top: 60px; /* Position below the avatar */
  right: 0;
  background-color: rgba(18, 18, 28, 0.95); /* Darker background, slightly transparent */
  border: 1px solid rgba(0, 255, 255, 0.3); /* Neon border */
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 255, 255, 0.4);
  z-index: 100;
  min-width: 150px;
  padding: 10px 0;
}

.dropdown-item {
  padding: 10px 20px;
  color: #00ffff; /* Neon cyan text */
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
  font-size: 16px;
}

.dropdown-item:hover {
  background-color: rgba(0, 255, 255, 0.2); /* Highlight on hover */
  color: #00ff00; /* Change color on hover */
}

.sidebar {
  width: 300px;
  background: rgba(18, 18, 28, 0.9); /* Darker, almost black */
  padding: 20px;
  border-right: 1px solid rgba(0, 255, 255, 0.2); /* Subtle neon border */
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
}

.sidebar h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #00ffff; /* Neon cyan */
  text-shadow: 0 0 8px #00ffff;
}

.history-list {
  list-style: none;
  padding: 0;
  margin: 0;
  overflow-y: auto;
  flex-grow: 1;
}

.history-list li {
  padding: 10px;
  border-bottom: 1px solid rgba(0, 255, 255, 0.1);
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #aaffff; /* Lighter neon text */
}

.history-list li:hover {
  background-color: rgba(0, 255, 255, 0.1);
  color: #00ffff;
  font-weight: bold;
}

.history-list li.active {
  background-color: rgba(0, 255, 255, 0.2);
  font-weight: bold;
  color: #00ffff;
}

.chat-inner {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: rgba(25, 25, 35, 0.9); /* Dark chat area background */
  box-sizing: border-box;
  border-left: 1px solid rgba(0, 255, 255, 0.1);
  border-right: 1px solid rgba(0, 255, 255, 0.1);
}

.system-prompt-section {
  width: 300px;
  background: rgba(18, 18, 28, 0.9); /* Darker, almost black */
  padding: 20px;
  border-left: 1px solid rgba(0, 255, 255, 0.2); /* Subtle neon border */
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
}

.system-prompt-section h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #00ffff; /* Neon cyan */
  text-shadow: 0 0 8px #00ffff;
}

.system-prompt-section textarea {
  width: 100%;
  height: 150px;
  padding: 10px;
  border: 1px solid rgba(0, 255, 255, 0.3); /* Neon border */
  border-radius: 8px;
  resize: vertical;
  font-size: 16px;
  margin-bottom: 10px;
  background: rgba(0, 0, 0, 0.7); /* Dark input background */
  color: #00ff00; /* Green neon text */
  box-shadow: 0 0 5px rgba(0, 255, 255, 0.2);
}

.system-prompt-section textarea:focus {
  outline: none;
  border-color: #00ffff; /* Brighter neon on focus */
  box-shadow: 0 0 10px #00ffff;
}

.system-prompt-section button {
  padding: 10px 15px;
  background-color: #00ffff; /* Neon cyan button */
  color: #0a0510; /* Dark text for contrast */
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s, box-shadow 0.2s;
  box-shadow: 0 0 10px #00ffff;
}

.system-prompt-section button:hover {
  background-color: #00ccff;
  box-shadow: 0 0 20px #00ffff;
}

.chat-title {
  flex-grow: 1;
  text-align: center;
  font-size: 1.8em;
  font-weight: bold;
  text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff;
}

.chat-id {
  font-size: 12px;
  color: #aaffff; /* Lighter neon */
  margin-left: 12px;
}

.back-link {
  font-size: 15px;
  color: #00ff00; /* Neon green link */
  text-decoration: none;
  background: rgba(0, 0, 0, 0.5);
  padding: 4px 14px;
  border-radius: 8px;
  transition: background 0.2s, box-shadow 0.2s, color 0.2s;
  border: 1px solid #00ff00;
  box-shadow: 0 0 8px #00ff00;
}

.back-link:hover {
  background: rgba(0, 255, 0, 0.2);
  color: #00ff00;
  box-shadow: 0 0 15px #00ff00;
}

.chat-main {
  flex: 1;
  overflow-y: auto;
  padding: 24px 24px 24px 24px;
  background: #1a1a2e; /* Even darker chat background */
  max-height: calc(100vh - 200px);
}
.chat-footer {
  position: sticky;
  height: 119px;
  bottom: 0;
  background: rgba(30, 30, 45, 0.9); /* Darker footer */
  z-index: 2;
  display: flex;
  gap: 12px;
  padding: 18px 32px;
  border-top: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 0; /* Sharp corners */
  box-shadow: 0 -2px 10px rgba(0, 255, 255, 0.2);
}

.chat-history {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.chat-msg {
  display: flex;
  align-items: flex-end;
  max-width: 100%;
  margin-bottom: 2px;
  animation: msgIn 0.3s;
}

@keyframes msgIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: none; }
}

.chat-msg.user {
  align-self: flex-end;
  flex-direction: row;
  justify-content: flex-end;
  margin-left: 2vw;
  margin-bottom: 10px;
}

.chat-msg.user .msg-content {
  order: 1;
  margin-right: 10px;
  margin-left: 0;
  max-width: 80%;
  background: #0056b3; /* Darker blue for user messages */
  color: #e0eaff; /* Light text */
  border: 1px solid #00ffff; /* Neon border */
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.3); /* Neon glow */
}

.chat-msg.user .msg-avatar {
  order: 2;
  margin-left: 0;
  margin-right: 1 px;
}

.chat-msg.ai {
  align-self: flex-start;
  max-width: 90%;
  margin-bottom: 10px;
}

.msg-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #00ffff; /* Neon cyan avatar */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  margin: 0 8px;
  box-shadow: 0 0 15px #00ffff; /* Strong neon glow */
  color: #1a0f26;
}

.chat-msg.ai .msg-avatar {
  margin-left: 8px;
  margin-right: 8px;
}

.chat-msg.user .msg-avatar {
  margin-right: 8px;
  margin-left: 8px;
  background: #ff00ff; /* Neon magenta for user avatar */
  box-shadow: 0 0 15px #ff00ff;
}

.user-avatar {
  background: #ff00ff;
  color: #fff;
}

.msg-content {
  padding: 14px 22px;
  border-radius: 18px;
  background: #0d0d1a; /* Dark background for AI messages */
  color: #00ff00; /* Neon green text for AI */
  font-size: 17px;
  word-break: break-word;
  box-shadow: 0 0 10px rgba(0, 255, 0, 0.3); /* Neon glow */
  transition: background 0.2s;
  border: 1px solid rgba(0, 255, 0, 0.2);
}

/* 统一 Markdown 子元素的颜色 */
:deep(.msg-content h3,
.msg-content h4) {
  color: #f6f9fc;        /* 标题颜色 */
}

.chat-msg.user .msg-content {
  background: #1a1a2e;
  color: #00ffff; /* Neon cyan for user message text */
}

.streaming {
  opacity: 0.8;
  font-style: italic;
  color: #00ffff; /* Neon cyan for streaming text */
  text-shadow: 0 0 5px #00ffff;
}


.chat-footer input {
  flex: 1;
  padding: 12px 22px;
  border: 1.5px solid rgba(0, 255, 255, 0.3); /* Neon border */
  border-radius: 24px;
  font-size: 17px;
  outline: none;
  background: rgba(0, 0, 0, 0.7); /* Dark input background */
  color: #00ff00; /* Green neon text */
  box-shadow: 0 0 8px rgba(0, 255, 255, 0.2);
}

.chat-footer input:focus {
  border: 1.5px solid #00ffff; /* Brighter neon on focus */
  box-shadow: 0 0 15px #00ffff;
}

.chat-footer button {
  padding: 12px 28px;
  background-color: #00ffff; /* Neon cyan button */
  color: #1a0f26; /* Dark text for contrast */
  border: none;
  border-radius: 24px;
  cursor: pointer;
  font-size: 17px;
  font-weight: 600;
  transition: background-color 0.2s, box-shadow 0.2s;
  box-shadow: 0 0 10px #00ffff;
}

.chat-footer button:disabled {
  background: rgba(0, 255, 255, 0.3);
  cursor: not-allowed;
  color: #0a0510;
  box-shadow: none;
}

.loading-dot {
  letter-spacing: 2px;
  color: #00ffff; /* Neon cyan loading dots */
  animation: blink 1s infinite alternate;
  text-shadow: 0 0 5px #00ffff;
}

@keyframes blink {
  from { opacity: 0.5; }
  to { opacity: 1; }
}

@media (max-width: 700px) {
  .chat-page {
    flex-direction: column;
    height: auto;
  }
  .sidebar, .system-prompt-section {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid rgba(0, 255, 255, 0.2);
    box-shadow: none;
  }
  .chat-inner {
    height: auto;
    border-left: none;
    border-right: none;
  }
  .chat-main {
    max-height: 60vh;
  }
  .chat-header {
    border-radius: 0;
  }
  .chat-footer {
    border-radius: 0;
  }
}
</style> 