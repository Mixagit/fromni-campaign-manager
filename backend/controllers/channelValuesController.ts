import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'

const prisma = new PrismaClient()

interface IButton {
	type: string
	keyboard_type: string
	text?: string
	url?: string
	channelValuesId: number
}

class ChannelValuesController {
	async getValues(req: Request, res: Response) {
		const { channelName } = req.params

		try {
			let channelValues = await prisma.channelValues.findFirst({
				where: {
					channel: {
						channel_name: channelName,
					},
				},
				include: {
					buttons: true,
				},
			})

			if (!channelValues) {
				const defaultChannelSettings = await prisma.channelSettings.findFirst({
					where: {
						channel_name: channelName,
					},
				})

				if (!defaultChannelSettings) {
					return res.status(404).json({ error: 'Channel settings not found' })
				}

				channelValues = await prisma.channelValues.create({
					data: {
						text: '',
						channel: {
							connect: {
								channel_name: channelName,
							},
						},
					},
					include: {
						buttons: true,
					},
				})
			}

			res.json(channelValues)
		} catch (error) {
			console.error(error)
			res.status(500).json({ error: 'Internal Server Error' })
		}
	}

	async saveValues(req: Request, res: Response) {
		const values = req.body

		try {
			const channelSettings = await prisma.channelSettings.findUnique({
				where: { id: values.channel_id },
			})

			if (!channelSettings) {
				return res.status(404).json({ error: 'Channel not found' })
			}

			let channelValues = await prisma.channelValues.findFirst({
				where: { channel_id: values.channel_id },
			})

			if (!channelValues) {
				return res.status(404).json({ error: 'Channel values not found' })
			}

			channelValues = await prisma.channelValues.update({
				where: { id: channelValues.id },
				data: {
					text: values.text,
				},
			})

			if (values.buttons) {
				await prisma.keyboardButtons.deleteMany({
					where: { channelValuesId: channelValues.id },
				})

				const buttonsData = values.buttons.map((button: IButton) => {
					return {
						type: button.type,
						keyboard_type: button.keyboard_type,
						text: button.text || '',
						url: button.url || '',
						channelValuesId: channelValues?.id,
					}
				})

				await prisma.keyboardButtons.createMany({
					data: buttonsData,
				})
			}

			res.json(channelValues)
		} catch (error) {
			console.error(error)
			res.status(500).json({ error: 'Internal Server Error' })
		}
	}
}

export default new ChannelValuesController()
