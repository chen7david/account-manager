const router = require('koa-router')()
const controller = require('../controllers/DeviceController')
const { validation, worker  } = require('../middleware')

router.param('id', controller.loadInstance)
router.use('/devices', worker.loadFromAccessToken, worker.hasAnyRole('admin'))

/* DEVICES */
router.get('/devices', controller.index)
router.get('/devices/:id', controller.view)
router.get('/devices/:id/tokens', controller.getRelated('tokens'))
router.delete('/devices/:id', controller.delete)
router.patch('/devices/:id',
    validation.validate(validation.schema.updateDevice),
    controller.update
)

module.exports = router