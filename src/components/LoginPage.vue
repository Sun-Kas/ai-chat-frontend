<template>
  <div class="login-page">
     <!-- 背景图片容器 - 在这里添加你的背景图片 -->
     <div class="background-image"></div>
    <div class="login-container">
      <h2 class="login-title">用户登录</h2>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="username">用户名:</label>
          <input type="text" id="username" v-model="username" required />
        </div>
        <div class="form-group">
          <label for="password">密码:</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <button type="submit" class="login-button">登录</button>
      </form>
      <p v-if="loginError" class="error-message">{{ loginError }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const loginError = ref('')
const router = useRouter()

const handleLogin = () => {
  loginError.value = ''
  // 简单的模拟登录逻辑
  if (username.value === 'user' && password.value === 'password') {
    // 登录成功，跳转到 Home.vue
    router.push('/home')
  } else {
    loginError.value = '用户名或密码错误'
  }
}
</script>

<style scoped>
.login-page {
    width: 100vw;
    height: 100vh;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    margin: 0;
    padding: 0;
    overflow: hidden;
}
.background-image {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    /* 添加背景图片的地方 */
    background-image: url('@/assets/image/首页背景.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    z-index: -1;
  }
.login-container {
  background: #fff;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  max-width: 400px;
}

.login-title {
  font-size: 28px;
  color: #409eff;
  margin-bottom: 30px;
  font-weight: 700;
}

.login-form .form-group {
  margin-bottom: 20px;
  text-align: left;
}

.login-form label {
  display: block;
  font-size: 16px;
  color: #555;
  margin-bottom: 8px;
}

.login-form input[type="text"],
.login-form input[type="password"] {
  width: calc(100% - 20px);
  padding: 12px 10px;
  border: 1px solid #e0eaff;
  border-radius: 8px;
  font-size: 16px;
  color: #333;
  transition: border-color 0.3s;
}

.login-form input[type="text"]:focus,
.login-form input[type="password"]:focus {
  border-color: #409eff;
  outline: none;
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.2);
}

.login-button {
  width: 100%;
  padding: 14px;
  background: linear-gradient(90deg, #409eff 0%, #79bbff 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;
  margin-top: 20px;
}

.login-button:hover {
  background: linear-gradient(90deg, #3a8ee6 0%, #66b1ff 100%);
  transform: translateY(-2px);
}

.login-button:active {
  transform: translateY(0);
}

.error-message {
  color: #ff4949;
  margin-top: 15px;
  font-size: 14px;
}

</style> 