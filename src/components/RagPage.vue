<template>
  <div class="chat-page">
    <header class="chat-header">
      <router-link to="/home" class="header-logo">
        <img :src="logoImage" alt="Logo" />
      </router-link>
      <span class="chat-title">🤖 RAG Page</span>
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
        <h1>RAG Page</h1>
        <p>This is the RAG page. Content to be added later.</p>
        <router-link to="/home">返回主页</router-link>
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

h1 {
  font-size: 3em;
  text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff;
  margin-bottom: 20px;
}

p {
  font-size: 1.2em;
  color: #aaffff;
}

.router-link-active, .router-link-active:hover {
  background: rgba(0, 255, 0, 0.2);
  color: #00ff00;
  box-shadow: 0 0 15px #00ff00;
  padding: 10px 20px;
  border-radius: 8px;
  text-decoration: none;
  margin-top: 20px;
  transition: all 0.3s ease-in-out;
  border: 1px solid #00ff00;
}
</style> 