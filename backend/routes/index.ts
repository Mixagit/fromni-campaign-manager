import { Router } from 'express'
import channelCapabilityController from '../controllers/channelCapabilityController'
import channelValuesController from '../controllers/channelValuesController'

const router = Router()

router.get('/read-channel-list', channelCapabilityController.getChannels)
router.post('/create-channel', channelCapabilityController.addChannel)
router.get(
	'/read-channel-capability/:channelName',
	channelCapabilityController.getCapability
)

router.get(
	'/read-channel-settings-values/:channelName',
	channelValuesController.getValues
)
router.post(
	'/update-channel-settings-values',
	channelValuesController.saveValues
)

export default router
