<template>
	<div class="channel-form">
		<h2>Настройка кампании</h2>

		<vue-draggable-next
			v-model="channels"
			group="channels"
			class="channels-list"
		>
			<div
				v-for="channel in channels"
				:key="channel"
				:class="{
					'channel-item': true,
					'selected-channel': isSelected(channel),
				}"
				@click="selectChannel(channel)"
				@mousedown.prevent
			>
				<div
					class="handle"
					@mousedown.stop="startDrag(channel)"
					@click.stop="preventClick"
				>
					☰
				</div>
				<div class="content">
					{{ channel }}
				</div>
				<button @click.stop="goToSettings(channel)" class="btn-settings">
					Настроить
				</button>
			</div>
		</vue-draggable-next>
		<button @click.prevent="sendCampaign" class="btn-send">Отправить</button>
	</div>
</template>

<script setup>
import axios from 'axios'
import { computed, onMounted, ref } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'
import { useRouter } from 'vue-router'

const router = useRouter()
const apiUrl = import.meta.env.VITE_API

const channels = ref([])
const draggedChannel = ref(null)
const selectedChannels = ref([])

const sortedSelectedChannels = computed(() => {
	return channels.value.filter(channel =>
		selectedChannels.value.includes(channel)
	)
})

const startDrag = channel => {
	draggedChannel.value = channel
}

const isSelected = channel => {
	return selectedChannels.value.includes(channel)
}

const selectChannel = channel => {
	if (isSelected(channel)) {
		selectedChannels.value = selectedChannels.value.filter(
			selected => selected !== channel
		)
	} else {
		selectedChannels.value.push(channel)
	}
}

const goToSettings = channel => {
	if (router) {
		router.push({ name: 'channelSettings', params: { channel } })
	} else {
		console.error('Router не инициализирован.')
	}
}

const sendCampaign = async () => {
	// на сервере метод не реализован, но в него бы передавались sortedSelectedChannels и настройки всех каналов
	try {
		await axios.post(`${apiUrl}send-campaign`, sortedSelectedChannels)
	} catch (error) {
		console.error('Ошибка отправки кампании:', error)
	}
}

onMounted(async () => {
	await loadDefaultChannels()
	try {
		const response = await axios.get(`${apiUrl}read-channel-list/`)
		channels.value = response.data
	} catch (error) {
		console.error('Ошибка загрузки списка каналов с сервера:', error)
	}
})

const loadDefaultChannels = async () => {
	const vkontakte = {
		channel_name: 'VKontakte',
		message_max_characters: 4096,
		keyboard_standart_supported: true,
		keyboard_standart_max_buttons: 40,
		keyboard_standart_max_button_characters: -1,
		keyboard_standart_link_buttons_supported: true,
		keyboard_inline_supported: true,
		keyboard_inline_max_buttons: 10,
		keyboard_inline_max_button_characters: -1,
		keyboard_inline_link_buttons_supported: false,
	}
	const whatsapp = {
		channel_name: 'WhatsApp',
		message_max_characters: 1000,
		keyboard_standart_supported: true,
		keyboard_standart_max_buttons: 10,
		keyboard_standart_max_button_characters: 20,
		keyboard_standart_link_buttons_supported: false,
		keyboard_inline_supported: true,
		keyboard_inline_max_buttons: 3,
		keyboard_inline_max_button_characters: 20,
		keyboard_inline_link_buttons_supported: true,
		linkButtonsLimit: 1,
	}
	const telegram = {
		channel_name: 'Telegram',
		message_max_characters: 4096,
		keyboard_standart_supported: true,
		keyboard_standart_max_buttons: -1,
		keyboard_standart_max_button_characters: -1,
		keyboard_standart_link_buttons_supported: false,
		keyboard_inline_supported: true,
		keyboard_inline_max_buttons: -1,
		keyboard_inline_max_button_characters: 64,
		keyboard_inline_link_buttons_supported: true,
	}
	const sms = {
		channel_name: 'SMS',
		message_max_characters: -1,
		keyboard_standart_supported: false,
		keyboard_inline_supported: false,
	}
	try {
		await axios.post(`${apiUrl}create-channel`, vkontakte)
		await axios.post(`${apiUrl}create-channel`, whatsapp)
		await axios.post(`${apiUrl}create-channel`, telegram)
		await axios.post(`${apiUrl}create-channel`, sms)
	} catch (error) {
		console.error('Ошибка добавления стандартных каналов', error)
	}
}
</script>

<style scoped>
.channel-form {
	max-width: 400px;
	margin: 20px auto;
	padding: 20px;
	border: 1px solid #ddd;
	border-radius: 8px;
}

.channels-list {
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.channel-item {
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 8px;
	border: 1px solid #ddd;
	cursor: pointer;
	user-select: none;
	transition: background-color 0.3s;
}
.channel-item:hover {
	scale: 1.02;
	background-color: #f5f5f5;
}

.handle {
	cursor: grab;
	user-select: none;
}

.handle:hover {
	scale: 1.2;
}

.content {
	flex-grow: 1;
}

.selected-channel {
	background-color: #81b0ab;
	color: white;
}

.selected-channel:hover {
	background-color: #5a837f;
}

button {
	color: white;
	border: none;
	padding: 10px;
	border-radius: 4px;
	cursor: pointer;
	transition: background-color 0.3s;
}
.btn-settings {
	background-color: #495c82;
}
.btn-settings:hover {
	scale: 1.03;
	background-color: #272b60;
}
.btn-send {
	width: 150px;
	margin-top: 20px;
	background-color: #61bc66;
}
.btn-send:hover {
	scale: 1.03;
	background-color: #347637;
}
</style>
