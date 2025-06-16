import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import Home from './components/Home.vue'
import ChatPage from './components/ChatPage.vue'
import AgentPage from './components/AgentPage.vue'
import LoginPage from './components/LoginPage.vue'
import RagPage from './components/RagPage.vue'
import McpPage from './components/McpPage.vue'
import PromptTemplatePage from './components/PromptTemplatePage.vue'
import PersonalCenter from './components/PersonalCenter.vue'

const routes = [
  { path: '/', component: LoginPage },
  { path: '/home', component: Home },
  { path: '/chat', component: ChatPage },
  { path: '/agent', component: AgentPage },
  { path: '/rag', component: RagPage },
  { path: '/mcp', component: McpPage },
  { path: '/prompt-template', component: PromptTemplatePage },
  { path: '/personal-center', component: PersonalCenter },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const app = createApp(App)
app.use(router)
app.mount('#app')
