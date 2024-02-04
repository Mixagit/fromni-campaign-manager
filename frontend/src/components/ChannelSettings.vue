<template>
	<div class="channel-settings">
		<h2>Настройки канала {{ selectedChannel }}</h2>

		<form @submit.prevent="saveSettings">
			<div class="form-group">
				<label for="channelText">Текст сообщения:</label>
				<textarea
					v-model="channelValues.text"
					:maxlength="channelSettings.message_max_characters"
					id="channelText"
				></textarea>
				<div class="count">
					{{ channelValues.text?.length }}/{{
						channelSettings.message_max_characters > 0
							? channelSettings.message_max_characters
							: '∞'
					}}
				</div>
			</div>
			<div
				class="keyboards"
				v-if="
					channelSettings.keyboard_standart_supported ||
					channelSettings.keyboard_inline_supported
				"
			>
				<div class="form-group">
					<label for="selectedKeyboard">Настройки клавиатуры:</label>
					<select v-model="selectedKeyboard" id="selectedKeyboard">
						<option
							value="standart"
							v-if="channelSettings.keyboard_standart_supported"
						>
							Standart
						</option>
						<option
							value="inline"
							v-if="channelSettings.keyboard_inline_supported"
						>
							Inline
						</option>
					</select>
				</div>

				<div class="keyboardsButtons from-group">
					<div class="count-keyboard-btns">
						<label>Кнопки клавиатуры:</label>
						<div class="count">
							{{
								channelValues.buttons?.filter(
									button => button.keyboard_type === selectedKeyboard
								).length
							}}/{{
								channelSettings[`keyboard_${selectedKeyboard}_max_buttons`] > 0
									? channelSettings[`keyboard_${selectedKeyboard}_max_buttons`]
									: '∞'
							}}
						</div>
					</div>

					<div v-for="btn in channelValues.buttons">
						<div
							v-if="btn.keyboard_type === selectedKeyboard"
							class="keyboard-btn"
						>
							<input
								:maxlength="
									channelSettings[
										`keyboard_${selectedKeyboard}_max_button_characters`
									]
								"
								v-model="btn.text"
								type="text"
								placeholder="Текст кнопки"
							/>
							<input
								v-if="btn.type === 'link'"
								v-model="btn.url"
								type="url"
								placeholder="Ссылка"
							/>
							<button
								type="button"
								@click="removeButton(btn)"
								class="btn-remove"
							>
								Удалить
							</button>
						</div>
					</div>

					<div class="keyboard-add-btns">
						<button type="button" @click="addButton(false)" class="btn-add">
							Добавить кнопку
						</button>
						<button
							v-if="
								channelSettings[
									`keyboard_${selectedKeyboard}_link_buttons_supported`
								]
							"
							type="button"
							@click="addButton(true)"
							class="btn-add btn-add-link"
						>
							Добавить кнопку-ссылку
						</button>
					</div>
				</div>
			</div>

			<button type="submit" class="btn-save">Сохранить</button>
		</form>
	</div>
</template>

<script setup>
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
const router = useRoute()
const apiUrl = import.meta.env.VITE_API

const selectedChannel = ref(router.params.channel)

const channelSettings = ref({})
const channelValues = ref({})

const selectedKeyboard = ref('standart')

const addButton = (isLink = false) => {
	const btns = channelValues.value.buttons
	const curBtns = btns.filter(
		button => button.keyboard_type === selectedKeyboard.value
	).length
	const maxBtns =
		channelSettings.value[`keyboard_${selectedKeyboard.value}_max_buttons`]

	if (curBtns < maxBtns || maxBtns === -1) {
		if (!isLink) {
			btns.push({
				id: new Date().getTime(),
				type: 'quick_reply',
				keyboard_type: `${selectedKeyboard.value}`,
				text: '',
			})
		} else {
			btns.push({
				id: new Date().getTime(),
				type: 'link',
				keyboard_type: `${selectedKeyboard.value}`,
				text: '',
				url: '',
			})
		}
	}
}

const removeButton = btn => {
	channelValues.value.buttons = channelValues.value.buttons.filter(
		button => button.id !== btn.id
	)
}

const saveSettings = async () => {
	try {
		await axios.post(
			`${apiUrl}update-channel-settings-values`,
			channelValues.value
		)
	} catch (error) {
		console.error('Ошибка при сохранении настроек:', error.message)
	}
}

onMounted(async () => {
	try {
		const settings = await axios.get(
			`${apiUrl}read-channel-capability/${router.params.channel}`
		)

		channelSettings.value = settings.data
	} catch (error) {
		console.error('Ошибка загрузки настроек канала с сервера:', error)
	}
	try {
		const values = await axios.get(
			`${apiUrl}/read-channel-settings-values/${router.params.channel}/`
		)

		channelValues.value = values.data
	} catch (error) {
		console.error('Ошибка загрузки значений настроек с сервера:', error)
	}
})
</script>

<style scoped>
.channel-settings {
	max-width: 600px;
	margin: 20px auto;
	padding: 20px;
	border: 1px solid #ccc;
	border-radius: 8px;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.form-group {
	margin-bottom: 30px;
}

label {
	display: block;
	margin-bottom: 8px;
	font-weight: bold;
}

textarea,
input,
select {
	width: 100%;
	padding: 10px;
	box-sizing: border-box;
	border: 1px solid #ddd;
	border-radius: 4px;
	margin-top: 5px;
	font-size: 16px;
}

.count {
	font-size: 14px;
	margin-top: 5px;
	color: #555;
}

.keyboards {
	margin-top: 20px;
}

.keyboard-btn {
	display: flex;
	justify-content: space-between;
	margin-bottom: 15px;
}

button {
	color: white;
	border: none;
	padding: 10px;
	border-radius: 4px;
	cursor: pointer;
	transition: background-color 0.3s;
}
button:hover {
	scale: 1.03;
}
.btn-remove {
	width: 80px;
	margin-left: 40px;
	background-color: #94545f;
}
.btn-remove:hover {
	background-color: #8f414e;
}
.btn-add {
	background-color: #759caa;
}
.btn-add-link {
	margin-top: 20px;
	margin-left: 150px;
}
.btn-add:hover {
	background-color: #5f8998;
}
.btn-save {
	width: 150px;
	margin-top: 30px;
	background-color: #61bc66;
}

.btn-save:hover {
	background-color: #347637;
}
</style>
