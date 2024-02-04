import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'

const prisma = new PrismaClient()

class ChannelCapabilityController {
	async getChannels(req: Request, res: Response) {
		try {
			const channels = await prisma.channelSettings.findMany({
				select: {
					channel_name: true,
				},
			})

			const channelNames = channels.map(channel => channel.channel_name)

			res.json(channelNames)
		} catch (error) {
			console.error('Error fetching channel names:', error)
			res.status(500).json({ error: 'Internal Server Error' })
		}
	}

	async addChannel(req: Request, res: Response) {
		const settings = req.body

		if (!settings) {
			return res.status(400).json({ error: 'Missing required parameters' })
		}

		try {
			const channel = await prisma.channelSettings.findUnique({
				where: { channel_name: settings.channel_name },
			})
			if (channel) {
				return res.status(404).json({ error: 'Channel already exist' })
			}

			await prisma.channelSettings.create({
				data: {
					channel_name: settings.channel_name,
					message_max_characters: settings.message_max_characters,
					keyboard_standart_supported: settings.keyboard_standart_supported,
					keyboard_standart_max_buttons: settings.keyboard_standart_max_buttons,
					keyboard_standart_max_button_characters:
						settings.keyboard_standart_max_button_characters,
					keyboard_standart_link_buttons_supported:
						settings.keyboard_standart_link_buttons_supported,
					keyboard_inline_supported: settings.keyboard_inline_supported,
					keyboard_inline_max_buttons: settings.keyboard_inline_max_buttons,
					keyboard_inline_max_button_characters:
						settings.keyboard_inline_max_button_characters,
					keyboard_inline_link_buttons_supported:
						settings.keyboard_inline_link_buttons_supported,
				},
			})
			res.json({ success: true })
		} catch (error) {
			console.error(error)
			res.status(500).json({ error: 'Internal Server Error' })
		}
	}

	async getCapability(req: Request, res: Response) {
		const { channelName } = req.params

		try {
			const channelSettings = await prisma.channelSettings.findUnique({
				where: { channel_name: channelName },
			})

			if (!channelSettings) {
				return res.status(404).json({ error: 'Channel not found' })
			}

			res.json(channelSettings)
		} catch (error) {
			console.error(error)
			res.status(500).json({ error: 'Internal Server Error' })
		}
	}
}

export default new ChannelCapabilityController()
