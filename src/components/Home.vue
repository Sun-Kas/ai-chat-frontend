<template>
  <div class="chat-page">
    <header class="chat-header">
      <router-link to="/home" class="header-logo">
        <img :src="logoImage" alt="Logo" />
      </router-link>
      <div class="user-avatar" @click="toggleUserDropdown">
        <img :src="userAvatarImage" alt="User Avatar" />
        <div v-if="showUserDropdown" class="user-dropdown">
          <div class="dropdown-item" @click.stop="goToPersonalCenter">个人中心</div>
          <div class="dropdown-item" @click.stop="goToRegister">注册</div>
        </div>
      </div>
    </header>
    <div class="main-content-area">
      <div class="chat-inner">
        <div class="home-card">
          <h1><span class="glitch" data-text="AI 应用中心">AI 应用中心</span></h1>
          <div class="app-list">
            <router-link to="/chat" class="app-link">
              <span class="icon">💬</span>
              <span class="link-text">AI 聊天室</span>
            </router-link>
            <router-link to="/agent" class="app-link">
              <span class="icon">🤖</span>
              <span class="link-text">AI 超级智能体</span>
            </router-link>
            <router-link to="/rag" class="app-link">
              <span class="icon">📚</span>
              <span class="link-text">RAG</span>
            </router-link>
            <router-link to="/mcp" class="app-link">
              <span class="icon">🗺️</span>
              <span class="link-text">MCP</span>
            </router-link>
            <router-link to="/prompt-template" class="app-link">
              <span class="icon">📝</span>
              <span class="link-text">Prompt 模板</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import logoImage from '@/assets/image/头像.png'
import userAvatarImage from '@/assets/image/用户头像.png'

const showUserDropdown = ref(false)
const router = useRouter()

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
@import url('https://fonts.googleapis.com/css2?family=Oxanium:wght@400;700&display=swap');

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
  justify-content: center; /* Center content horizontally */
  align-items: center; /* Center content vertically */
  background: rgba(25, 25, 35, 0.9);
}

.chat-inner {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: rgba(25, 25, 35, 0.9); /* Dark chat area background */
  box-sizing: border-box;
  border-left: 1px solid rgba(0, 255, 255, 0.1);
  border-right: 1px solid rgba(0, 255, 255, 0.1);
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background: rgba(25, 25, 35, 0.9); /* Dark, moody background */; /* Darker, almost black */
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
  overflow: hidden;
}

.header-logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.user-avatar {
  position: relative;
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
  cursor: pointer;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Cover the area, cropping if necessary */
  border-radius: 50%; /* Ensure the image itself is circular */
}

.user-dropdown {
  position: absolute;
  top: 60px;
  right: 0;
  background-color: rgba(18, 18, 28, 0.95);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 255, 255, 0.4);
  z-index: 100;
  min-width: 150px;
  padding: 10px 0;
}

.dropdown-item {
  padding: 10px 20px;
  color: #00ffff;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
  font-size: 16px;
}

.dropdown-item:hover {
  background-color: rgba(0, 255, 255, 0.2);
  color: #00ff00;
}

.chat-title {
  flex-grow: 1;
  text-align: center;
  font-size: 1.8em;
  font-weight: bold;
  text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff;
}

.home-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a0f26 0%, #0a0510 100%); /* Dark, moody background */
  margin: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.home-card {
  background: rgba(18, 18, 28, 0.9); /* Darker, almost black */
  border-radius: 12px;
  box-shadow: 0 0 30px rgba(0, 255, 255, 0.5), inset 0 0 10px rgba(0, 255, 255, 0.3); /* Cyan glow */
  padding: 48px 36px 36px 36px;
  min-width: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid rgba(0, 255, 255, 0.2); /* Subtle border */
}

h1 {
  font-family: 'Oxanium', cursive; /* Cyberpunk-style font */
  font-size: 3.5em;
  color: #00ffff; /* Neon cyan */
  text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff; /* Glowing text */
  margin-bottom: 40px;
  letter-spacing: 3px;
  position: relative;
  animation: glitch-anim 2s infinite alternate;
}

/* Glitch effect for H1 */
.glitch::before, .glitch::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(18, 18, 28, 0.9);
}

.glitch::before {
  left: -2px;
  text-shadow: 1px 0 #ff00ff; /* Magenta shadow */
  clip: rect(44px, 450px, 56px, 0);
  animation: glitch-anim-1 2s infinite alternate-reverse;
}

.glitch::after {
  left: 2px;
  text-shadow: -1px 0 #00ff00; /* Green shadow */
  clip: rect(85px, 450px, 100px, 0);
  animation: glitch-anim-2 2s infinite alternate-reverse;
}

@keyframes glitch-anim {
  0% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
  100% { transform: translate(0); }
}

@keyframes glitch-anim-1 {
  0% { clip: rect(100px, 9999px, 0, 0); }
  20% { clip: rect(20px, 9999px, 60px, 0); }
  40% { clip: rect(80px, 9999px, 40px, 0); }
  60% { clip: rect(0, 9999px, 100px, 0); }
  80% { clip: rect(60px, 9999px, 20px, 0); }
  100% { clip: rect(40px, 9999px, 80px, 0); }
}

@keyframes glitch-anim-2 {
  0% { clip: rect(0, 9999px, 100px, 0); }
  20% { clip: rect(60px, 9999px, 20px, 0); }
  40% { clip: rect(40px, 9999px, 80px, 0); }
  60% { clip: rect(20px, 9999px, 60px, 0); }
  80% { clip: rect(100px, 9999px, 0, 0); }
  100% { clip: rect(80px, 9999px, 40px, 0); }
}

.app-list {
  display: flex;
  flex-direction: row;
  gap: 28px;
  margin-top: 36px;
  width: 100%;
  flex-wrap: wrap;
  justify-content: center;
}

.app-link {
  display: flex;
  align-items: center;
  gap: 16px;
  justify-content: flex-start;
  padding: 18px 32px;
  font-size: 1.8em;
  background: rgba(0, 0, 0, 0.7); /* Darker link background */
  border-radius: 8px;
  text-decoration: none;
  color: #00ffff; /* Neon cyan text */
  font-weight: 500;
  border: 1px solid rgba(0, 255, 255, 0.3); /* Subtle neon border */
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.2); /* Initial glow */
  transition: all 0.3s ease-in-out;
  cursor: pointer;
  flex-basis: calc(50% - 14px); /* Adjust for two columns with gap */
}

.app-link .icon {
  font-size: 2em; /* Larger icons */
  text-shadow: 0 0 8px #00ffff, 0 0 15px #00ffff; /* Icon glow */
}

.app-link .link-text {
  color: #00ffff; /* Ensure text is neon */
  text-shadow: 0 0 5px #00ffff;
}

.app-link:hover {
  background: rgba(0, 255, 255, 0.1); /* Lighter neon background on hover */
  border-color: #00ffff; /* Solid neon border on hover */
  box-shadow: 0 0 20px #00ffff, 0 0 40px #00ffff; /* Stronger glow on hover */
  transform: translateY(-3px); /* Slight lift effect */
}

.app-link:hover .link-text {
  text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff;
}

@media (max-width: 768px) {
  .app-link {
    flex-basis: 100%; /* Full width on smaller screens */
  }
}

@media (max-width: 600px) {
  .home-card {
    padding: 32px 8px 24px 8px;
    min-width: unset;
    width: 98vw;
  }
  h1 {
    font-size: 2.5em;
  }
  .app-link {
    font-size: 1.2em;
    padding: 14px 10px;
  }
}
</style> 