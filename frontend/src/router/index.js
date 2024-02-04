import { createRouter, createWebHistory } from 'vue-router'
import ChannelForm from '../components/ChannelForm.vue'
import ChannelSettings from '../components/ChannelSettings.vue'

const routes = [
	{
		path: '/',
		name: 'channelForm',
		component: ChannelForm,
	},
	{
		path: '/channel-settings/:channel',
		name: 'channelSettings',
		component: ChannelSettings,
	},
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

export default router
